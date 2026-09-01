// pm2 process file for a bare VPS:  pm2 start ecosystem.config.cjs
module.exports = {
  apps: [
    {
      name: "ibill-api",
      script: "dist/main.js",
      instances: 1,
      exec_mode: "fork",
      env: { NODE_ENV: "production" },
      // Reads backend/.env via @nestjs/config; keep it next to this file.
      max_memory_restart: "300M",
    },
  ],
};
