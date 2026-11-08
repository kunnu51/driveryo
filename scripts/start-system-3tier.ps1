# ==============================================================================
# DRIVERYO 3-TIER ARCHITECTURE LAUNCHER (RUN FROM YOUR PC / SYSTEM)
# ==============================================================================

param (
    [ValidateSet("standalone", "docker", "tunnel")]
    [string]$Mode = "standalone"
)

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "   DRIVERYO 3-TIER ARCHITECTURE SYSTEM LAUNCHER          " -ForegroundColor Cyan
Write-Host "   Mode: $Mode                                           " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

$WorkspaceRoot = Split-Path -Parent $PSScriptRoot

Write-Host "`n[+] 3-TIER TOPOLOGY RUNNING ON YOUR SYSTEM:" -ForegroundColor Green
Write-Host "  - TIER 1 (Presentation): Next.js Web (3000), Admin (4000/admin), Mobile Simulators (4000/customer-app, 4000/driver-app)" -ForegroundColor White
Write-Host "  - TIER 2 (Application) : NestJS / REST API & Telemetry Gateway (Port 4000)" -ForegroundColor White
Write-Host "  - TIER 3 (Data Tier)   : PostgreSQL 16 & Redis In-Memory State" -ForegroundColor White

if ($Mode -eq "docker") {
    $dockerCmd = Get-Command "docker" -ErrorAction SilentlyContinue
    if (-not $dockerCmd) {
        Write-Host "`n[!] Docker is not installed or not in PATH." -ForegroundColor Yellow
        Write-Host "    Falling back to standalone system mode..." -ForegroundColor Yellow
        $Mode = "standalone"
    } else {
        Write-Host "`n[*] Starting 3-Tier Stack via Docker Compose..." -ForegroundColor Cyan
        $dockerFile = Join-Path $WorkspaceRoot "infrastructure\docker\docker-compose.3tier-local.yml"
        docker compose -f $dockerFile up -d
        Write-Host "[SUCCESS] Docker 3-Tier services started!" -ForegroundColor Green
        docker compose -f $dockerFile ps
        Exit 0
    }
}

if ($Mode -eq "tunnel") {
    Write-Host "`n[*] Starting Free Cloudflare Tunnel for Internet Access..." -ForegroundColor Cyan
    Write-Host "This gives your PC a free public HTTPS address without port forwarding!" -ForegroundColor Gray

    $cloudflared = Get-Command "cloudflared" -ErrorAction SilentlyContinue
    if (-not $cloudflared) {
        Write-Host "`n[!] 'cloudflared' binary not detected in PATH." -ForegroundColor Yellow
        Write-Host "Quick 30-second setup for Cloudflare Tunnel:" -ForegroundColor White
        Write-Host "  1. Download cloudflared: https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-windows-amd64.exe" -ForegroundColor White
        Write-Host "  2. Rename to 'cloudflared.exe' and put in C:\Windows\System32 (or any PATH directory)." -ForegroundColor White
        Write-Host "  3. Run: cloudflared tunnel --url http://localhost:4000" -ForegroundColor White
        Write-Host "  4. Cloudflare will print a URL like: https://random-name.trycloudflare.com" -ForegroundColor Green
        Write-Host "  5. Put that URL into your Customer & Driver Flutter apps as baseUrl!" -ForegroundColor Green
        Exit 0
    }

    Write-Host "[+] Launching tunnel exposing Port 4000 to the world..." -ForegroundColor Green
    cloudflared tunnel --url http://localhost:4000
    Exit 0
}

# Standalone 3-Tier Mode
Write-Host "`n[*] Launching Driveryo 3-Tier Standalone Server on Port 4000..." -ForegroundColor Cyan
Write-Host "Local Endpoints available immediately:" -ForegroundColor White
Write-Host "  - Presentation Tier (Admin)       : http://localhost:4000/admin" -ForegroundColor White
Write-Host "  - Presentation Tier (Customer App): http://localhost:4000/customer-app" -ForegroundColor White
Write-Host "  - Presentation Tier (Driver App)  : http://localhost:4000/driver-app" -ForegroundColor White
Write-Host "  - Application Tier (REST API)     : http://localhost:4000/api/v1" -ForegroundColor White
Write-Host "  - Swagger API Documentation       : http://localhost:4000/docs" -ForegroundColor White

Write-Host "`nTo expose this to real mobile phones anywhere in India for FREE:" -ForegroundColor Yellow
Write-Host "  Run: .\scripts\start-system-3tier.ps1 -Mode tunnel" -ForegroundColor Yellow

$serverScript = Join-Path $WorkspaceRoot "apps\backend\standalone_server.py"
& "C:\Users\Rafi\AppData\Local\Programs\Python\Python313\python.exe" $serverScript
