import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches, IsOptional } from 'class-validator';

export class RequestOtpDto {
  @ApiProperty({ example: '+919876543210', description: '10-digit Indian mobile number with optional +91' })
  @IsNotEmpty()
  @IsString()
  @Matches(/^(\+91)?[6-9]\d{9}$/, { message: 'Invalid Indian mobile number format.' })
  phone: string;
}

export class VerifyOtpDto {
  @ApiProperty({ example: '+919876543210', description: 'Phone number' })
  @IsNotEmpty()
  @IsString()
  phone: string;

  @ApiProperty({ example: '5555', description: '4 or 6-digit SMS OTP code' })
  @IsNotEmpty()
  @IsString()
  otp: string;

  @ApiProperty({ example: 'CUSTOMER', enum: ['CUSTOMER', 'DRIVER'], required: false })
  @IsOptional()
  @IsString()
  role?: string;
}

export class AdminLoginDto {
  @ApiProperty({ example: 'admin@driveryo.com', description: 'Admin registered email' })
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiProperty({ example: 'DriveryoAdmin2026!', description: 'Admin password' })
  @IsNotEmpty()
  @IsString()
  password: string;
}
