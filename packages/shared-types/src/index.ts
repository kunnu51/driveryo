// @driveryo/shared-types
// Shared TypeScript contracts for Driveryo Platform

export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  DRIVER = 'DRIVER',
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN',
  OPERATOR = 'OPERATOR',
  FINANCE = 'FINANCE',
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
  BLOCKED = 'BLOCKED',
  PENDING_VERIFICATION = 'PENDING_VERIFICATION',
}

export enum DriverApprovalStatus {
  PENDING = 'PENDING',
  UNDER_REVIEW = 'UNDER_REVIEW',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  SUSPENDED = 'SUSPENDED',
}

export enum ServiceCategory {
  INSTANT = 'INSTANT',
  SCHEDULED = 'SCHEDULED',
  HOURLY = 'HOURLY',
  DAILY = 'DAILY',
  MONTHLY = 'MONTHLY',
  OUTSTATION = 'OUTSTATION',
  ROUND_TRIP = 'ROUND_TRIP',
  CORPORATE = 'CORPORATE',
}

export enum TransmissionType {
  MANUAL = 'MANUAL',
  AUTOMATIC = 'AUTOMATIC',
  BOTH = 'BOTH',
}

export enum VehicleCategory {
  HATCHBACK = 'HATCHBACK',
  SEDAN = 'SEDAN',
  SUV = 'SUV',
  LUXURY = 'LUXURY',
  EV = 'EV',
}

export enum BookingStatus {
  DRAFT = 'DRAFT',
  REQUESTED = 'REQUESTED',
  MATCHING = 'MATCHING',
  ASSIGNED = 'ASSIGNED',
  DRIVER_ARRIVING = 'DRIVER_ARRIVING',
  DRIVER_ARRIVED = 'DRIVER_ARRIVED',
  TRIP_STARTED = 'TRIP_STARTED',
  TRIP_COMPLETED = 'TRIP_COMPLETED',
  CANCELLED = 'CANCELLED',
  PAYMENT_PENDING = 'PAYMENT_PENDING',
  COMPLETED = 'COMPLETED',
}

export enum TripStatus {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  PAUSED = 'PAUSED',
  COMPLETED = 'COMPLETED',
  ABORTED = 'ABORTED',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  AUTHORIZED = 'AUTHORIZED',
  CAPTURED = 'CAPTURED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
  PARTIALLY_REFUNDED = 'PARTIALLY_REFUNDED',
}

export enum PaymentMethod {
  RAZORPAY_UPI = 'RAZORPAY_UPI',
  RAZORPAY_CARD = 'RAZORPAY_CARD',
  RAZORPAY_NETBANKING = 'RAZORPAY_NETBANKING',
  CORPORATE_CREDIT = 'CORPORATE_CREDIT',
  WALLET = 'WALLET',
  CASH = 'CASH',
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface LocationPoint extends Coordinates {
  addressString: string;
  placeId?: string;
  landmark?: string;
}

export interface VehicleDetails {
  id?: string;
  registrationNumber: string;
  make: string;
  model: string;
  color?: string;
  category: VehicleCategory;
  transmission: TransmissionType;
}

export interface DriverProfileSummary {
  id: string;
  fullName: string;
  avatarUrl?: string;
  phone: string;
  ratingAverage: number;
  totalTripsCompleted: number;
  transmissionSkill: TransmissionType;
  approvalStatus: DriverApprovalStatus;
  currentLocation?: Coordinates;
}

export interface FareBreakdown {
  baseFare: number;
  includedHours: number;
  extraHoursFare: number;
  nightSurcharge: number;
  waitingFare: number;
  subtotal: number;
  gstAmount: number;
  discount: number;
  totalEstimatedFare: number;
  currency: string;
}

export interface BookingEstimateRequest {
  cityId: string;
  serviceCategory: ServiceCategory;
  pickupLocation: LocationPoint;
  destinationLocation?: LocationPoint;
  scheduledStartTime: string;
  durationHours: number;
  transmission: TransmissionType;
  vehicleCategory: VehicleCategory;
  promoCode?: string;
}

export interface BookingCreationRequest extends BookingEstimateRequest {
  customerId: string;
  vehicleDetails: VehicleDetails;
  notes?: string;
  contactNumber: string;
}

export interface BookingDTO {
  id: string;
  bookingNumber: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  serviceCategory: ServiceCategory;
  status: BookingStatus;
  pickupLocation: LocationPoint;
  destinationLocation?: LocationPoint;
  scheduledStartTime: string;
  durationHours: number;
  vehicleDetails: VehicleDetails;
  otpStartCode: string;
  fareBreakdown: FareBreakdown;
  assignedDriver?: DriverProfileSummary;
  createdAt: string;
}
