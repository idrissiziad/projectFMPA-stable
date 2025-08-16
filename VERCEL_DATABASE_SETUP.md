# Database Setup for Vercel Deployment

This document provides instructions for setting up your database for deployment on Vercel.

## Options for Database on Vercel

### Option 1: Use Vercel Postgres (Recommended)

1. **Create a Vercel Postgres Database**
   - Go to your Vercel project dashboard
   - Navigate to the "Storage" tab
   - Click "Create Database" and select "Postgres"
   - Follow the setup wizard

2. **Update Environment Variables**
   - After creating the database, Vercel will provide you with connection strings
   - Add these to your Vercel project environment variables:
     - `POSTGRES_URL`
     - `POSTGRES_PRISMA_URL` (for Prisma)
     - `POSTGRES_URL_NON_POOLING` (for migrations)

3. **Update Prisma Schema**
   - Modify your `prisma/schema.prisma` to use PostgreSQL instead of SQLite:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("POSTGRES_PRISMA_URL")
   }
   ```

4. **Generate Prisma Client**
   ```bash
   npx prisma generate
   ```

5. **Push Schema to Database**
   ```bash
   npx prisma db push
   ```

### Option 2: Use External Database

If you prefer to use an external database service:

1. **Choose a Database Provider**
   - PlanetScale
   - Supabase
   - Railway
   - Or any other PostgreSQL/MySQL provider

2. **Update Environment Variables**
   - Add your database connection string to Vercel environment variables:
     - `DATABASE_URL`

3. **Update Prisma Schema**
   - Modify your `prisma/schema.prisma` to match your database provider

4. **Generate Prisma Client**
   ```bash
   npx prisma generate
   ```

5. **Push Schema to Database**
   ```bash
   npx prisma db push
   ```

### Option 3: Continue with SQLite (Limited)

If you want to continue with SQLite, note that:

- SQLite is not recommended for production deployments on Vercel
- Vercel's serverless functions are ephemeral, so you can't persist data locally
- You would need to use a cloud storage solution for your SQLite file

## Environment Variables for Vercel

Add these environment variables to your Vercel project:

```
# Database
DATABASE_URL=your_database_connection_string
POSTGRES_URL=your_postgres_connection_string
POSTGRES_PRISMA_URL=your_postgres_prisma_connection_string
POSTGRES_URL_NON_POOLING=your_postgres_non_pooling_connection_string

# Next.js
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=https://your-app.vercel.app

# Node Environment
NODE_ENV=production
```

## Deployment Steps

1. Push your code to your Git repository
2. Connect your repository to Vercel
3. Add the environment variables
4. Deploy your application

## Troubleshooting

If you encounter database connection issues:

1. Check your environment variables are correctly set
2. Ensure your database allows connections from Vercel's IP addresses
3. Verify your Prisma schema matches your database structure
4. Check Vercel function logs for detailed error messages