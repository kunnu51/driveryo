# DRIVERYO — Complete Mobility Platform
> **"Your Car. Your Journey. Our Driver."**
> Professional, on-demand driver booking platform for customer-owned vehicles in Hyderabad, India.

---

## 🌟 Overview
**DRIVERYO** revolutionizes personal mobility across Indian metropolitan cities by connecting private car owners with vetted, highly-trained professional chauffeurs. Whether navigating daily city traffic, attending late-night events, scheduling multi-day outstation getaways, or arranging monthly corporate driver plans, Driveryo ensures you travel comfortably in your own vehicle.

---

## 🏗️ Architecture & Monorepo Structure

```
driveryo/
├── apps/
│   ├── website/              # Customer-facing responsive website & web booking engine (Next.js 14, Tailwind)
│   ├── admin/                # Admin operations, driver approval & live Hyderabad operations map (Next.js 14)
│   ├── customer-mobile/      # Customer iOS & Android app (Flutter 3.x, Dart)
│   ├── driver-mobile/        # Driver partner iOS & Android app (Flutter 3.x, Dart)
│   └── backend/              # NestJS micro-modular REST API, WebSockets, Dispatch & Matching Engine
├── packages/
│   ├── shared-types/         # TypeScript contracts, enums & interfaces
│   ├── shared-config/        # Shared constants, Hyderabad service zones & pricing rules
│   ├── api-client/           # Isomorphic API SDK for Web and Admin clients
│   └── validation/           # Zod schemas for input validation & fare computation
├── infrastructure/
│   ├── docker/               # Dockerfiles & docker-compose configurations
│   ├── deployment/           # Kubernetes manifests & AWS ECS deployment task specs
│   └── database/             # PostgreSQL migrations, Prisma schema & seed scripts
├── documentation/
│   ├── architecture/         # System architecture & Brand design system
│   ├── api/                  # Complete REST & WebSocket specification
│   ├── database/             # ER diagrams & schema documentation
│   ├── setup/                # Local development instructions
│   └── deployment/           # Production & staging deployment guide
└── scripts/                  # Development scripts, database seeds & test runners
```

---

## 🚀 Key Platform Features

1. **Dedicated to Customer-Owned Vehicles**: Specialized for manual and automatic transmissions across Hatchbacks, Sedans, SUVs, and Luxury cars.
2. **Hyderabad-Centric Launch**: Pre-configured with Hyderabad landmarks (HITEC City, Gachibowli, Banjara Hills, Jubilee Hills, RGIA Airport, Secunderabad).
3. **Comprehensive Booking Services**:
   - Instant Driver (dispatched within 10-15 minutes)
   - Scheduled Driver (advance reservations)
   - Hourly & Daily Driver Packages (4 hrs, 8 hrs, 12 hrs)
   - Monthly Chauffeur Subscription (daily commute passes)
   - Outstation & Round-Trip Drivers
   - Corporate Chauffeur Management
4. **Vetted Driver Partners**: Multi-layer KYC verification (Driving License, Aadhaar, Police Clearance, Commercial Driving Record).
5. **Secure Trip OTP Verification**: Trips cannot commence without customer 4-digit OTP.
6. **Transparent Pricing**: Dynamic fare engine with night surcharge windows, extra hour charges, and waiting fees.
7. **Razorpay Payments**: UPI, cards, netbanking, digital receipts, and automated partner payouts.

---

## 🛠️ Quick Start

```bash
# 1. Install dependencies
pnpm install

# 2. Setup environment variables
cp .env.example .env

# 3. Start local database & cache
docker-compose -f infrastructure/docker/docker-compose.yml up -d postgres redis

# 4. Generate Prisma client & seed data
pnpm prisma:migrate
pnpm seed

# 5. Start development servers
pnpm dev
```
