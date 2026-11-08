import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PricingService } from '../pricing/pricing.service';
import { MatchingService, CandidateDriver } from '../matching/matching.service';

export interface BookingRecord {
  id: string;
  bookingNumber: string;
  customerId: string;
  customerPhone: string;
  serviceCategory: string;
  pickupLocation: string;
  destinationLocation?: string;
  scheduledStartTime: string;
  durationHours: number;
  vehicleTransmission: 'MANUAL' | 'AUTOMATIC';
  vehicleCategory: string;
  vehicleRegistration?: string;
  otpStartCode: string;
  status: string;
  fareBreakdown: any;
  assignedDriver?: CandidateDriver | null;
  cancellationReason?: string;
  createdAt: string;
}

@Injectable()
export class BookingsService {
  private readonly logger = new Logger(BookingsService.name);
  private bookings = new Map<string, BookingRecord>();

  constructor(
    private readonly pricingService: PricingService,
    private readonly matchingService: MatchingService,
  ) {
    // Seed initial demo booking in Hyderabad
    const demoBooking: BookingRecord = {
      id: 'bk_hyd_demo_01',
      bookingNumber: 'DRV-202611-1029',
      customerId: 'usr_cust_01',
      customerPhone: '+919876543210',
      serviceCategory: 'INSTANT',
      pickupLocation: 'HITEC City / Cyber Towers, Hyderabad',
      destinationLocation: 'Rajiv Gandhi International Airport (RGIA), Shamshabad',
      scheduledStartTime: new Date().toISOString(),
      durationHours: 2,
      vehicleTransmission: 'AUTOMATIC',
      vehicleCategory: 'SEDAN',
      vehicleRegistration: 'TS09FA1234',
      otpStartCode: '7821',
      status: 'ASSIGNED',
      fareBreakdown: this.pricingService.calculateEstimate({ serviceCategory: 'INSTANT', durationHours: 2 }),
      assignedDriver: this.matchingService.getAllFleet()[0],
      createdAt: new Date().toISOString(),
    };
    this.bookings.set(demoBooking.id, demoBooking);
  }

  createBooking(dto: {
    customerId?: string;
    customerPhone: string;
    serviceCategory: string;
    pickupLocation: string;
    destinationLocation?: string;
    scheduledStartTime?: string;
    durationHours?: number;
    vehicleTransmission?: 'MANUAL' | 'AUTOMATIC';
    vehicleCategory?: string;
    vehicleRegistration?: string;
    promoCode?: string;
  }): BookingRecord {
    if (!dto.pickupLocation) {
      throw new BadRequestException('Pickup location is required.');
    }

    const fare = this.pricingService.calculateEstimate({
      serviceCategory: dto.serviceCategory,
      durationHours: dto.durationHours,
      scheduledStartTime: dto.scheduledStartTime,
      promoCode: dto.promoCode,
    });

    const bookingId = 'bk_' + Date.now();
    const bookingNumber = 'DRV-' + new Date().getFullYear() + String(new Date().getMonth() + 1).padStart(2, '0') + '-' + Math.floor(1000 + Math.random() * 9000);
    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    // Match best driver
    const driver = this.matchingService.assignBestDriver(dto.vehicleTransmission || 'MANUAL');

    const booking: BookingRecord = {
      id: bookingId,
      bookingNumber,
      customerId: dto.customerId || 'cust_' + Math.floor(Math.random() * 1000),
      customerPhone: dto.customerPhone,
      serviceCategory: (dto.serviceCategory || 'INSTANT').toUpperCase(),
      pickupLocation: dto.pickupLocation,
      destinationLocation: dto.destinationLocation,
      scheduledStartTime: dto.scheduledStartTime || new Date().toISOString(),
      durationHours: dto.durationHours || 2,
      vehicleTransmission: dto.vehicleTransmission || 'MANUAL',
      vehicleCategory: dto.vehicleCategory || 'SEDAN',
      vehicleRegistration: dto.vehicleRegistration || 'TS09XX0000',
      otpStartCode: otp,
      status: driver ? 'ASSIGNED' : 'MATCHING',
      fareBreakdown: fare,
      assignedDriver: driver,
      createdAt: new Date().toISOString(),
    };

    this.bookings.set(bookingId, booking);
    this.logger.log(`Booking created: ${bookingNumber} | Driver: ${driver?.fullName || 'Searching'}`);
    return booking;
  }

  getBookingById(id: string): BookingRecord {
    const booking = this.bookings.get(id);
    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found.`);
    }
    return booking;
  }

  listBookings(filters?: { status?: string; customerPhone?: string }): BookingRecord[] {
    let list = Array.from(this.bookings.values());
    if (filters?.status) {
      list = list.filter((b) => b.status === filters.status);
    }
    if (filters?.customerPhone) {
      list = list.filter((b) => b.customerPhone.includes(filters.customerPhone!));
    }
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  cancelBooking(id: string, reason: string): BookingRecord {
    const booking = this.getBookingById(id);
    if (booking.status === 'TRIP_STARTED' || booking.status === 'TRIP_COMPLETED') {
      throw new BadRequestException('Cannot cancel an ongoing or completed trip.');
    }
    booking.status = 'CANCELLED';
    booking.cancellationReason = reason;

    if (booking.assignedDriver) {
      this.matchingService.releaseDriver(booking.assignedDriver.id);
    }

    this.logger.log(`Booking ${booking.bookingNumber} cancelled. Reason: ${reason}`);
    return booking;
  }
}
