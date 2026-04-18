# Use the official Node.js 18 image as the base image
FROM node:18-bullseye AS build

WORKDIR /app

# Set Prisma CLI version
ENV PRISMA_CLI_VERSION=3.0.0

# Copy package.json and npm.lock to the working directory
COPY package.json ./

# Install all dependencies, including dev dependencies for Prisma
RUN npm install 

# Copy the rest of the application code to the working directory
COPY . .

# Copy the entry point script
COPY docker-entrypoint.sh ./

# Make the entry point script executable
RUN chmod +x docker-entrypoint.sh

# Generate Prisma client files
RUN npx prisma generate

# Build the application
RUN npm run build

# ---------------------------------------
# Production stage
# ---------------------------------------
FROM node:18-bullseye AS production

WORKDIR /app

# Copy the production build from the build stage
COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json ./
COPY --from=build /app/docker-entrypoint.sh ./
# Copy generated Prisma client from previous step
COPY --from=build /app/node_modules/.prisma/client  ./node_modules/.prisma/client
# Copy Prisma schema and migrations
COPY --from=build /app/prisma ./prisma

# Install only production dependencies
RUN npm install --production 

# Expose the port on which your NestJS app is listening
ARG APP_PORT=3000
EXPOSE ${APP_PORT}

# Set NODE_ENV to production
ENV NODE_ENV=production

# Use the entry point script to start the container
ENTRYPOINT ["/app/docker-entrypoint.sh"]
