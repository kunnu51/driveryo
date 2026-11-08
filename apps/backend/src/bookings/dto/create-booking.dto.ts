import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsNumber, IsEnum } from 'class-validator';

export enum ServiceCategoryDto {
  INSTANT = 'INSTANT',
  SCHEDULED = 'SCHEDULED',
  HOURLY = 'HOURLY',
  DAILY = 'DAILY',
  MONTHLY = 'MONTHLY',
  OUTSTATION = 'OUTSTATION',
  CORPORATE = 'CORPORATE',
}

export enum TransmissionTypeDto {
  MANUAL = 'MANUAL',
  AUTOMATIC = 'AUTOMATIC',
  BOTH = 'BOTH',
}

export enum VehicleCategoryDto {
  HATCHBACK = 'HATCHBACK',
  SEDAN = 'SEDAN',
  SUV = 'SUV',
  LUXURY = 'LUXURY',
  EV = 'EV',
}

export class CreateBookingDto {
  @ApiProperty({ example: '+919876543210', description: 'Customer contact phone number' })
  @IsNotEmpty()
  @IsString()
  customerPhone: string;

  @ApiProperty({ example: 'HITEC City / Cyber Towers, Hyderabad', description: 'Pickup location in Hyderabad' })
  @IsNotEmpty()
  @IsString()
  pickupLocation: string;

  @ApiProperty({ example: 'Rajiv Gandhi International Airport (RGIA), Shamshabad', required: false })
  @IsOptional()
  @IsString()
  destinationLocation?: string;

  @ApiProperty({ enum: ServiceCategoryDto, default: ServiceCategoryDto.INSTANT })
  @IsNotEmpty()
  @IsEnum(ServiceCategoryDto)
  serviceCategory: ServiceCategoryDto;

  @ApiProperty({ example: 2, default: 2, description: 'Duration in hours' })
  @IsOptional()
  @IsNumber()
  durationHours?: number;

  @ApiProperty({ enum: TransmissionTypeDto, default: TransmissionTypeDto.MANUAL })
  @IsNotEmpty()
  @IsEnum(TransmissionTypeDto)
  vehicleTransmission: TransmissionTypeDto;

  @ApiProperty({ enum: VehicleCategoryDto, default: VehicleCategoryDto.SEDAN })
  @IsNotEmpty()
  @IsEnum(VehicleCategoryDto)
  vehicleCategory: VehicleCategoryDto;

  @ApiProperty({ example: 'TS09FA1234', required: false, description: 'Vehicle registration number' })
  @IsOptional()
  @IsString()
  vehicleRegistration?: string;

  @ApiProperty({ example: 'FIRSTTRIP', required: false, description: 'Promotional discount coupon' })
  @IsOptional()
  @IsString()
  promoCode?: string;

  @ApiProperty({ example: '2026-11-08T10:00:00Z', required: false, description: 'Scheduled start ISO timestamp' })
  @IsOptional()
  @IsString()
  scheduledStartTime?: string;
}
