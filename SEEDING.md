# Database Seeding

This document explains how to seed the database with initial admin credentials.

## Admin User Seeding

The seed script creates an admin user with the following default credentials:


## Running the Seed Script

### Using npm/yarn

```bash
npm run seed
# or
yarn seed
```

### Using Prisma directly

```bash
npx prisma db seed
```

## Customizing Admin Credentials

You can customize the admin credentials using environment variables:

```bash
# Set custom admin credentials
export ADMIN_EMAIL="your-admin@company.com"
export ADMIN_PASSWORD="YourSecurePassword123!"
export ADMIN_BUSINESS_NAME="Your Company Admin"

# Then run the seed script
npm run seed
```

Or create a `.env` file:

```env
ADMIN_EMAIL=your-admin@company.com
ADMIN_PASSWORD=YourSecurePassword123!
ADMIN_BUSINESS_NAME=Your Company Admin
```

## Security Notes

⚠️ **Important Security Considerations:**

1. **Change Default Password**: Always change the default admin password after first login
2. **Environment Variables**: Use environment variables for production deployments
3. **Email Verification**: The admin user is created with email verification already set to `true`
4. **Active Status**: The admin user is created as active by default

## Resetting Admin Credentials

If you need to reset the admin credentials:

1. Delete the existing admin user from the database
2. Run the seed script again
3. Or use a different email address

## Troubleshooting

- **Database Connection**: Ensure your database is running and accessible
- **Prisma Client**: Make sure the Prisma client is generated (`npx prisma generate`)
- **Environment Variables**: Check that your `.env` file is properly configured

## Docker Usage

The seed script is automatically run during Docker container startup via the `docker-entrypoint.sh` script.
