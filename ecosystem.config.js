module.exports = {
  apps: [
    {
      name: "ecom",
      script: "pnpm",
      args: "start",
      cwd: __dirname,
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      node_args: "--max-old-space-size=896",
      env: {
        NODE_ENV: "production",
        PORT: 3000, // ✅ ici
      },
      error_file: "./logs/error.log",
      out_file: "./logs/out.log",
      merge_logs: true,
      time: true,
    },
  ],
};
