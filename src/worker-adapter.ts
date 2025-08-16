// Cloudflare Worker adapter for Next.js app
const workerAdapter = {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    
    // Handle static assets
    if (url.pathname.startsWith('/_next/static')) {
      const assetPath = url.pathname.replace('/_next/static', '.next/static');
      // Note: In a real deployment, you'd need to serve these from Cloudflare Assets
      return new Response('Static assets should be served from Cloudflare Assets', { status: 404 });
    }

    // Handle API routes
    if (url.pathname.startsWith('/api/')) {
      // For API routes, we'll handle them directly
      try {
        const { handleApiRequest } = await import('./src/app/api/[...path]/route');
        return await handleApiRequest(request, env, ctx);
      } catch (error) {
        return new Response('API route not found', { status: 404 });
      }
    }

    // Handle page requests
    try {
      // Import the Next.js app
      const nextApp = await import('./.next/standalone/server.js');
      const nextServer = new NextServer({
        hostname: 'localhost',
        port: 3000,
        dir: '.',
        dev: false,
        minimalMode: true,
        quiet: true,
      });

      return await nextServer.handleRequest(request);
    } catch (error) {
      console.error('Error handling request:', error);
      return new Response('Internal Server Error', { status: 500 });
    }
  },
};

export default workerAdapter;