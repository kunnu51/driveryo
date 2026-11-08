#!/usr/bin/env bash
# ==============================================================================
# DRIVERYO AWS LIGHTSAIL / EC2 AUTOMATED 1-CLICK PROVISIONING SCRIPT
# OS: Ubuntu 22.04 LTS (ap-south-1 Mumbai)
# ==============================================================================

set -euo pipefail

echo "=========================================================="
echo "   DRIVERYO AWS LIGHTSAIL / EC2 3-TIER DEPLOYMENT         "
echo "=========================================================="

# 1. Update OS Packages
echo "[1/6] Updating system packages..."
apt-get update -y && apt-get upgrade -y
apt-get install -y curl git ufw htop ca-certificates gnupg lsb-release

# 2. Configure 2GB Swap Memory (Prevents OOM on budget instances)
echo "[2/6] Configuring 2GB swap space for RAM stabilization..."
if [ ! -f /swapfile ]; then
    fallocate -l 2G /swapfile
    chmod 600 /swapfile
    mkswap /swapfile
    swapon /swapfile
    echo '/swapfile none swap sw 0 0' >> /etc/fstab
    echo "vm.swappiness=10" >> /etc/sysctl.conf
    sysctl -p
fi

# 3. Install Docker Engine & Compose v2
echo "[3/6] Installing Docker Engine..."
if ! command -v docker &> /dev/null; then
    mkdir -p /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
    apt-get update -y
    apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
    systemctl enable docker
    systemctl start docker
fi

# 4. Configure Firewall (UFW)
echo "[4/6] Configuring security firewall..."
ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp   # SSH
ufw allow 80/tcp   # HTTP
ufw allow 443/tcp  # HTTPS
ufw --force enable

# 5. Create Daily Database Backup Cronjob
echo "[5/6] Setting up automated daily database backup..."
mkdir -p /opt/driveryo-backups
cat << 'EOF' > /opt/driveryo-backups/backup-db.sh
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/opt/driveryo-backups"
docker exec -t driveryo_postgres_aws pg_dump -U driveryo_user driveryo_prod | gzip > "$BACKUP_DIR/driveryo_db_$DATE.sql.gz"
# Keep only last 7 days locally
find $BACKUP_DIR -type f -name "*.sql.gz" -mtime +7 -delete
echo "[$(date)] Backup completed: driveryo_db_$DATE.sql.gz"
EOF
chmod +x /opt/driveryo-backups/backup-db.sh

# Run daily at 02:00 AM IST (20:30 UTC)
(crontab -l 2>/dev/null || true; echo "30 20 * * * /opt/driveryo-backups/backup-db.sh >> /var/log/driveryo-backup.log 2>&1") | crontab -

# 6. Launch the 3-Tier Production Stack
echo "[6/6] Launching 3-Tier Stack via Docker Compose..."
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

docker compose -f docker-compose.aws-lean.yml up -d --build

echo "=========================================================="
echo "   [SUCCESS] DRIVERYO AWS STACK IS ONLINE!                "
echo "   Endpoints will be live at:                             "
echo "   • Website : https://driveryo.com                       "
echo "   • Admin   : https://admin.driveryo.com                 "
echo "   • API/WS  : https://api.driveryo.com                   "
echo "=========================================================="
