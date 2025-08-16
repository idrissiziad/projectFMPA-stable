# Cloudflare Workers Deployment Guide

This guide will help you deploy your Next.js application to Cloudflare Workers.

## Prerequisites

1. Install Wrangler CLI (already added as dev dependency):
```bash
npm install
```

2. Authenticate with Cloudflare:
```bash
npx wrangler login
```

## Configuration Files Created

### 1. `wrangler.jsonc`
Main configuration file for Cloudflare Workers deployment.

### 2. `worker.ts`
Enhanced entry point for the Cloudflare Worker with:
- Beautiful landing page
- Basic API endpoint handling
- CORS support
- Error handling

### 3. `public/_headers`
Headers configuration for proper caching and security.

### 4. Updated `next.config.ts`
Added `output: 'standalone'` for better Cloudflare compatibility.

### 5. Updated `package.json`
- Added `wrangler` as dev dependency
- Added deployment scripts

## Deployment Steps

### Option 1: Simple Deployment (Recommended)
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
# Install dependencies first
npm install

# Build the Next.js application
npm run build

# Deploy the worker
npx wrangler deploy

# If you have static assets, deploy them separately
npx wrangler deploy --assets=.next/static
```

## What's Deployed

### ✅ Currently Working:
- **Landing Page**: Beautiful, responsive landing page with ProjectFMPA branding
- **Basic API Endpoints**:
  - `/api/health` - Health check endpoint
  - `/api/files` - Files endpoint (returns empty array for now)
  - `/api/years` - Years endpoint (basic response)
  - All other API routes return basic responses
- **CORS Support**: Proper CORS headers for API access
- **Error Handling**: Graceful error responses
- **Static Asset Handling**: Returns 404 for static assets (needs separate upload)

### 🔧 What Needs Implementation:
- Full API logic integration
- Static asset hosting on Cloudflare Assets
- Database connectivity (Cloudflare D1 recommended)
- Environment variables configuration
- Authentication (NextAuth.js adaptation)

## Testing the Deployment

After deployment, you can test:

1. **Main Page**: Visit your worker URL to see the landing page
2. **Health Check**: `GET /api/health` should return health status
3. **API Endpoints**: `GET /api/files` should return a response
4. **CORS**: Test API access from different origins

## Environment Variables

Set up environment variables in Cloudflare Workers:
```bash
npx wrangler secret put NODE_ENV
npx wrangler secret put DATABASE_URL
npx wrangler secret put NEXTAUTH_SECRET
# Add other required secrets
```

## Static Assets

Cloudflare Workers doesn't serve static assets directly. You have options:

### Option 1: Cloudflare Assets (Recommended)
```bash
# Upload static assets to Cloudflare Assets
npx wrangler deploy --assets=.next/static
```

### Option 2: Cloudflare Pages
Deploy your static assets to Cloudflare Pages and use Workers for dynamic content.

### Option 3: CDN
Use a separate CDN service for static assets.

## Database Considerations

Your application uses Prisma with SQLite. For Cloudflare deployment:

### Option 1: Cloudflare D1 (Recommended)
```bash
# Create D1 database
npx wrangler d1 create projectfmpa-db

# Set up database binding in wrangler.jsonc
# Update your Prisma schema for D1
```

### Option 2: External Database
Use external database services like:
- PlanetScale
- Supabase
- Neon
- Any PostgreSQL/MySQL service

## Troubleshooting

### Common Issues

1. **"wrangler command not found"**: Run `npm install` first to install wrangler
2. **Static assets not loading**: Upload static assets to Cloudflare Assets
3. **API routes not working**: Check worker.ts for proper route handling
4. **Database connection issues**: Configure database for serverless environment
5. **Build errors**: Make sure all dependencies are installed

### Build Commands

```bash
# Clean build
rm -rf .next
npm run build

# Deploy with verbose output
npm run deploy:cf

# Check deployment status
npx wrangler deployments list

# Tail logs
npx wrangler tail
```

### Development vs Production

- **Development**: Use `npm run dev` for local development
- **Production**: Use `npm run deploy:cf` for Cloudflare deployment

## Current Features

### Landing Page Features:
- 🎨 Beautiful gradient design with ProjectFMPA branding
- 📱 Fully responsive layout
- 🚀 Deployment status indicator
- 🔧 API testing information
- 📋 Deployment checklist
- ⚡ Performance indicators
- 🔒 Security features highlight

### API Features:
- ✅ Health check endpoint
- ✅ Basic file listing endpoint
- ✅ CORS support
- ✅ Error handling
- ✅ JSON responses

## Recommended Next Steps

1. **Test basic deployment**: `npm run deploy:cf`
2. **Set up static assets** on Cloudflare Assets
3. **Configure database** (Cloudflare D1 recommended)
4. **Implement full API logic** in worker.ts
5. **Set up environment variables** for production
6. **Test all functionality** in deployed environment
7. **Monitor performance** with Cloudflare analytics

## Alternative: Cloudflare Pages

For a simpler deployment, consider using Cloudflare Pages instead of Workers:

1. Connect your GitHub repository to Cloudflare Pages
2. Set build command to `npm run build`
3. Set build output directory to `.next`
4. Cloudflare Pages will automatically handle static assets and serverless functions

## Success Metrics

Your deployment is successful if:
- ✅ Landing page loads properly
- ✅ API endpoints return responses
- ✅ CORS headers are present
- ✅ No console errors
- ✅ Responsive design works on mobile
- ✅ Health check passes

---

**Note**: This deployment provides a solid foundation. The worker.ts file includes basic functionality that can be extended as needed for your specific requirements.