# DRIVERYO 3-Tier Architecture — Free Hosting & Self-Hosted System Guide

This guide details how to run the entire DRIVERYO platform using a **3-Tier Architecture** at **₹0 cost**, either:
1. **From Your Own System (Home PC / Laptop as a Production Server)** with free secure tunneling.
2. **100% Free Cloud Providers** (Always-on 24/7 without keeping your PC powered on).
3. **Hybrid Architecture** (Free cloud database + local application server).

---

## 1. 3-Tier Architecture Overview

```mermaid
flowchart TD
    subgraph TIER1["Tier 1: Presentation Tier (Client / Edge)"]
        CA["Customer Flutter Mobile App\n(Android APK & iOS)"]
        DA["Driver Flutter Mobile App\n(Android APK & iOS)"]
        WEB["Driveryo Customer Website\n(Next.js / SSR / React)"]
        ADM["Operations Admin Dashboard\n(Next.js / Real-time Map)"]
    end

    subgraph INGRESS["Secure Free Ingress & Tunnel Layer"]
        CF["Cloudflare Zero Trust Tunnel / Reverse Proxy\n(Free HTTPS SSL, DDoS Protection, No Port Forwarding)"]
    end

    subgraph TIER2["Tier 2: Application / Business Logic Tier"]
        API["Driveryo Core Backend (NestJS / Node.js)\nREST API on Port 4000"]
        WS["WebSocket Real-Time Gateway\n(Driver Coordinates & Trip Status)"]
        MATCH["Hyderabad Driver Matching Engine"]
        PRICE["Dynamic Fare & Surcharge Engine"]
        SEC["OTP Security & RBAC Guard"]
    end

    subgraph TIER3["Tier 3: Data & Persistence Tier"]
        DB[("PostgreSQL 16 Relational Database\n(36 Tables, Bookings, Users, Audits)")]
        CACHE[("Redis 7 In-Memory Store\n(Driver Telemetry, Queues, Locks)")]
        STORAGE[("Object Storage (S3 / Cloudflare R2)\n(Driver Licenses, KYC, Car Photos)")]
    end

    CA -->|HTTPS / WSS| CF
    DA -->|HTTPS / WSS| CF
    WEB -->|HTTPS| CF
    ADM -->|HTTPS| CF

    CF --> API
    CF --> WS

    API --> MATCH
    API --> PRICE
    API --> SEC

    API -->|Prisma ORM (Port 5432)| DB
    API -->|ioredis (Port 6379)| CACHE
    API -->|S3 API (Port 9000 / HTTPS)| STORAGE
```

---

## 2. Approach 1: Self-Hosted From Your Own System (100% Free)

You can turn your current Windows PC or laptop into the complete 3-Tier Server. Real mobile devices anywhere in India running your compiled `.apk` can communicate with your machine securely.

### Why You Don't Need a Static IP or Router Port Forwarding
Normally, hosting from home requires a static public IP and risky router port forwarding.  
Instead, we use **Cloudflare Zero Trust Tunnels (`cloudflared`)**, which:
- Is **100% Free forever**.
- Creates an outbound encrypted tunnel directly to Cloudflare's global edge network.
- Gives you a live public HTTPS address (`https://yourname.trycloudflare.com` or `https://api.driveryo.com`).
- Works behind any home Wi-Fi, Jio, Airtel, or 4G/5G mobile hotspot without opening ports.

### System 3-Tier Breakdown:
| Tier | Component | How It Runs on Your System | Port |
| :--- | :--- | :--- | :--- |
| **Tier 1** | Next.js Web & Admin | Local Node.js or Docker container | `3000` (Web), `3001` (Admin) |
| **Tier 2** | NestJS / Python Backend | `apps/backend/standalone_server.py` or Docker | `4000` |
| **Tier 3 (DB)** | PostgreSQL 16 | Docker (`postgres:16-alpine`) or native PostgreSQL | `5432` |
| **Tier 3 (Cache)** | Redis 7 | Docker (`redis:7-alpine`) or Memurai on Windows | `6379` |
| **Tier 3 (Files)** | MinIO or Local Disk | Docker (`minio/minio`) or local folder | `9000` |
| **Ingress** | Cloudflare Tunnel | `cloudflared.exe` (Free one-command setup) | `443 (HTTPS)` |

### Quick Start (1-Click Launch on Windows):
We provide the automated runner script:
```powershell
.\scripts\start-system-3tier.ps1
```
This script will:
1. Verify database and Redis connectivity.
2. Launch the Tier 2 application server.
3. Automatically start a Cloudflare Tunnel giving you a public HTTPS URL (e.g. `https://driveryo-hyd.trycloudflare.com`).
4. Output the exact API URL to configure into your Flutter mobile apps.

---

## 3. Approach 2: 100% Free Cloud 3-Tier Stack (Always-On 24/7)

If you don't want to keep your PC powered on 24/7, you can deploy each tier to industry-standard free cloud tiers:

| Tier | Provider | Free Tier Limits | Cost |
| :--- | :--- | :--- | :--- |
| **Tier 1 (Web & Admin)** | **Vercel** or **Cloudflare Pages** | Unlimited websites, 100 GB bandwidth, free custom domains, automatic SSL | **₹0 / mo** |
| **Tier 1 (Mobile APKs)** | **GitHub Releases** / **Firebase App Distribution** | Unlimited downloads, zero bandwidth fees | **₹0 / mo** |
| **Tier 2 (API & WS)** | **Render.com** or **Fly.io** or **Koyeb** | 750 free compute hours/month, automatic Git deployment, free HTTPS | **₹0 / mo** |
| **Tier 3 (Database)** | **Neon.tech** or **Supabase** | Free Serverless PostgreSQL 16 (0.5 GB storage, autoscaling, branchable) | **₹0 / mo** |
| **Tier 3 (Redis Cache)** | **Upstash Redis** | 10,000 free commands/day, Serverless Redis, zero maintenance | **₹0 / mo** |
| **Tier 3 (Storage)** | **Cloudflare R2** | 10 GB free storage, **zero egress bandwidth fees** (huge savings for KYC images) | **₹0 / mo** |

### Free Cloud Deployment Steps:

#### Step 1: Create Free Tier 3 Database on Neon.tech
1. Go to [https://neon.tech](https://neon.tech) and sign up for a free account.
2. Create a new project called `driveryo`.
3. Copy the PostgreSQL connection string:
   ```text
   DATABASE_URL="postgresql://neondb_owner:password@ep-xyz.ap-southeast-1.aws.neon.tech/driveryo?sslmode=require"
   ```
4. Run migrations from your terminal:
   ```bash
   npx prisma migrate deploy --schema=infrastructure/database/prisma/schema.prisma
   ```

#### Step 2: Create Free Tier 3 Redis on Upstash
1. Go to [https://upstash.com](https://upstash.com) and create a free Redis database.
2. Select region `ap-south-1` (Mumbai) for low latency in Hyderabad.
3. Copy the `REDIS_URL`.

#### Step 3: Deploy Tier 2 Backend to Render or Koyeb
1. Go to [https://render.com](https://render.com) -> New **Web Service**.
2. Connect your Driveryo GitHub repository.
3. Set Root Directory: `apps/backend`.
4. Build Command: `npm install && npm run build`.
5. Start Command: `npm run start:prod`.
6. Add Environment Variables:
   - `DATABASE_URL`: (from Step 1)
   - `REDIS_URL`: (from Step 2)
   - `JWT_SECRET`: `driveryo_super_secret_production_key_2026`
   - `PORT`: `10000`
7. Render gives you an instant free HTTPS domain: `https://driveryo-backend.onrender.com`.

#### Step 4: Deploy Tier 1 Frontends to Vercel
1. Go to [https://vercel.com](https://vercel.com) -> New Project.
2. Deploy Website: Root `apps/website`, set `NEXT_PUBLIC_API_URL=https://driveryo-backend.onrender.com/api/v1`.
3. Deploy Admin: Root `apps/admin`, set `NEXT_PUBLIC_API_URL=https://driveryo-backend.onrender.com/api/v1`.

---

## 4. How to Connect the Mobile Flutter Apps to Your Free Server

Whether you choose **Approach 1 (Local PC with Cloudflare Tunnel)** or **Approach 2 (Free Cloud)**, connecting your mobile apps takes just one line:

Open `apps/customer-mobile/lib/services/api_service.dart` and `apps/driver-mobile/lib/services/driver_api_service.dart`:

```dart
// For Self-Hosted System via Cloudflare Tunnel:
static const String baseUrl = 'https://driveryo-api.trycloudflare.com/api/v1';

// OR For Free Cloud (Render):
static const String baseUrl = 'https://driveryo-backend.onrender.com/api/v1';
```

Then compile your APK via:
```powershell
.\scripts\build-mobile-apps.ps1 -Target all -Mode release
```
Now, any Android or iOS device in the world will communicate with your 3-tier backend!

---

## 5. Comparison Matrix

| Feature | Approach 1: Self-Hosted From PC | Approach 2: 100% Free Cloud | Approach 3: Paid Cloud (AWS/GCP) |
| :--- | :--- | :--- | :--- |
| **Monthly Cost** | **₹0 (Completely Free)** | **₹0 (Completely Free)** | ₹3,000 – ₹10,000 / month |
| **Hardware Limits** | Your PC RAM/CPU (e.g. 16GB RAM) | 512MB RAM per container | Pay-per-spec |
| **Uptime** | Whenever your PC is on | 24/7 Always-On | 99.99% SLA |
| **Setup Speed** | **2 minutes** | 10 minutes | 45 minutes |
| **Database Size** | Unlimited (your hard drive) | 500 MB (Neon / Supabase) | Elastic GBs |
| **Best For** | Development, testing, pilot launch in Hyderabad | Public MVP, beta testing with real drivers | High-volume production scale |
