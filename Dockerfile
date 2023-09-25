# Use an official Node.js runtime as the base image
FROM node:18

# Create a working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install application dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Expose the port your application will run on
EXPOSE 4000

# Start your application when the container starts
CMD ["node", "app.js"]