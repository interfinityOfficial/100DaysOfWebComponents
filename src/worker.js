export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Handle CORS
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // API routes
    if (url.pathname === '/api/ip') {
      try {
        let ip = request.headers.get('CF-Connecting-IP') ||
                 request.headers.get('X-Forwarded-For') ||
                 request.headers.get('X-Real-IP') ||
                 'unknown';

        // Handle IPv4-mapped IPv6 addresses
        if (ip.includes('::ffff:')) {
          ip = ip.split('::ffff:')[1];
        }

        // Clean up IPv6 addresses (remove brackets if present)
        if (ip.startsWith('[') && ip.endsWith(']')) {
          ip = ip.slice(1, -1);
        }

        // Handle localhost cases
        if (ip === '127.0.0.1' || ip === '::1' || ip === 'localhost') {
          ip = 'localhost';
        }

        const response = {
          ip: ip,
          timestamp: new Date().toISOString(),
          userAgent: request.headers.get('User-Agent'),
          isIPv6: ip.includes(':') && !ip.includes('.'),
          country: request.cf?.country || 'unknown',
          city: request.cf?.city || 'unknown'
        };

        return new Response(JSON.stringify(response), {
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        });
      } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to get IP address' }), {
          status: 500,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        });
      }
    }

    // Health check endpoint
    if (url.pathname === '/api/health') {
      return new Response(JSON.stringify({
        status: 'OK',
        timestamp: new Date().toISOString()
      }), {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      });
    }

    // Serve static files
    if (url.pathname === '/' || url.pathname.endsWith('.html') || url.pathname.endsWith('.css') || url.pathname.endsWith('.js') || url.pathname.endsWith('.png') || url.pathname.endsWith('.ttf')) {
      // For static files, we'll need to serve them from Cloudflare Pages
      // or use a different approach. For now, return a simple response
      return new Response('Static files should be served by Cloudflare Pages', {
        status: 200,
        headers: corsHeaders
      });
    }

    // 404 for unknown routes
    return new Response('Not Found', {
      status: 404,
      headers: corsHeaders
    });
  },
};
