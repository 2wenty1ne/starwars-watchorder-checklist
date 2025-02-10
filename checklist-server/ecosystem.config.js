module.exports = {
    apps: [
      {
        name: 'checklist-backend', // Name of your application
        script: 'index.ts', // Entry point of your backend
        interpreter: 'ts-node', // Use ts-node for TypeScript
        instances: 1, // Number of instances to run
        autorestart: true, // Automatically restart the app if it crashes
        watch: false, // Disable file watching (set to true for development)
        max_memory_restart: '1G', // Restart the app if it exceeds 1GB memory
        env: {
          NODE_ENV: 'production', // Environment variables
        },
      },
    ],
  };