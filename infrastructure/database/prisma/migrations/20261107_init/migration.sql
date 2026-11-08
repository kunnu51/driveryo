-- Driveryo Production Database Migration
-- Target: PostgreSQL 14+ / Supabase / AWS RDS
-- Date: 2026-11-07
-- Description: Complete schema for Driveryo on-demand chauffeur platform for customer-owned vehicles

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- -----------------------------------------------------------------------------
-- ENUM TYPES
-- -----------------------------------------------------------------------------

DO $$ BEGIN
    CREATE TYPE "UserRole" AS ENUM ('CUSTOMER', 'DRIVER', 'ADMIN', 'SUPER_ADMIN', 'OPERATOR', 'FINANCE');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED', 'BLOCKED', 'PENDING_VERIFICATION');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "DriverApprovalStatus" AS ENUM ('PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'SUSPENDED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "DocumentType" AS ENUM (
        'DRIVING_LICENSE_FRONT',
        'DRIVING_LICENSE_BACK',
        'AADHAAR_FRONT',
        'AADHAAR_BACK',
        'PAN_CARD',
        'PROFILE_PHOTO',
        'POLICE_VERIFICATION',
        'BANK_PASSBOOK_OR_CHEQUE'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "DocumentStatus" AS ENUM ('PENDING', 'VERIFIED', 'REJECTED', 'EXPIRED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "ServiceCategory" AS ENUM (
        'INSTANT',
        'SCHEDULED',
        'HOURLY',
        'DAILY',
        'MONTHLY',
        'OUTSTATION',
        'ROUND_TRIP',
        'CORPORATE'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "TransmissionType" AS ENUM ('MANUAL', 'AUTOMATIC', 'BOTH');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "VehicleCategory" AS ENUM ('HATCHBACK', 'SEDAN', 'SUV', 'LUXURY', 'EV');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "BookingStatus" AS ENUM (
        'DRAFT',
        'REQUESTED',
        'MATCHING',
        'ASSIGNED',
        'DRIVER_ARRIVING',
        'DRIVER_ARRIVED',
        'TRIP_STARTED',
        'TRIP_COMPLETED',
        'CANCELLED',
        'PAYMENT_PENDING',
        'COMPLETED'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "TripStatus" AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'PAUSED', 'COMPLETED', 'ABORTED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'AUTHORIZED', 'CAPTURED', 'FAILED', 'REFUNDED', 'PARTIALLY_REFUNDED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "PaymentMethod" AS ENUM ('RAZORPAY_UPI', 'RAZORPAY_CARD', 'RAZORPAY_NETBANKING', 'CORPORATE_CREDIT', 'WALLET', 'CASH');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "RefundStatus" AS ENUM ('INITIATED', 'PROCESSING', 'PROCESSED', 'FAILED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "PayoutStatus" AS ENUM ('PENDING', 'PROCESSING', 'SUCCESS', 'FAILED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "TicketStatus" AS ENUM ('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "TicketPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- -----------------------------------------------------------------------------
-- USERS & PROFILES
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS "users" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "phone" VARCHAR(20) NOT NULL UNIQUE,
    "email" VARCHAR(255) UNIQUE,
    "passwordHash" VARCHAR(255),
    "role" "UserRole" NOT NULL DEFAULT 'CUSTOMER',
    "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "isPhoneVerified" BOOLEAN NOT NULL DEFAULT false,
    "isEmailVerified" BOOLEAN NOT NULL DEFAULT false,
    "refreshTokenHash" VARCHAR(255),
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS "idx_users_phone" ON "users"("phone");
CREATE INDEX IF NOT EXISTS "idx_users_email" ON "users"("email");
CREATE INDEX IF NOT EXISTS "idx_users_role_status" ON "users"("role", "status");

CREATE TABLE IF NOT EXISTS "customer_profiles" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "userId" UUID NOT NULL UNIQUE REFERENCES "users"("id") ON DELETE CASCADE,
    "fullName" VARCHAR(255) NOT NULL,
    "avatarUrl" TEXT,
    "referralCode" VARCHAR(50) NOT NULL UNIQUE,
    "referredBy" VARCHAR(50),
    "emergencyContact" VARCHAR(255),
    "emergencyPhone" VARCHAR(20),
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "cities" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "name" VARCHAR(100) NOT NULL UNIQUE,
    "state" VARCHAR(100) NOT NULL DEFAULT 'Telangana',
    "country" VARCHAR(100) NOT NULL DEFAULT 'India',
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "driver_profiles" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "userId" UUID NOT NULL UNIQUE REFERENCES "users"("id") ON DELETE CASCADE,
    "fullName" VARCHAR(255) NOT NULL,
    "avatarUrl" TEXT,
    "dateOfBirth" DATE,
    "residentialAddress" TEXT,
    "cityId" UUID REFERENCES "cities"("id") ON DELETE SET NULL,
    "drivingExperienceYears" INTEGER NOT NULL DEFAULT 1,
    "transmissionSkill" "TransmissionType" NOT NULL DEFAULT 'BOTH',
    "approvalStatus" "DriverApprovalStatus" NOT NULL DEFAULT 'PENDING',
    "rejectionReason" TEXT,
    "ratingAverage" DOUBLE PRECISION NOT NULL DEFAULT 5.0,
    "totalRatingsCount" INTEGER NOT NULL DEFAULT 0,
    "totalTripsCompleted" INTEGER NOT NULL DEFAULT 0,
    "emergencyContactName" VARCHAR(255),
    "emergencyContactPhone" VARCHAR(20),
    "bankAccountNumber" VARCHAR(50),
    "bankIfscCode" VARCHAR(20),
    "bankBeneficiaryName" VARCHAR(255),
    "bankAccountVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "idx_driver_profiles_approval" ON "driver_profiles"("approvalStatus");
CREATE INDEX IF NOT EXISTS "idx_driver_profiles_rating" ON "driver_profiles"("ratingAverage");

CREATE TABLE IF NOT EXISTS "driver_documents" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "driverId" UUID NOT NULL REFERENCES "driver_profiles"("id") ON DELETE CASCADE,
    "documentType" "DocumentType" NOT NULL,
    "documentNumber" VARCHAR(100),
    "fileUrl" TEXT NOT NULL,
    "status" "DocumentStatus" NOT NULL DEFAULT 'PENDING',
    "rejectionNotes" TEXT,
    "expiresAt" TIMESTAMP WITH TIME ZONE,
    "verifiedAt" TIMESTAMP WITH TIME ZONE,
    "verifiedBy" VARCHAR(255),
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "uq_driver_document" UNIQUE ("driverId", "documentType")
);

CREATE INDEX IF NOT EXISTS "idx_driver_documents_status" ON "driver_documents"("status");

CREATE TABLE IF NOT EXISTS "driver_availability" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "driverId" UUID NOT NULL UNIQUE REFERENCES "driver_profiles"("id") ON DELETE CASCADE,
    "isOnline" BOOLEAN NOT NULL DEFAULT false,
    "isBusy" BOOLEAN NOT NULL DEFAULT false,
    "currentLatitude" DOUBLE PRECISION,
    "currentLongitude" DOUBLE PRECISION,
    "heading" DOUBLE PRECISION,
    "lastPingAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "idx_driver_availability_status" ON "driver_availability"("isOnline", "isBusy");

CREATE TABLE IF NOT EXISTS "driver_locations" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "driverId" UUID NOT NULL REFERENCES "driver_profiles"("id") ON DELETE CASCADE,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "bearing" DOUBLE PRECISION,
    "speedKmh" DOUBLE PRECISION,
    "accuracyMeters" DOUBLE PRECISION,
    "recordedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "idx_driver_locations_time" ON "driver_locations"("driverId", "recordedAt");

CREATE TABLE IF NOT EXISTS "service_types" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "category" "ServiceCategory" NOT NULL UNIQUE,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "vehicles" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "customerId" UUID NOT NULL REFERENCES "customer_profiles"("id") ON DELETE CASCADE,
    "registrationNumber" VARCHAR(50) NOT NULL,
    "make" VARCHAR(100) NOT NULL,
    "model" VARCHAR(100) NOT NULL,
    "color" VARCHAR(50),
    "category" "VehicleCategory" NOT NULL DEFAULT 'SEDAN',
    "transmission" "TransmissionType" NOT NULL DEFAULT 'MANUAL',
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "idx_vehicles_customer" ON "vehicles"("customerId");

CREATE TABLE IF NOT EXISTS "addresses" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "customerId" UUID NOT NULL REFERENCES "customer_profiles"("id") ON DELETE CASCADE,
    "label" VARCHAR(50) NOT NULL DEFAULT 'Home',
    "addressLine1" TEXT NOT NULL,
    "addressLine2" TEXT,
    "landmark" VARCHAR(255),
    "city" VARCHAR(100) NOT NULL DEFAULT 'Hyderabad',
    "postalCode" VARCHAR(20),
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "idx_addresses_customer" ON "addresses"("customerId");

CREATE TABLE IF NOT EXISTS "bookings" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "bookingNumber" VARCHAR(50) NOT NULL UNIQUE,
    "customerId" UUID NOT NULL REFERENCES "customer_profiles"("id"),
    "serviceTypeId" UUID NOT NULL REFERENCES "service_types"("id"),
    "cityId" UUID NOT NULL REFERENCES "cities"("id"),
    "vehicleId" UUID REFERENCES "vehicles"("id") ON DELETE SET NULL,
    "vehicleMakeModel" VARCHAR(255),
    "vehicleTransmission" "TransmissionType" NOT NULL DEFAULT 'MANUAL',
    "vehicleCategory" "VehicleCategory" NOT NULL DEFAULT 'SEDAN',
    "status" "BookingStatus" NOT NULL DEFAULT 'REQUESTED',
    "scheduledStartTime" TIMESTAMP WITH TIME ZONE NOT NULL,
    "estimatedDurationHours" DOUBLE PRECISION NOT NULL DEFAULT 2.0,
    "notes" TEXT,
    "otpStartCode" VARCHAR(6) NOT NULL,
    "estimatedFare" DOUBLE PRECISION NOT NULL,
    "finalFare" DOUBLE PRECISION,
    "cancellationReason" TEXT,
    "cancelledAt" TIMESTAMP WITH TIME ZONE,
    "cancelledBy" VARCHAR(255),
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "idx_bookings_customer" ON "bookings"("customerId");
CREATE INDEX IF NOT EXISTS "idx_bookings_status" ON "bookings"("status");
CREATE INDEX IF NOT EXISTS "idx_bookings_time" ON "bookings"("scheduledStartTime");

CREATE TABLE IF NOT EXISTS "booking_locations" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "bookingId" UUID NOT NULL REFERENCES "bookings"("id") ON DELETE CASCADE,
    "locationType" VARCHAR(20) NOT NULL DEFAULT 'PICKUP',
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "addressString" TEXT NOT NULL,
    "placeId" VARCHAR(255),
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "scheduledArriveTime" TIMESTAMP WITH TIME ZONE,
    "actualArriveTime" TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS "idx_booking_locations_booking" ON "booking_locations"("bookingId");

CREATE TABLE IF NOT EXISTS "booking_assignments" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "bookingId" UUID NOT NULL REFERENCES "bookings"("id") ON DELETE CASCADE,
    "driverId" UUID NOT NULL REFERENCES "driver_profiles"("id"),
    "status" VARCHAR(50) NOT NULL DEFAULT 'OFFERED',
    "offeredAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "respondedAt" TIMESTAMP WITH TIME ZONE,
    "assignedAt" TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS "idx_booking_assignments_booking" ON "booking_assignments"("bookingId");
CREATE INDEX IF NOT EXISTS "idx_booking_assignments_driver" ON "booking_assignments"("driverId", "status");

CREATE TABLE IF NOT EXISTS "trips" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "bookingId" UUID NOT NULL UNIQUE REFERENCES "bookings"("id"),
    "driverId" UUID NOT NULL REFERENCES "driver_profiles"("id"),
    "status" "TripStatus" NOT NULL DEFAULT 'NOT_STARTED',
    "otpVerifiedAt" TIMESTAMP WITH TIME ZONE,
    "startedAt" TIMESTAMP WITH TIME ZONE,
    "endedAt" TIMESTAMP WITH TIME ZONE,
    "actualDurationMinutes" INTEGER NOT NULL DEFAULT 0,
    "totalDistanceKm" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "waitingMinutes" INTEGER NOT NULL DEFAULT 0,
    "nightHours" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "idx_trips_driver" ON "trips"("driverId");

CREATE TABLE IF NOT EXISTS "trip_locations" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "tripId" UUID NOT NULL REFERENCES "trips"("id") ON DELETE CASCADE,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "speed" DOUBLE PRECISION,
    "timestamp" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "idx_trip_locations_trip" ON "trip_locations"("tripId", "timestamp");

-- -----------------------------------------------------------------------------
-- PRICING & PROMOTIONS
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS "pricing_rules" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "cityId" UUID NOT NULL REFERENCES "cities"("id"),
    "serviceTypeId" UUID NOT NULL REFERENCES "service_types"("id"),
    "baseFare" DOUBLE PRECISION NOT NULL,
    "includedHours" DOUBLE PRECISION NOT NULL,
    "includedKm" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "hourlyRate" DOUBLE PRECISION NOT NULL,
    "perKmRate" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "waitingRatePerMin" DOUBLE PRECISION NOT NULL DEFAULT 2.0,
    "nightSurchargePct" DOUBLE PRECISION NOT NULL DEFAULT 25.0,
    "nightStartHour" INTEGER NOT NULL DEFAULT 22,
    "nightEndHour" INTEGER NOT NULL DEFAULT 6,
    "cancellationFee" DOUBLE PRECISION NOT NULL DEFAULT 100.0,
    "gstPercentage" DOUBLE PRECISION NOT NULL DEFAULT 18.0,
    "driverCommissionPct" DOUBLE PRECISION NOT NULL DEFAULT 20.0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "uq_city_service_pricing" UNIQUE ("cityId", "serviceTypeId")
);

CREATE TABLE IF NOT EXISTS "pricing_components" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "pricingRuleId" UUID NOT NULL REFERENCES "pricing_rules"("id") ON DELETE CASCADE,
    "code" VARCHAR(50) NOT NULL,
    "description" VARCHAR(255) NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "isPercentage" BOOLEAN NOT NULL DEFAULT false
);

CREATE TABLE IF NOT EXISTS "promo_codes" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "code" VARCHAR(50) NOT NULL UNIQUE,
    "description" TEXT NOT NULL,
    "discountPct" DOUBLE PRECISION,
    "flatDiscount" DOUBLE PRECISION,
    "maxDiscount" DOUBLE PRECISION,
    "minFare" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "usageLimit" INTEGER NOT NULL DEFAULT 1000,
    "usageCount" INTEGER NOT NULL DEFAULT 0,
    "validFrom" TIMESTAMP WITH TIME ZONE NOT NULL,
    "validUntil" TIMESTAMP WITH TIME ZONE NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "promo_redemptions" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "promoCodeId" UUID NOT NULL REFERENCES "promo_codes"("id"),
    "customerId" UUID NOT NULL REFERENCES "customer_profiles"("id"),
    "bookingId" UUID,
    "discountApplied" DOUBLE PRECISION NOT NULL,
    "redeemedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "idx_promo_redemptions_customer" ON "promo_redemptions"("customerId");

-- -----------------------------------------------------------------------------
-- PAYMENTS, REFUNDS, COMMISSIONS & PAYOUTS
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS "payments" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "bookingId" UUID NOT NULL UNIQUE REFERENCES "bookings"("id"),
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" VARCHAR(10) NOT NULL DEFAULT 'INR',
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "method" "PaymentMethod" NOT NULL DEFAULT 'RAZORPAY_UPI',
    "razorpayOrderId" VARCHAR(100) UNIQUE,
    "razorpayPaymentId" VARCHAR(100) UNIQUE,
    "razorpaySignature" VARCHAR(255),
    "failureReason" TEXT,
    "paidAt" TIMESTAMP WITH TIME ZONE,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "idx_payments_order" ON "payments"("razorpayOrderId");
CREATE INDEX IF NOT EXISTS "idx_payments_status" ON "payments"("status");

CREATE TABLE IF NOT EXISTS "refunds" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "paymentId" UUID NOT NULL REFERENCES "payments"("id"),
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" VARCHAR(10) NOT NULL DEFAULT 'INR',
    "reason" TEXT NOT NULL,
    "status" "RefundStatus" NOT NULL DEFAULT 'INITIATED',
    "razorpayRefundId" VARCHAR(100) UNIQUE,
    "processedAt" TIMESTAMP WITH TIME ZONE,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "commissions" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "paymentId" UUID NOT NULL UNIQUE REFERENCES "payments"("id"),
    "driverId" UUID NOT NULL REFERENCES "driver_profiles"("id"),
    "grossFare" DOUBLE PRECISION NOT NULL,
    "platformCut" DOUBLE PRECISION NOT NULL,
    "driverEarnings" DOUBLE PRECISION NOT NULL,
    "gstAmount" DOUBLE PRECISION NOT NULL,
    "calculatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "idx_commissions_driver" ON "commissions"("driverId");

CREATE TABLE IF NOT EXISTS "payouts" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "driverId" UUID NOT NULL REFERENCES "driver_profiles"("id"),
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" VARCHAR(10) NOT NULL DEFAULT 'INR',
    "status" "PayoutStatus" NOT NULL DEFAULT 'PENDING',
    "bankReference" VARCHAR(100),
    "payoutBatchId" VARCHAR(100),
    "processedAt" TIMESTAMP WITH TIME ZONE,
    "failureReason" TEXT,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "idx_payouts_driver_status" ON "payouts"("driverId", "status");

-- -----------------------------------------------------------------------------
-- SUBSCRIPTIONS & CORPORATE
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS "subscription_plans" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "durationDays" INTEGER NOT NULL DEFAULT 30,
    "totalHours" INTEGER NOT NULL DEFAULT 60,
    "serviceCategory" "ServiceCategory" NOT NULL DEFAULT 'DAILY',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "subscriptions" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "customerId" UUID NOT NULL REFERENCES "customer_profiles"("id"),
    "planId" UUID NOT NULL REFERENCES "subscription_plans"("id"),
    "startDate" TIMESTAMP WITH TIME ZONE NOT NULL,
    "endDate" TIMESTAMP WITH TIME ZONE NOT NULL,
    "remainingHours" DOUBLE PRECISION NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "idx_subscriptions_customer" ON "subscriptions"("customerId");

CREATE TABLE IF NOT EXISTS "corporate_accounts" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "companyName" VARCHAR(255) NOT NULL,
    "gstin" VARCHAR(50) UNIQUE,
    "contactPerson" VARCHAR(255) NOT NULL,
    "contactEmail" VARCHAR(255) NOT NULL UNIQUE,
    "contactPhone" VARCHAR(50) NOT NULL,
    "billingAddress" TEXT NOT NULL,
    "creditLimit" DOUBLE PRECISION NOT NULL DEFAULT 50000.0,
    "currentOutstanding" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "corporate_bookings" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "corporateAccountId" UUID NOT NULL REFERENCES "corporate_accounts"("id"),
    "bookingId" UUID NOT NULL UNIQUE REFERENCES "bookings"("id"),
    "employeeName" VARCHAR(255) NOT NULL,
    "employeeEmail" VARCHAR(255) NOT NULL,
    "costCenter" VARCHAR(100),
    "approvedByManager" BOOLEAN NOT NULL DEFAULT true
);

-- -----------------------------------------------------------------------------
-- RATINGS, SUPPORT & NOTIFICATIONS
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS "ratings" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "bookingId" UUID NOT NULL UNIQUE REFERENCES "bookings"("id"),
    "customerId" UUID NOT NULL REFERENCES "customer_profiles"("id"),
    "driverId" UUID NOT NULL REFERENCES "driver_profiles"("id"),
    "stars" INTEGER NOT NULL,
    "reviewText" TEXT,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "idx_ratings_driver" ON "ratings"("driverId");

CREATE TABLE IF NOT EXISTS "support_tickets" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "ticketNumber" VARCHAR(50) NOT NULL UNIQUE,
    "customerId" UUID NOT NULL REFERENCES "customer_profiles"("id"),
    "bookingId" UUID,
    "subject" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "priority" "TicketPriority" NOT NULL DEFAULT 'MEDIUM',
    "status" "TicketStatus" NOT NULL DEFAULT 'OPEN',
    "resolution" TEXT,
    "closedAt" TIMESTAMP WITH TIME ZONE,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "idx_support_tickets_customer" ON "support_tickets"("customerId");
CREATE INDEX IF NOT EXISTS "idx_support_tickets_status" ON "support_tickets"("status");

CREATE TABLE IF NOT EXISTS "notifications" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "userId" UUID NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
    "title" VARCHAR(255) NOT NULL,
    "message" TEXT NOT NULL,
    "channel" VARCHAR(20) NOT NULL DEFAULT 'PUSH',
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "metaJson" JSONB,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "idx_notifications_user_read" ON "notifications"("userId", "isRead");

-- -----------------------------------------------------------------------------
-- ADMIN, RBAC & AUDIT LOGS
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS "admin_users" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "userId" UUID NOT NULL UNIQUE REFERENCES "users"("id") ON DELETE CASCADE,
    "displayName" VARCHAR(255) NOT NULL,
    "department" VARCHAR(100),
    "is2FAEnabled" BOOLEAN NOT NULL DEFAULT false,
    "lastLoginAt" TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS "roles" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "name" VARCHAR(100) NOT NULL UNIQUE,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "permissions" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "code" VARCHAR(100) NOT NULL UNIQUE,
    "module" VARCHAR(50) NOT NULL,
    "description" TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS "role_permissions" (
    "roleId" UUID NOT NULL REFERENCES "roles"("id") ON DELETE CASCADE,
    "permissionId" UUID NOT NULL REFERENCES "permissions"("id") ON DELETE CASCADE,
    PRIMARY KEY ("roleId", "permissionId")
);

CREATE TABLE IF NOT EXISTS "admin_user_roles" (
    "adminUserId" UUID NOT NULL REFERENCES "admin_users"("id") ON DELETE CASCADE,
    "roleId" UUID NOT NULL REFERENCES "roles"("id") ON DELETE CASCADE,
    PRIMARY KEY ("adminUserId", "roleId")
);

CREATE TABLE IF NOT EXISTS "audit_logs" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "userId" UUID REFERENCES "users"("id") ON DELETE SET NULL,
    "action" VARCHAR(100) NOT NULL,
    "entityType" VARCHAR(100) NOT NULL,
    "entityId" VARCHAR(100),
    "oldValues" JSONB,
    "newValues" JSONB,
    "ipAddress" VARCHAR(50),
    "userAgent" TEXT,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "idx_audit_logs_action" ON "audit_logs"("action");
CREATE INDEX IF NOT EXISTS "idx_audit_logs_entity" ON "audit_logs"("entityType", "entityId");
CREATE INDEX IF NOT EXISTS "idx_audit_logs_time" ON "audit_logs"("createdAt");
