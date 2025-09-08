module.exports = {
    apps: [
      {
        name: "100days",
        script: "./server.js",
        env: {
          PORT: 3001,
          NODE_ENV: "development"
        },
        env_production: {
          PORT: 3001,
          NODE_ENV: "production"
        }
      }
    ]
  };