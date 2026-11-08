# ==============================================================================
# DRIVERYO PM2 ECOSYSTEM CONFIGURATION (BARE-METAL / NO DOCKER)
# Manages Tier 1 (Frontends) and Tier 2 (Backend API) with Auto-Restart
# ==============================================================================

module.exports = {
  apps: [
    // --------------------------------------------------------------------------
    // TIER 2: CORE BACKEND & WEBSOCKET ENGINE (Port 4000)
    // --------------------------------------------------------------------------
    {
      name: 'driveryo-backend',
      cwd: '/opt/driveryo/apps/backend',
      script: 'dist/src/main.js',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '350M',
      env: {
        NODE_ENV: 'production',
        PORT: 4000,
        DATABASE_URL: 'postgresql://driveryo_user:SecureNativeDbPassword2026!@127.0.0.1:5432/driveryo_prod?schema=public',
        REDIS_HOST: '127.0.0.1',
        REDIS_PORT: 6379,
        JWT_SECRET: 'driveryo_native_production_secret_key_2026',
        AWS_REGION: 'ap-south-1',
        AWS_S3_BUCKET: 'driveryo-kyc-documents-hyd'
      }
    },

    // --------------------------------------------------------------------------
    // TIER 1: CUSTOMER FACING WEBSITE (Port 3000)
    // --------------------------------------------------------------------------
    {
      name: 'driveryo-website',
      cwd: '/opt/driveryo/apps/website',
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 3000',
      instances: 1,
      autorestart: true,
      max_memory_restart: '300M',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        NEXT_PUBLIC_API_URL: 'https://api.driveryo.com/api/v1'
      }
    },

    // --------------------------------------------------------------------------
    // TIER 1: ADMIN OPERATIONS DASHBOARD (Port 3001)
    // --------------------------------------------------------------------------
    {
      name: 'driveryo-admin',
      cwd: '/opt/driveryo/apps/admin',
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 3001',
      instances: 1,
      autorestart: true,
      max_memory_restart: '250M',
      env: {
        NODE_ENV: 'production',
        PORT: 3001,
        NEXT_PUBLIC_API_URL: 'https://api.driveryo.com/api/v1'
      }
    }
  ]
};
