# Cloudflare Workers Deployment Guide

This guide will help you deploy your Next.js application to Cloudflare Workers.

## Prerequisites

1. Install Wrangler CLI:
```bash
npm install -g wrangler
```

2. Authenticate with Cloudflare:
```bash
wrangler login
```

## Configuration Files Created

### 1. `wrangler.jsonc`
Main configuration file for Cloudflare Workers deployment.

### 2. `worker.ts`
Entry point for the Cloudflare Worker that handles requests.

### 3. `public/_headers`
Headers configuration for proper caching and security.

### 4. Updated `next.config.ts`
Added `output: 'standalone'` for better Cloudflare compatibility.

## Deployment Steps

### Option 1: Simple Deployment (Basic Worker)
```bash
# Build the application
npm run build

# Deploy to Cloudflare Workers
npm run deploy:cf
```

### Option 2: With Static Assets
```bash
# Build the application
npm run build

# Deploy with static assets
npm run deploy:cf:assets
```

### Option 3: Manual Deployment
```bash
# Build the Next.js application
npm run build

# Deploy the worker
wrangler deploy

# If you have static assets, deploy them separately
wrangler deploy --assets=.next/static
```

## Important Notes

### Static Assets
Cloudflare Workers doesn't serve static assets directly. You have two options:

1. **Use Cloudflare Assets**: Upload your static assets to Cloudflare Assets and reference them properly.
2. **Use Cloudflare Pages**: Deploy your static assets to Cloudflare Pages and use Workers for dynamic content.

### API Routes
The current worker.ts file includes basic API route handling. For full functionality, you'll need to:

1. Implement proper API route handling in the worker
2. Or use Cloudflare Pages Functions for API routes
3. Or set up a separate API service

### Database Considerations
Your application uses Prisma with SQLite. For Cloudflare deployment:

1. **Cloudflare D1**: Migrate to Cloudflare D1 (SQLite-compatible)
2. **External Database**: Use an external database service with proper connection handling
3. **Static Data**: If your data is static, include it in the build

### Environment Variables
Set up environment variables in Cloudflare Workers:
```bash
wrangler secret put DATABASE_URL
wrangler secret put NEXTAUTH_SECRET
# Add other required secrets
```

## Alternative: Cloudflare Pages

For a simpler deployment, consider using Cloudflare Pages instead of Workers:

1. Connect your GitHub repository to Cloudflare Pages
2. Set build command to `npm run build`
3. Set build output directory to `.next`
4. Cloudflare Pages will automatically handle static assets and serverless functions

## Troubleshooting

### Common Issues

1. **"No assets directory found"**: Make sure you've built the application first with `npm run build`
2. **Static assets not loading**: Upload static assets to Cloudflare Assets or use Cloudflare Pages
3. **API routes not working**: Implement proper API route handling in worker.ts
4. **Database connection issues**: Configure database connection for serverless environment

### Build Commands

```bash
# Clean build
rm -rf .next
npm run build

# Deploy with verbose output
wrangler deploy --verbose

# Check deployment status
wrangler deployments list
```

## Current Limitations

The current worker.ts implementation provides a basic placeholder. For full functionality, you'll need to:

1. Implement proper Next.js request handling
2. Set up static asset serving
3. Implement API route handling
4. Configure database connections
5. Handle authentication (NextAuth.js)

## Recommended Next Steps

1. Test the basic deployment with `npm run deploy:cf`
2. Set up static asset hosting
3. Implement API routes in the worker
4. Configure database for production
5. Test all functionality in the deployed environment