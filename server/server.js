const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, '..')));

app.get('/api/ip', (req, res) => {
    let ip = req.headers['x-forwarded-for'] ||
             req.headers['x-real-ip'] ||
             req.connection.remoteAddress ||
             req.socket.remoteAddress ||
             req.connection.socket?.remoteAddress ||
             '';

    // Handle IPv4-mapped IPv6 addresses (::ffff:192.168.1.1)
    if (ip.includes('::ffff:')) {
        ip = ip.split('::ffff:')[1];
    }

    // Clean up IPv6 addresses (remove brackets if present)
    if (ip.startsWith('[') && ip.endsWith(']')) {
        ip = ip.slice(1, -1);
    }

    // Handle localhost cases
    if (ip === '127.0.0.1' || ip === '::1' || ip === 'localhost') {
        ip = '127.0.0.1';
    }

    res.json({
        ip: ip,
        timestamp: new Date().toISOString(),
        userAgent: req.headers['user-agent'],
        isIPv6: ip.includes(':') && !ip.includes('.')
    });
});

app.listen(PORT, () => {
    console.log(`IP endpoint available at http://localhost:${PORT}/api/ip`);
});
