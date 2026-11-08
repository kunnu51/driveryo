# DRIVERYO System Architecture Document

## 1. Executive Summary
**DRIVERYO** is a premium, on-demand professional driver booking platform engineered specifically for **customer-owned vehicles**. Unlike traditional taxi or cab aggregators (e.g., Uber, Ola), Driveryo provides vetted, professional chauffeurs who arrive at the customer's location to drive the customer's private car.

Initial Launch Location: **Hyderabad, Telangana, India** (expanding across Tier-1/2 Indian metros).

---

## 2. High-Level System Architecture Diagram

```mermaid
flowchart TB
    subgraph Clients["Client Applications"]
        Web["Customer Website (Next.js 14 / React / Tailwind)"]
        AdminWeb["Admin Operations Console (Next.js 14 / Tailwind)"]
        CustMobile["Customer Mobile App (Flutter / Android & iOS)"]
        DrvMobile["Driver Partner App (Flutter / Android & iOS)"]
    end

    subgraph EdgeLayer["Edge & Ingress (AWS / Cloudflare)"]
        CDN["Cloudflare CDN & DDoS Protection"]
        LB["AWS Application Load Balancer / Nginx Ingress"]
    end

    subgraph BackendCluster["Backend Micro-modular Engine (NestJS / Node.js)"]
        API["REST API Layer (/api/v1)"]
        WS["WebSocket Gateway (Real-Time Tracking & Dispatch)"]
        AuthMod["Auth & RBAC Module (JWT / Refresh Tokens)"]
        BookingMod["Booking Lifecycle & State Machine"]
        MatchMod["Driver Proximity & Matching Engine"]
        PricingMod["Dynamic Fare & Surcharge Engine"]
        PayMod["Payment & Razorpay Webhook Engine"]
        NotifMod["Notification Pipeline (FCM / SMS / Email)"]
    end

    subgraph DataTier["Data Tier"]
        Postgres[(PostgreSQL 16 with PostGIS & Prisma)]
        RedisCache[(Redis Cluster: Caching & Dispatch Queues)]
        S3Bucket[("AWS S3: Encrypted KYC & Invoices")]
    end

    subgraph Integrations["External Services"]
        GMaps["Google Maps Platform (Places, Routes, Geocoding)"]
        Razorpay["Razorpay Gateway (UPI, Cards, Webhooks)"]
        SMS["SMS Gateway (MSG91 / Indian DLT compliant)"]
        FCM["Firebase Cloud Messaging (FCM APNs / GCM)"]
    end

    Web --> CDN
    AdminWeb --> CDN
    CustMobile --> LB
    DrvMobile --> LB
    CDN --> LB
    LB --> API
    LB --> WS

    API --> AuthMod
    API --> BookingMod
    API --> MatchMod
    API --> PricingMod
    API --> PayMod
    API --> NotifMod

    WS <--> MatchMod
    WS <--> RedisCache

    BookingMod --> Postgres
    MatchMod --> RedisCache
    MatchMod --> Postgres
    PayMod --> Postgres
    PayMod --> Razorpay
    NotifMod --> FCM
    NotifMod --> SMS
    BookingMod --> GMaps
    AuthMod --> Postgres
    AuthMod --> RedisCache
    API --> S3Bucket
```

---

## 3. Technology Stack Breakdown

| Layer | Technology | Rationale |
| :--- | :--- | :--- |
| **Customer Website** | Next.js 14, React 18, TypeScript, Tailwind CSS | Fast SSR/SSG for SEO, seamless dynamic booking widget, mobile-responsive. |
| **Admin Operations** | Next.js 14, React 18, TypeScript, Tailwind CSS | High productivity, reusable dashboard widgets, real-time live map operations. |
| **Customer Mobile App** | Flutter 3.x, Dart | Single codebase for iOS and Android, native 60fps animations, reactive state. |
| **Driver Mobile App** | Flutter 3.x, Dart | Reliable background location tracking, battery-efficient telemetry, push dispatch. |
| **Backend Core** | NestJS, TypeScript, Node.js | Clean architecture, modular dependency injection, enterprise TypeScript, WebSockets. |
| **Database & ORM** | PostgreSQL 16 + Prisma ORM | ACID compliance, geospatial indexing, relational integrity, migrations. |
| **Cache & Queue** | Redis 7 | In-memory driver spatial index, active dispatch queues, token blacklists, session caching. |
| **Payments** | Razorpay (UPI, Credit/Debit, Netbanking) | Standard of excellence in India; comprehensive webhooks and automated refunds. |
| **Maps & Routing** | Google Maps Platform | Accurate Indian road topology, Places autocomplete, distance matrix. |
| **Push & SMS** | Firebase Cloud Messaging (FCM) & MSG91 | High-throughput Indian DLT SMS delivery and instant background push notifications. |

---

## 4. Key Subsystem Workflows

### 4.1 Driver Matching & Dispatch Algorithm
1. **Request Intake**: Customer triggers booking with pickup coordinate $L_{pickup} = (\phi_p, \lambda_p)$, vehicle type (e.g. Sedan, Automatic), service type (e.g. Instant).
2. **Radial Search**: System queries Redis GEO index (`GEORADIUS` / `GEOSEARCH`) for verified, active drivers with `isOnline: true`, `isBusy: false`, and matching transmission skill ($R = 5\text{ km}$, expandable to $10\text{ km}$).
3. **Offer Batching**: Offer sent to nearest optimal driver via WebSocket/FCM with a **30-second accept timeout**.
4. **Locking & Concurrency**: Atomic claim handled via Redis lock. If driver rejects or times out, the next ranked driver is queried.
5. **Assignment Confirmation**: Driver accept triggers booking status update to `ASSIGNED`, locks driver state to `isBusy = true`, sends push notification and live tracking link to customer.

### 4.2 Security & Financial Integrity
- **Two-Sided Trip Start OTP**: Driver cannot start the trip meter without inputting the customer's unique 4-digit OTP.
- **Server-Side Pricing Verification**: All quotes are cryptographically signed or generated server-side from official `PricingRule` entities.
- **Razorpay Webhook Verification**: Signature verification (`HMAC SHA256`) is mandatory before booking transition to `PAID`.
