# 100 Days of Code - Node.js Version

This is a 100 Days of Code project adapted to run on Node.js using Express server, originally designed for Cloudflare Workers.

## Features

- **IP API Endpoint**: `/api/ip/` returns client IP information including:
  - IP address
  - Timestamp
  - User agent
  - IPv6 detection
- **Static File Serving**: Serves all HTML pages and assets from the `public/` directory
- **Daily Progress Display**: Interactive squares showing 7-day week progress

## Project Structure

```
/
├── server.js          # Express server entry point
├── package.json       # Node.js dependencies and scripts
├── public/            # Static files directory
│   ├── index.html     # Main page
│   ├── 1/             # Day 1 page
│   ├── 2/             # Day 2 page
│   ├── ...            # Additional day pages
│   ├── 5/             # Day 5 page
│   └── assets/        # Static assets (fonts, icons)
│       ├── icon.png
│       └── SpaceMono-Bold.ttf
└── README.md          # This file
```

## Installation & Setup

### Prerequisites

- Node.js (version 14 or higher)
- npm (comes with Node.js)

### On Ubuntu Server

1. **Install Node.js and npm**:
   ```bash
   # Update package list
   sudo apt update

   # Install Node.js and npm
   sudo apt install nodejs npm

   # Verify installation
   node --version
   npm --version
   ```

2. **Clone or upload your project**:
   ```bash
   # Navigate to your desired directory
   cd /path/to/your/projects

   # If uploading via SCP/SFTP, upload the entire project folder
   # Or if using git:
   git clone <your-repo-url>
   cd WebTest
   ```

3. **Install dependencies**:
   ```bash
   npm install
   ```

4. **Start the server**:
   ```bash
   # For development
   npm run dev

   # Or directly
   node server.js
   ```

5. **Access your application**:
   - Open your browser and navigate to `http://your-server-ip:3000`
   - The IP API is available at `http://your-server-ip:3000/api/ip/`

## Production Deployment

### Using PM2 (Process Manager)

1. **Install PM2 globally**:
   ```bash
   sudo npm install -g pm2
   ```

2. **Start the application with PM2**:
   ```bash
   pm2 start server.js --name "100days-app"
   ```

3. **Configure PM2 to start on boot**:
   ```bash
   pm2 startup
   pm2 save
   ```

4. **Other useful PM2 commands**:
   ```bash
   pm2 list                    # List all processes
   pm2 stop 100days-app        # Stop the app
   pm2 restart 100days-app     # Restart the app
   pm2 logs 100days-app        # View logs
   ```

### Using systemd

1. **Create a systemd service file**:
   ```bash
   sudo nano /etc/systemd/system/100days.service
   ```

2. **Add the following content**:
   ```ini
   [Unit]
   Description=100 Days of Code Node.js App
   After=network.target

   [Service]
   Type=simple
   User=your-username
   WorkingDirectory=/path/to/your/project/WebTest
   ExecStart=/usr/bin/node /path/to/your/project/WebTest/server.js
   Restart=on-failure
   RestartSec=10
   Environment=NODE_ENV=production

   [Install]
   WantedBy=multi-user.target
   ```

3. **Enable and start the service**:
   ```bash
   sudo systemctl daemon-reload
   sudo systemctl enable 100days
   sudo systemctl start 100days
   sudo systemctl status 100days
   ```

### Environment Variables

You can customize the server by setting environment variables:

- `PORT`: Server port (default: 3000)

Example:
```bash
PORT=8080 node server.js
```

## API Endpoints

### GET /api/ip/
Returns client IP information in JSON format.

**Response:**
```json
{
  "ip": "192.168.1.100",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "userAgent": "Mozilla/5.0...",
  "isIPv6": false
}
```

## Development

### Local Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Server will be available at http://localhost:3000
```

### Project Structure Notes

- The `public/` directory contains all static files that will be served
- Individual day pages are in numbered subdirectories (1/, 2/, 3/, etc.)
- The main `index.html` serves as the default page
- Assets are stored in `public/assets/`

## Troubleshooting

### Common Issues

1. **Port already in use**:
   ```bash
   # Find process using port 3000
   sudo lsof -i :3000

   # Kill the process
   sudo kill -9 <PID>
   ```

2. **Permission denied**:
   ```bash
   # If running on port 80 or 443, use sudo
   sudo node server.js
   ```

3. **Firewall blocking connections**:
   ```bash
   # Allow port 3000 through firewall
   sudo ufw allow 3000
   ```

### Logs

- Check application logs with PM2: `pm2 logs 100days-app`
- Check systemd logs: `sudo journalctl -u 100days -f`

## Migration from Cloudflare Workers

This project was originally designed for Cloudflare Workers. Key changes made:

- Replaced `worker.js` with `server.js` (Express server)
- Removed `wrangler.toml` configuration
- Updated IP detection logic for Node.js environment
- Added static file serving for the `public/` directory
- Maintained the same API endpoint structure

The functionality remains identical, but now runs on traditional Node.js infrastructure.
