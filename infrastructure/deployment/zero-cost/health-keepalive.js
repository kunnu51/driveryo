#!/usr/bin/env node
// ==============================================================================
// DRIVERYO ZERO-COST SERVER WARMUP & KEEP-ALIVE SCRIPT
// Pings your free cloud backend so it NEVER goes to sleep / avoids cold starts!
// Can be run via UptimeRobot, cron, or GitHub Actions.
// ==============================================================================

const https = require('https');

const TARGET_URL = process.env.API_URL || 'https://driveryo-api.koyeb.app/api/v1/health';

console.log(`[${new Date().toISOString()}] Pinging backend to maintain zero-cold-start state: ${TARGET_URL}`);

https.get(TARGET_URL, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    console.log(`[${new Date().toISOString()}] Server response [${res.statusCode}]: ${data.slice(0, 100)}`);
    if (res.statusCode >= 200 && res.statusCode < 400) {
      console.log('✅ Driveryo backend is active, warm, and ready for mobile dispatch.');
      process.exit(0);
    } else {
      console.error(`⚠️ Server responded with status ${res.statusCode}`);
      process.exit(1);
    }
  });
}).on('error', (err) => {
  console.error(`❌ Connection error: ${err.message}`);
  process.exit(1);
});
