import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('request-otp')
  @ApiOperation({ summary: 'Request SMS OTP for customer or driver authentication' })
  async requestOtp(@Body() body: { phone: string }) {
    return this.authService.requestOtp(body.phone);
  }

  @Post('verify-otp')
  @ApiOperation({ summary: 'Verify OTP and issue JWT access & refresh tokens' })
  async verifyOtp(@Body() body: { phone: string; otp: string; role?: string }) {
    return this.authService.verifyOtp(body.phone, body.otp, body.role);
  }

  @Post('admin-login')
  @ApiOperation({ summary: 'Admin Portal credentials authentication' })
  async adminLogin(@Body() body: { email: string; password: string }) {
    return this.authService.adminLogin(body.email, body.password);
  }

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  async getMe() {
    return {
      authenticated: true,
      service: 'DRIVERYO Mobility API',
      city: 'Hyderabad',
      version: '1.0.0',
    };
  }
}
