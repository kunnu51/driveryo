import { Controller, Post, Body, Param } from '@nestjs/common';
import { TripsService } from './trips.service';
import { StartTripDto } from './dto/start-trip.dto';
import { CompleteTripDto } from './dto/complete-trip.dto';
import { RateTripDto } from './dto/rate-trip.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('trips')
@Controller('trips')
export class TripsController {
  constructor(private readonly tripsService: TripsService) {}

  @Post(':bookingId/arrive')
  @ApiOperation({ summary: 'Driver signals arrival at customer vehicle' })
  @ApiParam({ name: 'bookingId', description: 'Booking ID' })
  async driverArrive(@Param('bookingId') bookingId: string) {
    return this.tripsService.driverArrived(bookingId);
  }

  @Post(':bookingId/start')
  @ApiOperation({ summary: 'Driver inputs customer 4-digit OTP to start trip meter' })
  @ApiParam({ name: 'bookingId', description: 'Booking ID' })
  @ApiResponse({ status: 200, description: 'Trip officially started and meter active' })
  async startTrip(@Param('bookingId') bookingId: string, @Body() body: StartTripDto) {
    return this.tripsService.startTripWithOtp(bookingId, body.otp);
  }

  @Post(':bookingId/complete')
  @ApiOperation({ summary: 'Driver finishes trip; calculates final duration and fare' })
  @ApiParam({ name: 'bookingId', description: 'Booking ID' })
  @ApiResponse({ status: 200, description: 'Trip completed, receipt generated' })
  async completeTrip(@Param('bookingId') bookingId: string, @Body() body: CompleteTripDto) {
    return this.tripsService.completeTrip(bookingId, body.waitingMinutes || 0);
  }

  @Post(':bookingId/rate')
  @ApiOperation({ summary: 'Customer rates completed trip (1-5 stars)' })
  @ApiParam({ name: 'bookingId', description: 'Booking ID' })
  @ApiResponse({ status: 200, description: 'Rating recorded' })
  async rateTrip(@Param('bookingId') bookingId: string, @Body() body: RateTripDto) {
    return this.tripsService.rateTrip(bookingId, body.rating, body.reviewText);
  }
}
