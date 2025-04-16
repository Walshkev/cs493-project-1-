# Use the official Node.js image from Docker Hub
FROM node:16

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install Node.js dependencies
RUN npm install

# Copy the rest of the application files (including index.js)
COPY . .

# Expose port 8086 for the application
EXPOSE 8086

# Start the Node.js application
CMD ["node", "index.js"]


#docker build -t api-server . 

# docker run -p 8086:8086 --rm api-server