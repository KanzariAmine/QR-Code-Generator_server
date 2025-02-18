# Use an official Node.js image with Debian base
FROM node:22-slim AS build

# Install system dependencies (including ZLIB 1.2.9)
RUN apt-get update && apt-get install -y \
  build-essential \
  zlib1g-dev \
  libcairo2-dev \
  libpango1.0-dev \
  libjpeg-dev \
  libgif-dev \
  librsvg2-dev \
  && rm -rf /var/lib/apt/lists/*

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci --omit=dev

# Copy the rest of the app's code
COPY . .

# Build the NestJS app
RUN npm run build

# Debugging: Ensure dist and node_modules exist
RUN ls -la /usr/src/app/dist || (echo "dist folder not found" && exit 1)
RUN ls -la /usr/src/app/node_modules || (echo "node_modules folder not found" && exit 1)

# Use a smaller base image for production
FROM node:22-slim AS production

# Set the working directory
WORKDIR /usr/src/app

# Copy node_modules and build artifacts from the build stage
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist

# Set the NODE_ENV to production
ENV NODE_ENV=production

# Expose the port the app runs on
EXPOSE 3000

# Command to run the app
CMD ["npm", "run", "start"]