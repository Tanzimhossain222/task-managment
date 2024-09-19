# Use the official Node.js image as the base image
FROM node:22.7.0

# Set the working directory inside the container
WORKDIR /app

# Copy `package.json` and `yarn.lock` files
COPY package.json yarn.lock ./

# Install global dependencies
RUN yarn global add cross-env

# Install dependencies
RUN yarn install

# Copy the rest of the application files
COPY . .

# Build the project
RUN yarn build

# Expose the port the app runs on (adjust if needed)
EXPOSE 3000

# Start the app
CMD ["yarn", "start:prod"]
