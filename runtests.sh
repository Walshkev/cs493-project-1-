#!/bin/bash
# bash ./test_runtest.sh
# also works with npm test 


# found how to get just the status code from a curl command  
#https://superuser.com/questions/272265/getting-curl-to-output-http-status-code
echo -e " \n testing post endpoints \n"

# Test POST /businesses

response=$(curl -s -o /dev/null -w "%{http_code}" -X POST http://localhost:8086/businesses \
    -H "Content-Type: application/json" \
    -d '{
        "name": "Sudo Cafe",
        "streetAddress": "789 Oak St",
        "city": "Gotham",
        "state": "NJ",
        "zipCode": "07001",
        "phoneNumber": "555-555-5555",
        "category": "Cafe",
        "subcategories": ["Coffee", "Bakery"]
    }')
if [ "$response" -eq 201 ]; then
    echo "POST /businesses test passed"
else
    echo "POST /businesses test failed"
fi

# Test POST /businesses/2/reviews
response=$(curl -s -o /dev/null -w "%{http_code}" -X POST http://localhost:8086/businesses/2/reviews \
    -H "Content-Type: application/json" \
    -d '{
        "starRating": 4,
        "dollarRating": 3,
        "review": "Great place with excellent service!"
    }')
if [ "$response" -eq 201 ]; then
    echo "POST /businesses/2/reviews test passed"
else
    echo "POST /businesses/2/reviews test failed"
fi



# Test POST /businesses/2/photos
response=$(curl -s -o /dev/null -w "%{http_code}" -X POST http://localhost:8086/businesses/2/photos \
    -H "Content-Type: application/json" \
    -d '{"photo": "http://example.com/photo.jpg", "caption": "A beautiful photo of the business"}')
if [ "$response" -eq 201 ]; then
    echo "POST /businesses/2/photos test passed"
else
    echo "POST /businesses/2/photos test failed"
fi

# Test POST /businesses

echo -e "\n Testing GET /businesses endpoint \n "



# Test GET /businesses/1
response=$(curl -s -o /dev/null -w "%{http_code}"  -X GET http://localhost:8086/businesses/2)
if [ "$response" -eq 200 ]; then
    echo "GET /businesses/2 test passed"
else
    echo "GET /businesses/2 test failed"
fi

# Test GET /businesses
response=$(curl -s -o /dev/null -w "%{http_code}" -X GET http://localhost:8086/businesses)
if [ "$response" -eq 200 ]; then
    echo "GET /businesses test passed"
else
    echo "GET /businesses test failed"
fi

# Test GET /businesses/1/reviews
response=$(curl -s -o /dev/null -w "%{http_code}" -X GET http://localhost:8086/businesses/2/reviews)
if [ "$response" -eq 200 ]; then
    echo "GET /businesses/2/reviews test passed"
else
    echo "GET /businesses/2/reviews test failed"
fi

# test GET /businesses/2/photos
response=$(curl -s -o /dev/null -w "%{http_code}" -X GET http://localhost:8086/businesses/2/photos)
if [ "$response" -eq 200 ]; then
    echo "GET /businesses/2/photos test passed"
else
    echo "GET /businesses/2/photos test failed"
fi






# modifying tests 
echo -e " \n testing put endpoints \n"
# Test PUT /businesses/2/photos/1

response=$(curl -s -o /dev/null -w "%{http_code}" -X PUT http://localhost:8086/businesses/2/photos/1 \
    -H "Content-Type: application/json" \
    -d '{"photo": "http://example.com/updated-photo.jpg", "caption": "Updated caption"}')
if [ "$response" -eq 200 ]; then
    echo "PUT /businesses/2/photos/1 test passed"
else
    echo "PUT /businesses/2/photos/1 test failed"
fi


# Test PUT /businesses/2/reviews/1
response=$(curl -s -o /dev/null -w "%{http_code}" -X PUT http://localhost:8086/businesses/2/reviews/1 \
    -H "Content-Type: application/json" \
    -d '{"starRating": 5, "dollarRating": 4, "review": "Updated review"}')
if [ "$response" -eq 200 ]; then
    echo "PUT /businesses/2/reviews/1 test passed"
else
    echo "PUT /businesses/2/reviews/1 test failed"
fi

# Test PUT /businesses/2
response=$(curl -s -o /dev/null -w "%{http_code}" -X PUT http://localhost:8086/businesses/2 \
    -H "Content-Type: application/json" \
    -d '{
        "name": "Updated Business Name",
        "streetAddress": "123 Updated St",
        "city": "Metropolis",
        "state": "NY",
        "zipCode": "10001",
        "phoneNumber": "555-555-1234",
        "category": "Updated Category",
        "subcategories": ["Updated Subcategory1", "Updated Subcategory2"]
    }')
if [ "$response" -eq 200 ]; then
    echo "PUT /businesses/2 test passed"
else
    echo "PUT /businesses/2 test failed"
fi




# testing deletes 
echo ""
echo "Testing DELETE endpoints"
echo ""
# Test DELETE /businesses/1

response=$(curl -s -o /dev/null -w "%{http_code}" -X DELETE http://localhost:8086/businesses/3)
if [ "$response" -eq 204 ]; then
    echo "DELETE /businesses/1 test passed"
else
    echo "DELETE /businesses/1 test failed"
fi

# Test DELETE /businesses/2/reviews/1
response=$(curl -s -o /dev/null -w "%{http_code}" -X DELETE http://localhost:8086/businesses/2/reviews/1)
if [ "$response" -eq 204 ]; then
    echo "DELETE /businesses/2/reviews/1 test passed"
else
    echo "DELETE /businesses/2/reviews/1 test failed"
fi
# Test DELETE /businesses/1/photos/1
response=$(curl -s -o /dev/null -w "%{http_code}" -X DELETE http://localhost:8086/businesses/2/photos/1)
if [ "$response" -eq 204 ]; then
    echo "DELETE /businesses/2/photos/1 test passed"
else
    echo "DELETE /businesses/2/photos/1 test failed"
fi



# testing fail cases 
echo -e " \n testing get fail cases \n"
# Test GET /businesses/999 (non-existent business)
response=$(curl -s -o /dev/null -w "%{http_code}" -X GET http://localhost:8086/businesses/999)
if [ "$response" -eq 404 ]; then
    echo "GET /businesses/999 test passed"
else
    echo "GET /businesses/999 test failed"
fi
# Test GET /businesses/2/reviews/999 (non-existent review)
response=$(curl -s -o /dev/null -w "%{http_code}" -X GET http://localhost:8086/businesses/2/reviews/999)
if [ "$response" -eq 404 ]; then
    echo "GET /businesses/2/reviews/999 test passed"
else
    echo "GET /businesses/2/reviews/999 test failed"
fi
# Test GET /businesses/2/photos/999 (non-existent photo)
response=$(curl -s -o /dev/null -w "%{http_code}" -X GET http://localhost:8086/businesses/2/photos/999)
if [ "$response" -eq 404 ]; then
    echo "GET /businesses/2/photos/999 test passed"
else
    echo "GET /businesses/2/photos/999 test failed"
fi



echo -e " \n testing post fail cases \n"
# Test POST /businesses with missing fields
response=$(curl -s -o /dev/null -w "%{http_code}" -X POST http://localhost:8086/businesses \
    -H "Content-Type: application/json" \
    -d '{
        "name": "Sudo Cafe",
        "streetAddress": "789 Oak St",
        "city": "Gotham",
        "state": "NJ",
        "zipCode": "07001"
    }')
if [ "$response" -eq 400 ]; then
    echo "POST /businesses with missing fields test passed"
else
    echo "POST /businesses with missing fields test failed"
fi
# Test POST /businesses/2/reviews with invalid data
response=$(curl -s -o /dev/null -w "%{http_code}" -X POST http://localhost:8086/businesses/2/reviews \
    -H "Content-Type: application/json" \
    -d '{
        "starRating": 6,
        "dollarRating": 3,
        "review": "Invalid rating!"
    }')
if [ "$response" -eq 400 ]; then
    echo "POST /businesses/2/reviews with invalid data test passed"
else
    echo "POST /businesses/2/reviews with invalid data test failed"
fi
# Test POST /businesses/2/photos with no URL
response=$(curl -s -o /dev/null -w "%{http_code}" -X POST http://localhost:8086/businesses/2/photos \
    -H "Content-Type: application/json" \
    -d '{ "caption": "Invalid photo URL"}')
if [ "$response" -eq 400 ]; then
    echo "POST /businesses/2/photos with invalid URL test passed"
else
    echo "POST /businesses/2/photos with invalid URL test failed"
fi
echo "there are more tests to be added in this section"

echo -e " \n testing put fail cases \n"
# Test PUT /businesses/2 with invalid data
response=$(curl -s -o /dev/null -w "%{http_code}" -X PUT http://localhost:8086/businesses/2 \
    -H "Content-Type: application/json" \
    -d '{
        "name": "",
        "streetAddress": "123 Updated St",
        "city": "Metropolis",
        "state": "NY",
        "zipCode": "10001",
        "phoneNumber": "555-555-1234",
        "category": "Updated Category",
        "subcategories": ["Updated Subcategory1", "Updated Subcategory2"]
    }')
if [ "$response" -eq 400 ]; then
    echo "PUT /businesses/2 with invalid data test passed"
else
    echo "PUT /businesses/2 with invalid data test failed"
fi

# Test PUT /businesses/2/reviews/1 with invalid data
response=$(curl -s -o /dev/null -w "%{http_code}" -X PUT http://localhost:8086/businesses/2/reviews/1 \
    -H "Content-Type: application/json" \
    -d '{"starRating": 6, "dollarRating": 4, "review": "Invalid rating"}')
if [ "$response" -eq 400 ]; then
    echo "PUT /businesses/2/reviews/1 with invalid data test passed"
else
    echo "PUT /businesses/2/reviews/1 with invalid data test failed"
fi

# Test PUT /businesses/2/photos/1 with invalid data
response=$(curl -s -o /dev/null -w "%{http_code}" -X PUT http://localhost:8086/businesses/2/photos/1 \
    -H "Content-Type: application/json" \
    -d '{"photo": "", "caption": "Updated caption"}')
if [ "$response" -eq 400 ]; then
    echo "PUT /businesses/2/photos/1 with invalid data test passed"
else
    echo "PUT /businesses/2/photos/1 with invalid data test failed"
fi


echo -e " \n testing delete fail cases \n "
# Test DELETE /businesses/999 (non-existent business)
response=$(curl -s -o /dev/null -w "%{http_code}" -X DELETE http://localhost:8086/businesses/999)
if [ "$response" -eq 404 ]; then
    echo "DELETE /businesses/999 test passed"
else
    echo "DELETE /businesses/999 test failed"
fi
# Test DELETE /businesses/2/reviews/999 (non-existent review)
response=$(curl -s -o /dev/null -w "%{http_code}" -X DELETE http://localhost:8086/businesses/2/reviews/999)
if [ "$response" -eq 404 ]; then
    echo "DELETE /businesses/2/reviews/999 test passed"
else
    echo "DELETE /businesses/2/reviews/999 test failed"
fi
# Test DELETE /businesses/2/photos/999 (non-existent photo)
response=$(curl -s -o /dev/null -w "%{http_code}" -X DELETE http://localhost:8086/businesses/2/photos/999)
if [ "$response" -eq 404 ]; then
    echo "DELETE /businesses/2/photos/999 test passed"
else
    echo "DELETE /businesses/2/photos/999 test failed"
fi
# Test DELETE /businesses/2/reviews/1 (non-existent review)
response=$(curl -s -o /dev/null -w "%{http_code}" -X DELETE http://localhost:8086/businesses/2/reviews/1)
if [ "$response" -eq 404 ]; then
    echo "DELETE /businesses/2/reviews/1 test passed"
else
    echo "DELETE /businesses/2/reviews/1 test failed"
fi