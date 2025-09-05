export default {
    async fetch(request, env, ctx) {
      const url = new URL(request.url);
  
      if (url.pathname === "/api/ip") {
        let ip =
          request.headers.get("cf-connecting-ip") ||
          request.headers.get("x-forwarded-for") ||
          request.headers.get("x-real-ip") ||
          "";
  
        if (ip.includes("::ffff:")) {
          ip = ip.split("::ffff:")[1];
        }
  
        if (ip.startsWith("[") && ip.endsWith("]")) {
          ip = ip.slice(1, -1);
        }
  
        if (["127.0.0.1", "::1", "localhost"].includes(ip)) {
          ip = "127.0.0.1";
        }
  
        return new Response(
          JSON.stringify({
            ip,
            timestamp: new Date().toISOString(),
            userAgent: request.headers.get("user-agent"),
            isIPv6: ip.includes(":") && !ip.includes("."),
          }),
          {
            headers: { "Content-Type": "application/json" },
          }
        );
      }
  
      return env.ASSETS.fetch(request);
    },
  };
  