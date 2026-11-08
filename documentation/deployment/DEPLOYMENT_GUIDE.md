# DRIVERYO Staging & Production Deployment Guide

## 1. Domain & DNS Configuration
Driveryo utilizes a clean, decoupled domain layout:
- `driveryo.com`: Main customer-facing website and web booking portal.
- `www.driveryo.com`: Canonical 301 redirect to `https://driveryo.com`.
- `api.driveryo.com`: NestJS backend REST API & WebSocket server.
- `admin.driveryo.com`: Internal admin operations portal (restricted by IP/VPN & 2FA).

DNS records should point to Cloudflare / AWS Route 53 with SSL/TLS terminating via AWS Certificate Manager (ACM) or Cloudflare Edge.

---

## 2. Infrastructure Architecture
- **Web Frontend (`apps/website`)**: Vercel / AWS Amplify / ECS Fargate container.
- **Admin Console (`apps/admin`)**: Vercel (Protected) / AWS ECS Fargate container.
- **Backend API (`apps/backend`)**: AWS ECS Fargate / EKS cluster with horizontal autoscaling based on CPU/RAM and active WebSocket connections.
- **Database**: AWS Aurora PostgreSQL (Multi-AZ for high availability).
- **Cache**: AWS ElastiCache for Redis (Cluster mode enabled).
- **Document Store**: AWS S3 Bucket with SSE-KMS encryption and pre-signed URLs for KYC uploads.

---

## 3. CI/CD Pipeline
GitHub Actions or GitLab CI runs automated pipelines on every pull request:
1. Linting & Type checking (`pnpm lint`, `tsc --noEmit`).
2. Unit and integration tests.
3. Docker image build and push to AWS ECR.
4. Database migration run via `prisma migrate deploy`.
5. Rolling zero-downtime deployment to AWS ECS / EKS.
