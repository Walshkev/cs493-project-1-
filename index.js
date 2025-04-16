"use strict";

const express = require("express");
const app = express();

app.use(express.json());

const port = 8086;

let businesses = new Map();
let reviews = new Map();
let photos = new Map();

// dummy data was provided from chatgpt i hard coded it to make sure the results are consistent from the curl commands.
businesses.set(1, {
  details: {
    name: "Pizza Palace",
    streetAddress: "123 Main St",
    city: "Springfield",
    state: "IL",
    zipCode: "62701",
    phoneNumber: "555-123-4567",
    category: "Restaurant",
    subcategories: ["Pizza", "Italian"],
  },
  photos: [],
  reviews: [],
});

businesses.set(2, {
  details: {
    name: "Tech Haven",
    streetAddress: "456 Elm St",
    city: "Metropolis",
    state: "NY",
    zipCode: "10001",
    phoneNumber: "555-987-6543",
    category: "Electronics",
    subcategories: ["Computers", "Mobile Phones"],
  },
  photos: [],
  reviews: [],
});

// curl -X GET http://localhost:8086/businesses/1
app.get("/businesses/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const businessData = businesses.get(id);
  if (businessData) {
    res.status(200).json({
      details: businessData.details,
      links: {
        reviews: `/businesses/${id}/reviews`,
        photos: `/businesses/${id}/photos`,
      },
    });
  } else {
    res.status(404).json({ error: `businesses ${id} not found` });
  }
});

// curl -X GET http://localhost:8086/businesses
app.get("/businesses", (req, res) => {
  const businessArray = Array.from(businesses.entries()).map(([id, data]) => ({
    id,
    details: data.details,
    links: {
      self: `/businesses/${id}`,
    },
  }));
  res.json(businessArray);
});

// curl -X POST http://localhost:8086/businesses \
//     -H "Content-Type: application/json" \
//     -d '{
//         "name": "Sudo Cafe",
//         "streetAddress": "789 Oak St",
//         "city": "Gotham",
//         "state": "NJ",
//         "zipCode": "07001",
//         "phoneNumber": "555-555-5555",
//         "category": "Cafe",
//         "subcategories": ["Coffee", "Bakery"]
//     }'
app.post("/businesses", (req, res) => {
  const {
    name,
    streetAddress,
    city,
    state,
    zipCode,
    phoneNumber,
    category,
    subcategories,
  } = req.body;
  if (
    !name ||
    !streetAddress ||
    !city ||
    !state ||
    !zipCode ||
    !phoneNumber ||
    !category
  ) {
    return res.status(400).json({ error: "All fields are required" });
  }
  const id = businesses.size + 1;
  businesses.set(id, {
    details: {
      name,
      streetAddress,
      city,
      state,
      zipCode,
      phoneNumber,
      category,
      subcategories: subcategories || [],
    },
    photos: [], // Initialize photos as an empty array
    reviews: [], // Initialize reviews as an empty array
  });

  // Initialize empty entries for reviews and photos
  reviews.set(id, []);
  photos.set(id, []);

  res.status(201).json({
    id,
    links: {
      self: `/businesses/${id}`,
    },
  });
});

// curl -X DELETE http://localhost:8086/businesses/3

app.delete("/businesses/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (businesses.has(id)) {
    businesses.delete(id);
    res.status(204).json({ message: `businesses ${id} deleted` });
    console.log(`businesses ${id} deleted`);
  } else {
    res.status(404).json({ error: `businesses ${id} not found` });
    console.log(`businesses ${id} not found`);
  }
});

// curl -X GET http://localhost:8086/businesses/1
app.get("/businesses/:id/reviews", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const businessData = businesses.get(id);

  if (businessData) {
    res.json(businessData.reviews);
  } else {
    res.status(404).json({ error: `Reviews for businesses ${id} not found` });
  }
});

// curl -X DELETE http://localhost:8086/businesses/1/reviews/1
app.delete("/businesses/:id/reviews/:reviewId", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const reviewId = parseInt(req.params.reviewId, 10);
  const businessData = businesses.get(id);
  if (businessData) {
    const reviewIndex = businessData.reviews.findIndex(
      (review) => review.id === reviewId
    );
    if (reviewIndex === -1) {
      return res.status(404).json({ error: `Review ${reviewId} not found` });
    }
    businessData.reviews.splice(reviewIndex, 1); // Remove the review from the array
    res
      .status(204)
      .json({ message: `Review ${reviewId} deleted from businesses ${id}` });
  } else {
    res.status(404).json({ error: `businesses ${id} not found` });
  }
});

// curl -X DELETE http://localhost:8086/businesses/1/reviews/1
app.delete("/businesses/:id/photos/:photoId", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const photoId = parseInt(req.params.photoId, 10);
  const businessData = businesses.get(id);
  if (businessData) {
    const photoIndex = businessData.photos.findIndex(
      (photo) => photo.id === photoId
    );
    if (photoIndex === -1) {
      return res.status(404).json({ error: `photo ${photoId} not found` });
    }
    businessData.photos.splice(photoIndex, 1); // Remove the photo from the array
    res
      .status(204)
      .json({ message: `photo ${photoId} deleted from businesses ${id}` });
  } else {
    res.status(404).json({ error: `businesses ${id} not found` });
  }
});

// curl -X POST http://localhost:8086/businesses/1/reviews \
//     -H "Content-Type: application/json" \
//     -d '{
//         "starRating": 4,
//         "dollarRating": 3,
//         "review": "Great place with excellent service!"
//     }'
app.post("/businesses/:id/reviews", (req, res) => {
  const id = parseInt(req.params.id, 10);

  const { starRating, dollarRating, review } = req.body;
  if (starRating === undefined || dollarRating === undefined) {
    return res
      .status(400)
      .json({ error: "Star rating and dollar rating are required" });
  }
  if (
    starRating < 0 ||
    starRating > 5 ||
    dollarRating < 1 ||
    dollarRating > 4
  ) {
    return res
      .status(400)
      .json({
        error:
          "Star rating must be between 0 and 5, and dollar rating must be between 1 and 4",
      });
  }

  const businessData = businesses.get(id);
  if (businessData) {
    const reviewId = businessData.reviews.length + 1; // Generate a unique ID for the review
    const reviewEntry = {
      id: reviewId,
      starRating,
      dollarRating,
      content: review || null,
    };
    businessData.reviews.push(reviewEntry);
    res
      .status(201)
      .json({
        message: `Review added to businesses ${id}`,
        review: reviewEntry,
      });
  } else {
    res.status(404).json({ error: `businesses ${id} not found` });
  }
});

// curl -X POST http://localhost:8086/businesses/2 \
//     -H "Content-Type: application/json" \
//     -d '{
//         "name": "Updated Business Name",
//         "streetAddress": "123 Updated St",
//         "city": "Metropolis",
//         "state": "NY",
//         "zipCode": "10001",
//         "phoneNumber": "555-555-1234",
//         "category": "Updated Category",
//         "subcategories": ["Updated Subcategory1", "Updated Subcategory2"]
//     }'
app.put("/businesses/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const {
    name,
    streetAddress,
    city,
    state,
    zipCode,
    phoneNumber,
    category,
    subcategories,
  } = req.body;

  const businessData = businesses.get(id);
  if (!businessData) {
    return res.status(404).json({ error: `Business ${id} not found` });
  }
  if (
    !name &&
    !streetAddress &&
    !city &&
    !state &&
    !zipCode &&
    !phoneNumber &&
    !category &&
    !subcategories
  ) {
    return res
      .status(400)
      .json({ error: "At least one field is required to update" });
  }

  // Update only the provided fields
  if (name) businessData.details.name = name;
  if (streetAddress) businessData.details.streetAddress = streetAddress;
  if (city) businessData.details.city = city;
  if (state) businessData.details.state = state;
  if (zipCode) businessData.details.zipCode = zipCode;
  if (phoneNumber) businessData.details.phoneNumber = phoneNumber;
  if (category) businessData.details.category = category;
  if (subcategories) businessData.details.subcategories = subcategories;

  res
    .status(200)
    .json({
      message: `Business ${id} updated`,
      business: businessData.details,
    });
});

// curl -X POST http://localhost:8086/businesses/1/photos \
//     -H "Content-Type: application/json" \
//     -d '{"photo": "http://example.com/photo.jpg", "caption": "A beautiful photo of the business"}'
app.post("/businesses/:id/photos", (req, res) => {
  const id = parseInt(req.params.id, 10);

  const { photo } = req.body;
  if (!photo) {
    return res.status(400).json({ error: "photo url is required" });
  }
  const businessData = businesses.get(id);
  if (businessData) {
    const photoId = businessData.photos.length + 1; // Generate a unique ID for the photo
    const caption = req.body.caption || null; // Optional caption
    const photoEntry = { id: photoId, url: photo, caption };
    businessData.photos.push(photoEntry);
    res
      .status(201)
      .json({ message: `Photo added to businesses ${id}`, photo: photoEntry });
  } else {
    res.status(404).json({ error: `businesses ${id} not found` });
  }
});

// curl -X GET http://localhost:8086/businesses/1/photos
app.get("/businesses/:id/photos", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const businessData = businesses.get(id);
  if (businessData) {
    res.status(200).json(businessData.photos);
  } else {
    res.status(404).json({ error: `Photos for businesses ${id} not found` });
  }
});

// modify photos

// curl -X PUT http://localhost:8086/businesses/2/photos/1 \
//     -H "Content-Type: application/json" \
//     -d '{"photo": "http://example.com/updated-photo.jpg", "caption": "Updated caption"}'
app.put("/businesses/:id/photos/:photoId", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const photoId = parseInt(req.params.photoId, 10);

  const { photo: url, caption } = req.body;
  if (!url) {
    return res.status(400).json({ error: "Photo URL is required" });
  }

  const businessData = businesses.get(id);
  if (businessData) {
    const photoIndex = businessData.photos.findIndex((p) => p.id === photoId);
    if (photoIndex === -1) {
      return res.status(404).json({ error: `Photo ${photoId} not found` });
    }

    businessData.photos[photoIndex] = {
      id: photoId,
      url: url,
      caption: caption || null,
    };

    res
      .status(200)
      .json({
        message: `Photo ${photoId} updated for businesses ${id}`,
        photo: businessData.photos[photoIndex],
      });
  } else {
    res.status(404).json({ error: `Businesses ${id} not found` });
  }
});

// curl -X PUT http://localhost:8086/businesses/1/reviews/1 \
//     -H "Content-Type: application/json" \
//     -d '{"starRating": 5, "dollarRating": 4, "review": "Updated review"}'

app.put("/businesses/:id/reviews/:reviewId", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const reviewId = parseInt(req.params.reviewId, 10);
  const { starRating, dollarRating, review } = req.body;
  if (starRating == undefined || dollarRating == undefined) {
    return res
      .status(400)
      .json({ error: "star rating and dollar rating are required" });
  } else {
    if (
      starRating < 0 ||
      starRating > 5 ||
      dollarRating < 1 ||
      dollarRating > 4
    ) {
      return res
        .status(400)
        .json({
          error:
            "Star rating must be between 0 and 5, and dollar rating must be between 1 and 4 please",
        });
    } else {
      if (review == undefined) {
        review = null;
      }
      const businessData = businesses.get(id);
      if (businessData) {
        const reviewIndex = businessData.reviews.findIndex(
          (r) => r.id === reviewId
        );
        if (reviewIndex === -1) {
          return res
            .status(404)
            .json({ error: `Review ${reviewId} not found` });
        }
        businessData.reviews[reviewIndex] = {
          id: reviewId,
          starRating,
          dollarRating,
          content: review,
        };
        res
          .status(200)
          .json({
            message: `Review ${reviewId} updated for businesses ${id}`,
            review: businessData.reviews[reviewIndex],
          });
      } else {
        res.status(404).json({ error: `businesses ${id} not found` });
      }
    }
  }
});

// Start the server on port 8086 found above 
app.listen(port, () => {
  console.log(`== Server is listening on port ${port}`);
});


// // Handle termination signals
// process.on("SIGTERM", () => {
//   console.log("SIGTERM signal received: closing server");
//   process.exit(0);
// });

// process.on("SIGINT", () => {
//   console.log("SIGINT signal received: closing server");
//   process.exit(0);
// });

process.on("SIGTERM", () => {
  console.log("SIGTERM signal received: closing server");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("SIGINT signal received: closing server");
  process.exit(0);
});