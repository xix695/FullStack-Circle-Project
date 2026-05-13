# Use an official Node.js runtime as the base image
FROM node:latest

# Set the working directory
WORKDIR /app/server

# Install create-react-app globally
RUN npm install express cors body-parser nodemon

# Expose the port on which your React app will run
#EXPOSE 3000

# Expose any other necessary ports for API
EXPOSE 8080


CMD ["/bin/bash"]
