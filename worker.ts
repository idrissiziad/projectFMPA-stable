// Cloudflare Worker entry point for Next.js app
const worker = {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    
    // Handle static assets - these should be uploaded to Cloudflare Assets separately
    if (url.pathname.startsWith('/_next/static') || 
        url.pathname.startsWith('/favicon.ico') || 
        url.pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico)$/)) {
      return new Response('Static assets should be served from Cloudflare Assets', { 
        status: 404,
        headers: {
          'Content-Type': 'text/plain',
        }
      });
    }

    // For API routes, we'll proxy them or handle them directly
    if (url.pathname.startsWith('/api/')) {
      try {
        // This is a simplified approach - in production, you'd need to implement proper API routing
        return new Response(JSON.stringify({ 
          message: 'API routes need to be implemented for Cloudflare Workers',
          path: url.pathname 
        }), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          }
        });
      } catch (error) {
        return new Response('API Error', { status: 500 });
      }
    }

    // For all other requests, serve the main app
    try {
      // Return a basic HTML response for the main app
      return new Response(`
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>ProjectFMPA</title>
            <style>
              body { 
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                margin: 0;
                padding: 20px;
                background: #f8fafc;
              }
              .container {
                max-width: 800px;
                margin: 0 auto;
                background: white;
                padding: 40px;
                border-radius: 12px;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
              }
              h1 {
                color: #1e293b;
                text-align: center;
                margin-bottom: 20px;
              }
              .message {
                background: #f1f5f9;
                padding: 20px;
                border-radius: 8px;
                border-left: 4px solid #3b82f6;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>ProjectFMPA</h1>
              <div class="message">
                <p><strong>Cloudflare Workers Deployment</strong></p>
                <p>This Next.js application is configured for Cloudflare Workers deployment.</p>
                <p>For full functionality, you need to:</p>
                <ol>
                  <li>Build the application: <code>npm run build</code></li>
                  <li>Upload static assets to Cloudflare Assets</li>
                  <li>Configure proper API route handling</li>
                  <li>Set up environment variables</li>
                </ol>
              </div>
            </div>
          </body>
        </html>
      `, {
        status: 200,
        headers: {
          'Content-Type': 'text/html',
        }
      });
    } catch (error) {
      return new Response('Internal Server Error', { status: 500 });
    }
  },
};

export default worker;