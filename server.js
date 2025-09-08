const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware to parse JSON
app.use(express.json());

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// IP API endpoint
app.get('/api/ip/', (req, res) => {
  let ip =
    req.headers['cf-connecting-ip'] ||
    req.headers['x-forwarded-for'] ||
    req.headers['x-real-ip'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    (req.connection.socket ? req.connection.socket.remoteAddress : null) ||
    "";

  // Handle IPv4 mapped in IPv6
  if (ip.includes("::ffff:")) {
    ip = ip.split("::ffff:")[1];
  }

  // Handle IPv6 format
  if (ip.startsWith("[") && ip.endsWith("]")) {
    ip = ip.slice(1, -1);
  }

  // Handle localhost variations
  if (["127.0.0.1", "::1", "localhost"].includes(ip)) {
    ip = "127.0.0.1";
  }

  // Remove port if present
  if (ip.includes(":")) {
    const parts = ip.split(":");
    if (parts.length > 1 && !ip.includes(".")) {
      // IPv6 address, keep as is
    } else {
      // IPv4 with port
      ip = parts[0];
    }
  }

  res.json({
    ip,
    timestamp: new Date().toISOString(),
    userAgent: req.headers['user-agent'],
    isIPv6: ip.includes(":") && !ip.includes("."),
  });
});

// Catch all handler for SPA - serve index.html for any unmatched routes
app.all('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
