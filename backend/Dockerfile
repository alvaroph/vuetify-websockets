# Use an official Node.js runtime as a parent image
FROM node:20-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the server file
COPY websocket-server.js .

# Make port 8080 available
EXPOSE 8080

# Command to run the server
CMD ["npm", "start"]
