import { Controller, Post, Get, Body, Param, Query } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { CancelBookingDto } from './dto/cancel-booking.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';

@ApiTags('bookings')
@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post('create')
  @ApiOperation({ summary: 'Create a new driver booking for customer-owned car' })
  @ApiResponse({ status: 201, description: 'Booking successfully initiated' })
  async createBooking(@Body() body: CreateBookingDto) {
    return this.bookingsService.createBooking(body);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get details of a specific booking' })
  @ApiParam({ name: 'id', description: 'Booking ID or Booking Number' })
  async getBooking(@Param('id') id: string) {
    return this.bookingsService.getBookingById(id);
  }

  @Get()
  @ApiOperation({ summary: 'List bookings with optional filters' })
  @ApiQuery({ name: 'status', required: false, description: 'Filter by booking status' })
  @ApiQuery({ name: 'phone', required: false, description: 'Filter by customer phone number' })
  async listBookings(@Query('status') status?: string, @Query('phone') phone?: string) {
    return this.bookingsService.listBookings({ status, customerPhone: phone });
  }

  @Post(':id/cancel')
  @ApiOperation({ summary: 'Cancel an assigned or requested booking' })
  @ApiParam({ name: 'id', description: 'Booking ID' })
  async cancelBooking(@Param('id') id: string, @Body() body: CancelBookingDto) {
    return this.bookingsService.cancelBooking(id, body.reason || 'Customer request');
  }
}
