// PM2 ecosystem configuration
// Start with: pm2 start ecosystem.config.cjs
module.exports = {
  apps: [{
    name: "ieee-hardware-bot",
    script: "./src/index.js",
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: "200M",
    env: {
      NODE_ENV: "production"
    }
  }]
};
