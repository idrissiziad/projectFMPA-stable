// Cloudflare Worker entry point for Next.js app
const worker = {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    
    // Handle static assets - return 404 for now (should be uploaded to Cloudflare Assets)
    if (url.pathname.startsWith('/_next/static') || 
        url.pathname.startsWith('/favicon.ico') || 
        url.pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico)$/)) {
      return new Response('Static asset not found - upload to Cloudflare Assets', { 
        status: 404,
        headers: {
          'Content-Type': 'text/plain',
        }
      });
    }

    // Handle API routes with basic responses
    if (url.pathname.startsWith('/api/')) {
      try {
        // Basic API route handling for deployment testing
        if (url.pathname === '/api/files') {
          return new Response(JSON.stringify({
            success: true,
            message: 'API endpoint working',
            files: [],
            note: 'Full API implementation needed for production'
          }), {
            status: 200,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
              'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            }
          });
        }

        if (url.pathname === '/api/health') {
          return new Response(JSON.stringify({
            status: 'healthy',
            timestamp: new Date().toISOString(),
            service: 'projectfmpa-worker'
          }), {
            status: 200,
            headers: {
              'Content-Type': 'application/json',
            }
          });
        }

        // Generic API response for other routes
        return new Response(JSON.stringify({ 
          message: 'API route endpoint',
          path: url.pathname,
          note: 'Full API implementation needed for production'
        }), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          }
        });
      } catch (error) {
        return new Response(JSON.stringify({
          error: 'API Error',
          message: error instanceof Error ? error.message : 'Unknown error'
        }), {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
          }
        });
      }
    }

    // Handle OPTIONS requests for CORS
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        }
      });
    }

    // For all other requests, serve the main app HTML
    try {
      return new Response(`
        <!DOCTYPE html>
        <html lang="fr">
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>ProjectFMPA - Platforme Médicale</title>
            <meta name="description" content="Plateforme d'entraînement médicale aux QCM">
            <style>
              * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
              }
              
              body { 
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 20px;
                line-height: 1.6;
              }
              
              .container {
                max-width: 900px;
                width: 100%;
                background: rgba(255, 255, 255, 0.95);
                backdrop-filter: blur(10px);
                padding: 60px 40px;
                border-radius: 20px;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
                text-align: center;
              }
              
              .logo {
                font-size: 3.5rem;
                font-weight: 800;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
                margin-bottom: 20px;
              }
              
              .subtitle {
                color: #64748b;
                font-size: 1.2rem;
                font-weight: 500;
                margin-bottom: 40px;
              }
              
              .status {
                background: #f1f5f9;
                border: 2px solid #e2e8f0;
                border-radius: 12px;
                padding: 30px;
                margin: 30px 0;
              }
              
              .status h2 {
                color: #1e293b;
                margin-bottom: 15px;
                font-size: 1.5rem;
              }
              
              .status p {
                color: #475569;
                margin-bottom: 10px;
              }
              
              .features {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 20px;
                margin: 40px 0;
              }
              
              .feature {
                background: #f8fafc;
                padding: 25px;
                border-radius: 12px;
                border: 1px solid #e2e8f0;
              }
              
              .feature h3 {
                color: #1e293b;
                margin-bottom: 10px;
                font-size: 1.1rem;
              }
              
              .feature p {
                color: #64748b;
                font-size: 0.9rem;
              }
              
              .deploy-info {
                background: #fef3c7;
                border: 1px solid #f59e0b;
                border-radius: 8px;
                padding: 20px;
                margin: 30px 0;
                text-align: left;
              }
              
              .deploy-info h3 {
                color: #92400e;
                margin-bottom: 10px;
              }
              
              .deploy-info ul {
                color: #78350f;
                padding-left: 20px;
              }
              
              .deploy-info li {
                margin-bottom: 5px;
              }
              
              code {
                background: #f1f5f9;
                padding: 2px 6px;
                border-radius: 4px;
                font-family: 'Monaco', 'Menlo', monospace;
                font-size: 0.9em;
                color: #e11d48;
              }
              
              .api-test {
                background: #ecfdf5;
                border: 1px solid #34d399;
                border-radius: 8px;
                padding: 20px;
                margin: 20px 0;
                text-align: left;
              }
              
              .api-test h3 {
                color: #065f46;
                margin-bottom: 10px;
              }
              
              .api-test p {
                color: #047857;
                margin-bottom: 10px;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="logo">ProjectFMPA</div>
              <div class="subtitle">Excellence Médicale - Réussite Assurée</div>
              
              <div class="status">
                <h2>🚀 Déployé avec succès sur Cloudflare Workers!</h2>
                <p>Votre application Next.js est maintenant hébergée sur Cloudflare Workers.</p>
                <p><strong>Statut:</strong> <span style="color: #059669;">✅ Opérationnel</span></p>
              </div>
              
              <div class="api-test">
                <h3>🔧 Test des API</h3>
                <p>Les endpoints API sont disponibles:</p>
                <ul>
                  <li><code>/api/health</code> - Vérification de l'état du service</li>
                  <li><code>/api/files</code> - Liste des fichiers disponibles</li>
                  <li><code>/api/years</code> - Années disponibles</li>
                </ul>
              </div>
              
              <div class="features">
                <div class="feature">
                  <h3>📚 QCM Médicaux</h3>
                  <p>Entraînement aux questions à choix multiples pour les examens médicaux</p>
                </div>
                <div class="feature">
                  <h3>⚡ Performance</h3>
                  <p>Hébergement sur l'infrastructure mondiale de Cloudflare</p>
                </div>
                <div class="feature">
                  <h3>🔒 Sécurité</h3>
                  <p>Protection intégrée et chiffrement SSL/TLS</p>
                </div>
              </div>
              
              <div class="deploy-info">
                <h3>📋 Prochaines étapes pour le déploiement complet:</h3>
                <ul>
                  <li>Uploader les assets statiques vers Cloudflare Assets</li>
                  <li>Implémenter la logique API complète</li>
                  <li>Configurer la base de données (Cloudflare D1)</li>
                  <li>Configurer les variables d'environnement</li>
                  <li>Tester toutes les fonctionnalités</li>
                </ul>
              </div>
              
              <p style="color: #64748b; font-size: 0.9rem; margin-top: 30px;">
                Déployé le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}
              </p>
            </div>
          </body>
        </html>
      `, {
        status: 200,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        }
      });
    } catch (error) {
      return new Response('Internal Server Error', { status: 500 });
    }
  },
};

export default worker;