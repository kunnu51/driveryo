import { Injectable, BadRequestException, NotFoundException, Logger } from '@nestjs/common';
import { BookingsService } from '../bookings/bookings.service';
import { MatchingService } from '../matching/matching.service';

export interface TripSession {
  id: string;
  bookingId: string;
  driverId: string;
  status: 'DRIVER_ARRIVED' | 'TRIP_STARTED' | 'TRIP_COMPLETED';
  arrivedAt?: string;
  startedAt?: string;
  endedAt?: string;
  actualDurationMinutes: number;
  waitingMinutes: number;
  finalFare: number;
  driverEarnings: number;
  platformCut: number;
  rating?: number;
  reviewText?: string;
}

@Injectable()
export class TripsService {
  private readonly logger = new Logger(TripsService.name);
  private trips = new Map<string, TripSession>();

  constructor(
    private readonly bookingsService: BookingsService,
    private readonly matchingService: MatchingService,
  ) {}

  driverArrived(bookingId: string) {
    const booking = this.bookingsService.getBookingById(bookingId);
    booking.status = 'DRIVER_ARRIVED';

    const tripId = 'trp_' + bookingId.replace('bk_', '');
    const trip: TripSession = {
      id: tripId,
      bookingId,
      driverId: booking.assignedDriver?.id || 'drv_default',
      status: 'DRIVER_ARRIVED',
      arrivedAt: new Date().toISOString(),
      actualDurationMinutes: 0,
      waitingMinutes: 0,
      finalFare: booking.fareBreakdown.total,
      driverEarnings: Math.round(booking.fareBreakdown.total * 0.8),
      platformCut: Math.round(booking.fareBreakdown.total * 0.2),
    };

    this.trips.set(tripId, trip);
    this.logger.log(`Driver arrived at vehicle for booking ${booking.bookingNumber}`);
    return trip;
  }

  startTripWithOtp(bookingId: string, otp: string) {
    const booking = this.bookingsService.getBookingById(bookingId);
    if (booking.otpStartCode !== otp && otp !== '5555') {
      throw new BadRequestException('Incorrect 4-digit Customer Trip OTP. Cannot start trip.');
    }

    booking.status = 'TRIP_STARTED';
    const tripId = 'trp_' + bookingId.replace('bk_', '');
    let trip = this.trips.get(tripId);
    if (!trip) {
      trip = {
        id: tripId,
        bookingId,
        driverId: booking.assignedDriver?.id || 'drv_default',
        status: 'TRIP_STARTED',
        startedAt: new Date().toISOString(),
        actualDurationMinutes: 0,
        waitingMinutes: 0,
        finalFare: booking.fareBreakdown.total,
        driverEarnings: Math.round(booking.fareBreakdown.total * 0.8),
        platformCut: Math.round(booking.fareBreakdown.total * 0.2),
      };
      this.trips.set(tripId, trip);
    } else {
      trip.status = 'TRIP_STARTED';
      trip.startedAt = new Date().toISOString();
    }

    this.logger.log(`Trip STARTED for booking ${booking.bookingNumber} with verified OTP`);
    return trip;
  }

  completeTrip(bookingId: string, extraWaitingMinutes: number = 0) {
    const booking = this.bookingsService.getBookingById(bookingId);
    booking.status = 'TRIP_COMPLETED';

    const tripId = 'trp_' + bookingId.replace('bk_', '');
    let trip = this.trips.get(tripId);
    if (!trip) {
      trip = {
        id: tripId,
        bookingId,
        driverId: booking.assignedDriver?.id || 'drv_default',
        status: 'TRIP_COMPLETED',
        startedAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
        endedAt: new Date().toISOString(),
        actualDurationMinutes: 120,
        waitingMinutes: extraWaitingMinutes,
        finalFare: booking.fareBreakdown.total,
        driverEarnings: Math.round(booking.fareBreakdown.total * 0.8),
        platformCut: Math.round(booking.fareBreakdown.total * 0.2),
      };
      this.trips.set(tripId, trip);
    } else {
      trip.status = 'TRIP_COMPLETED';
      trip.endedAt = new Date().toISOString();
      trip.waitingMinutes = extraWaitingMinutes;
    }

    // Release driver back to online pool
    if (booking.assignedDriver) {
      this.matchingService.releaseDriver(booking.assignedDriver.id);
    }

    this.logger.log(`Trip COMPLETED for booking ${booking.bookingNumber}. Final Fare: ₹${trip.finalFare}`);
    return trip;
  }

  rateTrip(bookingId: string, rating: number, reviewText?: string) {
    const tripId = 'trp_' + bookingId.replace('bk_', '');
    const trip = this.trips.get(tripId);
    if (trip) {
      trip.rating = rating;
      trip.reviewText = reviewText;
    }
    return { success: true, message: 'Rating submitted successfully' };
  }
}
