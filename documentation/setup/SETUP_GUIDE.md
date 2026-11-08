# DRIVERYO Local Development & Setup Guide

## 1. Prerequisites
- **Node.js**: v18.18.0+ or v20.x
- **pnpm**: v8.x or v9.x (or npm/yarn)
- **PostgreSQL**: v14+ or v16
- **Redis**: v6+ or v7
- **Flutter SDK**: v3.19+ (for mobile applications)
- **Docker & Docker Compose** (Optional, for containerized local services)

---

## 2. Quickstart with Docker Compose

1. Clone or navigate to the project directory:
   ```bash
   cd driveryo
   ```

2. Copy environment template:
   ```bash
   cp .env.example .env
   ```

3. Spin up PostgreSQL and Redis services:
   ```bash
   docker-compose -f infrastructure/docker/docker-compose.yml up -d postgres redis
   ```

4. Install dependencies:
   ```bash
   pnpm install
   ```

5. Run database migrations and seed default data:
   ```bash
   pnpm prisma:migrate
   pnpm seed
   ```

6. Start all applications in development mode:
   ```bash
   pnpm dev
   ```

   - **Website**: http://localhost:3000
   - **Admin Console**: http://localhost:3001
   - **Backend API**: http://localhost:4000/api/v1
   - **Swagger Docs**: http://localhost:4000/api/docs

---

## 3. Running Applications Individually

### 3.1 Website (`apps/website`)
```bash
cd apps/website
pnpm dev
```

### 3.2 Admin Dashboard (`apps/admin`)
```bash
cd apps/admin
pnpm dev
```

### 3.3 Backend API (`apps/backend`)
```bash
cd apps/backend
pnpm start:dev
```

### 3.4 Customer Mobile App (`apps/customer-mobile`)
```bash
cd apps/customer-mobile
flutter pub get
flutter run
```

### 3.5 Driver Mobile App (`apps/driver-mobile`)
```bash
cd apps/driver-mobile
flutter pub get
flutter run
```
