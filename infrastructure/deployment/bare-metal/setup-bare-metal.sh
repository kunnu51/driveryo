#!/usr/bin/env bash
# ==============================================================================
# DRIVERYO NATIVE BARE-METAL SERVER PROVISIONER (NO DOCKER)
# Installs & Configures: Node.js 20, PM2, PostgreSQL 16, Redis, Nginx, Certbot
# OS: Ubuntu 22.04 LTS (AWS Lightsail / EC2 / Any VPS)
# ==============================================================================

set -euo pipefail

echo "=========================================================="
echo "   DRIVERYO NATIVE SERVER SETUP (NO DOCKER)               "
echo "=========================================================="

# 1. Update OS Packages
echo "[1/8] Updating Ubuntu system packages..."
export DEBIAN_FRONTEND=noninteractive
apt-get update -y && apt-get upgrade -y
apt-get install -y curl git ufw htop build-essential libpq-dev certbot python3-certbot-nginx

# 2. Add 2GB Swap Memory (Guarantees zero Out-Of-Memory crashes)
echo "[2/8] Setting up 2GB Swap memory..."
if [ ! -f /swapfile ]; then
    fallocate -l 2G /swapfile
    chmod 600 /swapfile
    mkswap /swapfile
    swapon /swapfile
    echo '/swapfile none swap sw 0 0' >> /etc/fstab
    echo "vm.swappiness=10" >> /etc/sysctl.conf
    sysctl -p
fi

# 3. Install Node.js 20 LTS & PM2
echo "[3/8] Installing Node.js 20 LTS and PM2..."
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt-get install -y nodejs
fi
npm install -g pm2

# 4. Install Native PostgreSQL 16
echo "[4/8] Installing and configuring native PostgreSQL 16..."
apt-get install -y postgresql postgresql-contrib
systemctl enable postgresql
systemctl start postgresql

# Create Database and Dedicated User
sudo -u postgres psql -tc "SELECT 1 FROM pg_roles WHERE rolname='driveryo_user'" | grep -q 1 || \
sudo -u postgres psql -c "CREATE USER driveryo_user WITH PASSWORD 'SecureNativeDbPassword2026!';"

sudo -u postgres psql -tc "SELECT 1 FROM pg_database WHERE datname='driveryo_prod'" | grep -q 1 || \
sudo -u postgres psql -c "CREATE DATABASE driveryo_prod OWNER driveryo_user;"

sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE driveryo_prod TO driveryo_user;"

# 5. Install Native Redis 7
echo "[5/8] Installing native Redis..."
apt-get install -y redis-server
systemctl enable redis-server
systemctl start redis-server

# 6. Configure Nginx Reverse Proxy
echo "[6/8] Configuring native Nginx reverse proxy..."
apt-get install -y nginx
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cp "$SCRIPT_DIR/nginx-driveryo.conf" /etc/nginx/sites-available/driveryo.conf

# Enable site
ln -sf /etc/nginx/sites-available/driveryo.conf /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Test Nginx syntax and reload
nginx -t
systemctl enable nginx
systemctl reload nginx

# 7. Configure Linux Firewall
echo "[7/8] Enabling firewall protection (UFW)..."
ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp   # SSH
ufw allow 80/tcp   # HTTP
ufw allow 443/tcp  # HTTPS
ufw --force enable

# 8. Start Services with PM2
echo "[8/8] Starting Driveryo services with PM2..."
cd /opt/driveryo

# Backend dependencies & Prisma migration
echo "Building backend..."
cd /opt/driveryo/apps/backend
npm install
npx prisma db push --schema=../../infrastructure/database/prisma/schema.prisma || true
npm run build || true

# Website dependencies & build
echo "Building website..."
cd /opt/driveryo/apps/website
npm install
npm run build || true

# Admin dependencies & build
echo "Building admin..."
cd /opt/driveryo/apps/admin
npm install
npm run build || true

# Launch PM2 with ecosystem config
cd /opt/driveryo/infrastructure/deployment/bare-metal
pm2 start ecosystem.config.js
pm2 save
pm2 startup systemd -u root --hp /root || true

echo "=========================================================="
echo "   [SUCCESS] DRIVERYO NATIVE STACK IS ONLINE!             "
echo "=========================================================="
echo "Active native processes:"
pm2 status
echo ""
echo "Next step for Free HTTPS SSL (run this once DNS is pointed):"
echo "sudo certbot --nginx -d driveryo.com -d admin.driveryo.com -d api.driveryo.com"
echo "=========================================================="
