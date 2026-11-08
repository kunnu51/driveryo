# DRIVERYO — Zero-Cost Launch & Scale-Ready Cloud Architecture
## Bootstrap for ₹0 / month ($0) Today — Seamlessly Scale to 50,000+ Rides Tomorrow

---

## 1. Executive Summary & Scaling Philosophy

This blueprint gives you a **₹0.00 / month** setup right now, with **no credit card traps or expiring 30-day trials**. 

Crucially, **it is NOT a toy prototype or dead-end architecture**. Every piece uses enterprise-grade cloud providers on their **permanent free tiers** using 100% industry-standard protocols (Standard PostgreSQL 16, Redis protocol, AWS S3 API, Next.js, and NestJS).

When your fleet in Hyderabad grows from 10 drivers to 500+ drivers, **you do not rewrite a single line of code**. You simply upgrade individual tiers by flipping a switch on the exact same providers.

---

## 2. The Zero-Cost to High-Scale Architecture

```mermaid
flowchart TD
    subgraph STAGE0["TODAY: ₹0 / Month (Permanent Free Tiers)"]
        direction TB
        T1_FREE["Tier 1: Presentation\n• Website & Admin on Vercel / Cloudflare Pages (Free)\n• Mobile APKs on GitHub Releases (Free Unlimited Downloads)"]
        T2_FREE["Tier 2: Business Logic\n• Koyeb or Render Free Web Service (512MB RAM, Free HTTPS)\n• UptimeRobot Free Ping (Prevents Sleep / Cold Starts)"]
        T3_FREE["Tier 3: Data & Storage\n• Database: Neon Serverless PostgreSQL 16 (0.5GB Free)\n• Cache: Upstash Redis (10,000 commands/day Free, Mumbai ap-south-1)\n• Storage: Cloudflare R2 (10GB S3 Storage, ₹0 Egress Bandwidth)"]
    end

    subgraph FLIP["Seamless Transition (Zero Code Rewrite)"]
        ARROW["Scale by changing env variables or tier sliders\nDatabase Schema & S3 API remain 100% identical!"]
    end

    subgraph STAGE1["TOMORROW: Scaled Enterprise Fleet (50,000+ Rides/Mo)"]
        direction TB
        T1_SCALED["Tier 1: Global Edge CDN\n• Vercel Pro or AWS CloudFront Multi-Region\n• Google Play Store & Apple App Store"]
        T2_SCALED["Tier 2: Auto-Scaled Compute\n• Koyeb Auto-Scaling OR AWS ECS Fargate Cluster\n• 4 to 16 Concurrent API Worker Containers"]
        T3_SCALED["Tier 3: Auto-Scaling Data Fabric\n• Neon Auto-Scaling PostgreSQL (Up to 16 vCPU & TBs)\n• Upstash Pro or AWS ElastiCache Dedicated Cluster\n• Cloudflare R2 / AWS S3 Unlimited KYC Storage"]
    end

    STAGE0 --> ARROW --> STAGE1
```

---

## 3. The ₹0 / Month Stack Breakdown (Where Each Tier Lives)

| Tier | Component | Free Cloud Provider | Permanent Free Allowance | Why It Easily Scales Tomorrow |
| :--- | :--- | :--- | :--- | :--- |
| **Tier 1** | Customer Website & Admin | **Vercel** or **Cloudflare Pages** | Unlimited websites, 100 GB bandwidth, free custom domain SSL, global Edge CDN | Just flip to Vercel Pro ($20) when pageviews hit millions. |
| **Tier 1** | Mobile APK Hosting | **GitHub Releases** / **Firebase App Distro** | Unlimited downloads, zero storage or bandwidth fees | Seamlessly transition to Google Play Console and Apple App Store. |
| **Tier 2** | Backend API & WebSockets | **Koyeb** or **Render** | 512 MB RAM, free HTTPS domain, auto-deploy from GitHub repository | Scale horizontally: add more container instances with a single slider. |
| **Tier 3 (DB)** | PostgreSQL 16 | **Neon.tech** | Free Serverless Postgres (0.5 GB storage, autoscaling compute, SSL, branching) | Neon is autoscaling PostgreSQL. Upgrade storage with 1-click without migrating data. |
| **Tier 3 (Cache)**| Redis 7 | **Upstash Redis** | 10,000 commands/day, Serverless Redis in Mumbai (`ap-south-1`) | Upgrade to pay-as-you-go ($0.20 per 100k requests) without downtime. |
| **Tier 3 (Files)**| KYC & Car Photos | **Cloudflare R2** | 10 GB free storage, **₹0 egress bandwidth fees** (huge savings!) | Uses standard S3 API (`@aws-sdk/client-s3`). Exactly identical to AWS S3. |
| **Keep-Alive** | Zero-Sleep Monitor | **UptimeRobot** | 50 free monitors, pings `/api/v1/health` every 10 minutes | Guarantees backend stays warm 24/7 with zero cold starts. |
| **TOTAL COST** | — | — | **₹0.00 / month ($0.00)** | **100% Production Ready** |

---

## 4. The 3 Growth Stages (Cost & Scale Roadmap)

### Stage 1: The Bootstrap Launch (0 to 1,000 Rides / Month)
- **Monthly Cost: ₹0.00 ($0.00)**
- **Stack**: Koyeb/Render (Free API) + Vercel (Free Frontends) + Neon (Free DB) + Upstash (Free Redis) + Cloudflare R2 (Free KYC S3).
- **Driver Fleet**: 10 to 50 drivers in Hyderabad (Banjara Hills, Hitec City, Gachibowli, Jubilee Hills).
- **Operations**: Fast, fully automated, zero cash burn.

### Stage 2: The Hyderabad Commercial Expansion (1,000 to 15,000 Rides / Month)
- **Monthly Cost: ~₹600 – ₹1,200 / month ($7 – $15)**
- **Upgrade**: Upgrade Koyeb/Render to paid Eco/Starter ($5–$7/mo) for dedicated CPU and 1GB RAM. Neon database remains on the free or $5 tier. Upstash Redis remains under $2/mo.
- **Driver Fleet**: 50 to 300 drivers covering all of Hyderabad and Secunderabad.
- **Operations**: Instant driver assignment, high concurrency, zero performance drops.

### Stage 3: Multi-City Expansion (15,000 to 100,000+ Rides / Month)
- **Monthly Cost: ~₹3,500 – ₹6,500 / month ($40 – $80)**
- **Upgrade**: Multiple load-balanced API containers on Koyeb or AWS ECS. Neon database automatically scales compute vCPUs during peak Friday/Saturday night hours.
- **Driver Fleet**: 1,000+ drivers across Hyderabad, Bengaluru, and Vijayawada.

---

## 5. Step-by-Step Setup: Launching for ₹0 in 20 Minutes

### Step 1: Create Free Serverless PostgreSQL on Neon.tech (Tier 3)
1. Sign up for free at [https://neon.tech](https://neon.tech).
2. Create project: `driveryo-production`.
3. Select region: **Asia Pacific (Singapore / Mumbai)**.
4. Copy your PostgreSQL connection string:
   ```text
   DATABASE_URL="postgresql://neondb_owner:YOUR_PASS@ep-xyz.aws.neon.tech/driveryo?sslmode=require"
   ```
5. Apply the Driveryo database schema with 1 command from your machine:
   ```bash
   npx prisma db push --schema=infrastructure/database/prisma/schema.prisma
   ```

### Step 2: Create Free Serverless Redis on Upstash.com (Tier 3)
1. Sign up for free at [https://upstash.com](https://upstash.com).
2. Create database: `driveryo-cache` -> Select region **ap-south-1 (Mumbai)**.
3. Copy the `REDIS_URL`.

### Step 3: Create Free S3 KYC Storage on Cloudflare R2 (Tier 3)
1. Go to [https://dash.cloudflare.com](https://dash.cloudflare.com) -> **R2 Object Storage**.
2. Create bucket: `driveryo-kyc-documents`.
3. Click **Manage R2 API Tokens** -> Create token with Read & Write permissions.
4. Note your `Account ID`, `Access Key ID`, and `Secret Access Key`.

### Step 4: Deploy the Backend API to Koyeb or Render (Tier 2)
1. Push your Driveryo repository to GitHub.
2. Sign up at [https://koyeb.com](https://koyeb.com) or [https://render.com](https://render.com).
3. Click **New Web Service** -> Connect GitHub repo.
4. Root directory: `apps/backend`.
5. Build command: `npm install && npm run build`.
6. Start command: `npm run start:prod`.
7. Add your environment variables (from [`infrastructure/deployment/zero-cost/env.zero-cost.example`](file:///C:/Users/Rafi/.gemini/antigravity/scratch/driveryo/infrastructure/deployment/zero-cost/env.zero-cost.example)).
8. Koyeb/Render provides your free HTTPS API URL: `https://driveryo-api.koyeb.app`.

### Step 5: Prevent Sleep / Cold Starts with UptimeRobot (100% Free)
Free cloud containers sleep after 15 minutes of inactivity. We solve this permanently for free:
1. Sign up at [https://uptimerobot.com](https://uptimerobot.com) (Free 50 monitors).
2. Add New Monitor -> Type: **HTTP(s)**.
3. Friendly Name: `Driveryo Backend Warmup`.
4. URL: `https://driveryo-api.koyeb.app/api/v1/health`.
5. Monitoring Interval: **Every 10 minutes**.
6. **Result**: Your free backend container stays 100% warm 24/7 with instant 0-second response times!

### Step 6: Deploy Frontends to Vercel (Tier 1)
1. Go to [https://vercel.com](https://vercel.com) -> New Project.
2. Deploy Website: Root `apps/website` -> Set `NEXT_PUBLIC_API_URL=https://driveryo-api.koyeb.app/api/v1`.
3. Deploy Admin: Root `apps/admin` -> Set `NEXT_PUBLIC_API_URL=https://driveryo-api.koyeb.app/api/v1`.

---

## 6. Connecting Your Flutter Mobile Apps

Open [`apps/customer-mobile/lib/services/api_service.dart`](file:///C:/Users/Rafi/.gemini/antigravity/scratch/driveryo/apps/customer-mobile/lib/services/api_service.dart) and [`apps/driver-mobile/lib/services/driver_api_service.dart`](file:///C:/Users/Rafi/.gemini/antigravity/scratch/driveryo/apps/driver-mobile/lib/services/driver_api_service.dart):

```dart
// Point to your free 24/7 cloud API endpoint
static const String baseUrl = 'https://driveryo-api.koyeb.app/api/v1';
```

Then compile your mobile APKs:
```powershell
.\scripts\build-mobile-apps.ps1 -Target all -Mode release
```

---

## 7. Why You Will Never Need to Rewrite Code Later

| Future Scaling Need | How You Solve It | Code Rewrite Required? |
| :--- | :--- | :--- |
| **Database gets 100x larger** | Increase storage slider in Neon dashboard | **NO (Standard PostgreSQL)** |
| **API gets 10,000 requests/sec** | Scale container instances on Koyeb / AWS | **NO (Stateless NestJS architecture)** |
| **Millions of KYC image uploads** | Cloudflare R2 has unlimited scale | **NO (Standard S3 API)** |
| **Switch from Free Cloud to AWS EC2** | Change the 3 DB/Redis/S3 env vars | **NO (100% portable code)** |
