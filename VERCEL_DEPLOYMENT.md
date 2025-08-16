# Vercel Deployment Guide

This guide will help you deploy your Next.js application to Vercel.

## Prerequisites

- A Vercel account (sign up at [vercel.com](https://vercel.com))
- Your project code in a Git repository (GitHub, GitLab, or Bitbucket)
- Node.js installed locally

## Deployment Steps

### 1. Connect Your Repository to Vercel

1. Log in to your Vercel dashboard
2. Click "Add New" and select "Project"
3. Import your Git repository
4. Vercel will automatically detect that this is a Next.js project

### 2. Configure Environment Variables

Add the following environment variables in your Vercel project settings:

```
# Database (choose one option based on your database setup)
DATABASE_URL=your_database_connection_string

# Next.js
NEXTAUTH_SECRET=generate_a_secure_random_string
NEXTAUTH_URL=https://your-app-name.vercel.app

# Node Environment
NODE_ENV=production
```

For database setup, refer to [VERCEL_DATABASE_SETUP.md](./VERCEL_DATABASE_SETUP.md).

### 3. Configure Build Settings

Vercel will automatically detect the following settings from your `vercel.json`:

- Build Command: `npm run build:next`
- Output Directory: `.next`
- Framework: `nextjs`

### 4. Deploy

Click the "Deploy" button. Vercel will:

1. Install dependencies
2. Run the build command
3. Deploy your application

## Manual Deployment

If you prefer to deploy from your local machine:

1. Install the Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Login to your Vercel account:
   ```bash
   vercel login
   ```

3. Deploy your application:
   ```bash
   npm run deploy:vercel
   ```

## Post-Deployment Checklist

- [ ] Verify your application is accessible at the provided URL
- [ ] Test all API endpoints
- [ ] Test database connections
- [ ] Test WebSocket functionality (if applicable)
- [ ] Check that environment variables are properly loaded
- [ ] Verify that all static assets are loading correctly

## Troubleshooting

### Build Errors

If you encounter build errors:

1. Check the build logs in the Vercel dashboard
2. Ensure all dependencies are properly listed in `package.json`
3. Verify that your code works locally with the `npm run build:next` command

### Runtime Errors

If your application builds but has runtime errors:

1. Check the function logs in the Vercel dashboard
2. Verify environment variables are correctly set
3. Ensure database connections are properly configured

### WebSocket Issues

If WebSocket functionality isn't working:

1. Verify that the socket.io client is configured to use the correct URL
2. Check that CORS settings allow connections from your domain
3. Ensure the socket.io API route is properly deployed

## Custom Domain

To use a custom domain:

1. Go to your project settings in the Vercel dashboard
2. Navigate to the "Domains" tab
3. Add your custom domain
4. Follow the DNS configuration instructions provided by Vercel

## Monitoring and Analytics

Vercel provides built-in monitoring and analytics:

1. **Analytics**: Track visitor metrics and page views
2. **Logs**: View real-time and historical logs
3. **Metrics**: Monitor performance and error rates
4. **Webhooks**: Set up notifications for deployments and errors

## Continuous Deployment

With Git integration, Vercel automatically deploys your application when you:

1. Push to your main branch
2. Create a pull request
3. Push to a production branch

You can configure deployment triggers in the project settings.

## Rollbacks

If you need to rollback to a previous deployment:

1. Go to the "Deployments" tab in your Vercel dashboard
2. Find the deployment you want to rollback to
3. Click the three-dot menu and select "Rollback"

## Environment-Specific Configurations

For different environments (development, staging, production):

1. Use Vercel's Environments feature
2. Configure different environment variables for each environment
3. Set up branch protection rules for production deployments

## Scaling and Performance

To optimize performance:

1. Enable Vercel's Automatic Compression
2. Configure proper caching headers
3. Use Vercel's Edge Network for static assets
4. Consider using Vercel's Serverless Functions for dynamic content

## Security Considerations

1. Ensure all sensitive data is stored in environment variables
2. Use HTTPS for all connections
3. Implement proper authentication and authorization
4. Regularly update dependencies to patch security vulnerabilities

## Support

If you need additional help:

- Check the [Vercel Documentation](https://vercel.com/docs)
- Visit the [Vercel Community](https://vercel.com/community)
- Contact Vercel Support through your dashboard