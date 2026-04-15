#!/bin/sh

# Wait for PostgreSQL to become ready (adjust the sleep time as needed)
echo "Waiting for PostgreSQL to be ready..."
sleep 30

# Run database migrations
echo "Running database migrations..."
yarn run db:deploy

# npx prisma db push --force-reset

# Seed the database
echo "Seeding the database..."
yarn run seed

# Start the application
echo "Starting the application..."
yarn run start:prod
