# DRIVERYO Database Schema & Entity Relationship Documentation

## 1. Overview
The database layer for Driveryo is designed using **PostgreSQL 16** with **Prisma ORM**. It enforces full referential integrity, strict foreign key constraints, atomic status transitions, and geospatial indexing for real-time driver proximity matching in Hyderabad and future Indian expansion cities.

---

## 2. Entity Relationship Diagram (ERD)

```mermaid
erDiagram
    users ||--o| customer_profiles : has
    users ||--o| driver_profiles : has
    users ||--o| admin_users : has
    users ||--o{ notifications : receives
    users ||--o{ audit_logs : generates

    customer_profiles ||--o{ vehicles : registers
    customer_profiles ||--o{ addresses : saves
    customer_profiles ||--o{ bookings : places
    customer_profiles ||--o{ ratings : writes
    customer_profiles ||--o{ support_tickets : files
    customer_profiles ||--o{ subscriptions : subscribes

    driver_profiles ||--o{ driver_documents : submits
    driver_profiles ||--o| driver_availability : maintains
    driver_profiles ||--o{ driver_locations : reports
    driver_profiles ||--o{ booking_assignments : receives
    driver_profiles ||--o{ trips : executes
    driver_profiles ||--o{ commissions : earns
    driver_profiles ||--o{ payouts : collects

    cities ||--o{ driver_profiles : resides_in
    cities ||--o{ pricing_rules : defines
    cities ||--o{ bookings : originates_in

    service_types ||--o{ pricing_rules : sets_rates
    service_types ||--o{ bookings : specifies

    pricing_rules ||--o{ pricing_components : breaks_down

    bookings ||--o{ booking_locations : contains
    bookings ||--o{ booking_assignments : matches
    bookings ||--o| trips : triggers
    bookings ||--o| payments : bills
    bookings ||--o| ratings : evaluates
    bookings ||--o| corporate_bookings : tags

    trips ||--o{ trip_locations : tracks

    payments ||--o{ refunds : refunds
    payments ||--o| commissions : splits

    subscription_plans ||--o{ subscriptions : defines

    corporate_accounts ||--o{ corporate_bookings : authorizes

    roles ||--o{ role_permissions : grants
    permissions ||--o{ role_permissions : configures
    admin_users ||--o{ admin_user_roles : assigns
    roles ||--o{ admin_user_roles : binds
```

---

## 3. Core Relational Models

### 3.1 Users (`users`)
- Master user entity handling phone authentication, passwords (for admin/corporate), roles (`CUSTOMER`, `DRIVER`, `ADMIN`, `SUPER_ADMIN`), and account statuses (`ACTIVE`, `SUSPENDED`, `BLOCKED`).
- Uses unique phone numbers with Indian national standard formatting (`+91XXXXXXXXXX`).

### 3.2 Drivers & Documents (`driver_profiles`, `driver_documents`, `driver_availability`)
- Driver KYC compliance: Driving license (front/back), Aadhaar card, PAN card, Police verification certificate, Bank passbook.
- `approvalStatus`: Strict state machine (`PENDING` -> `UNDER_REVIEW` -> `APPROVED` | `REJECTED`). Unapproved drivers cannot go online or receive booking dispatch offers.
- `driver_availability`: Real-time latch for `isOnline`, `isBusy`, GPS coordinates (`currentLatitude`, `currentLongitude`), and heartbeat `lastPingAt`.

### 3.3 Bookings & Assignments (`bookings`, `booking_locations`, `booking_assignments`)
- Tracks booking number (e.g. `DRV-202611-8942`), customer, vehicle attributes (Make, Model, Transmission, Category), pickup, destination, scheduled start time, OTP code, status flow.
- `booking_assignments`: Offers dispatched to candidate drivers with timestamps and status (`OFFERED`, `ACCEPTED`, `REJECTED`, `TIMED_OUT`).

### 3.4 Trips & Telemetry (`trips`, `trip_locations`)
- Active trip state: `NOT_STARTED` -> `IN_PROGRESS` -> `COMPLETED`.
- Guarded by 4-digit Customer Trip OTP.
- High-frequency GPS breadcrumbs (`trip_locations`) recording timestamp, speed, latitude, and longitude for real-time customer tracking and dispute audit trails.

### 3.5 Pricing & Settlements (`pricing_rules`, `payments`, `commissions`, `payouts`)
- Flexible city-level and service-level rules: Base fare, included hours, extra hourly rate, waiting charge per minute, night surcharge window (e.g., 22:00 to 06:00), cancellation fees, GST 18%.
- Automatic platform commission split (e.g., 80% to driver partner, 20% Driveryo commission).
- Payout ledger tracking batched driver bank transfers via NEFT/IMPS/RazorpayX.
