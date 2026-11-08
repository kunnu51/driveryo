import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { DriversService } from './drivers.service';
import { RegisterDriverDto } from './dto/register-driver.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('drivers')
@Controller('driver')
export class DriversController {
  constructor(private readonly driversService: DriversService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new driver partner application' })
  @ApiResponse({ status: 201, description: 'Driver registration submitted for KYC verification' })
  async registerDriver(@Body() body: RegisterDriverDto) {
    return this.driversService.registerDriver(body);
  }

  @Get('earnings')
  @ApiOperation({ summary: 'Retrieve driver earnings & payout ledger' })
  @ApiResponse({ status: 200, description: 'Summary of earnings, 80/20 split, and payout status' })
  async getEarnings() {
    return this.driversService.getEarnings();
  }

  @Post('availability/toggle')
  @ApiOperation({ summary: 'Toggle online / offline availability' })
  @ApiBody({ schema: { properties: { isOnline: { type: 'boolean', example: true } }, required: ['isOnline'] } })
  async toggleAvailability(@Body() body: { isOnline: boolean }) {
    return {
      success: true,
      isOnline: body.isOnline,
      message: body.isOnline ? 'You are now online to receive bookings.' : 'You are now offline.',
    };
  }

  @Post('location')
  @ApiOperation({ summary: 'Broadcast current GPS telemetry' })
  @ApiResponse({ status: 200, description: 'Location telemetry acknowledged' })
  async updateLocation(@Body() body: UpdateLocationDto) {
    return { success: true, timestamp: new Date().toISOString() };
  }
}
