import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsNumber,
  IsEnum,
  Matches,
  Min,
  IsArray,
} from 'class-validator';

export enum DriverTransmissionDto {
  MANUAL = 'MANUAL',
  AUTOMATIC = 'AUTOMATIC',
  BOTH = 'BOTH',
}

export class RegisterDriverDto {
  @ApiProperty({ example: 'Srinivas Rao', description: 'Driver full name' })
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @ApiProperty({ example: '+919876543210', description: 'Indian mobile phone number' })
  @IsNotEmpty()
  @IsString()
  @Matches(/^[6-9]\d{9}$/, { message: 'Must be a valid 10-digit Indian mobile number' })
  phone: string;

  @ApiProperty({ example: 'srinivas.rao@gmail.com', required: false })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiProperty({ example: 8, description: 'Years of professional driving experience' })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  experienceYears: number;

  @ApiProperty({
    enum: DriverTransmissionDto,
    default: DriverTransmissionDto.BOTH,
    description: 'Transmission capability (MANUAL, AUTOMATIC, BOTH)',
  })
  @IsNotEmpty()
  @IsEnum(DriverTransmissionDto)
  transmissionCapability: DriverTransmissionDto;

  @ApiProperty({ example: 'TS0920180012345', description: 'Indian Driving Licence Number' })
  @IsNotEmpty()
  @IsString()
  licenseNumber: string;

  @ApiProperty({ example: '2030-05-31', description: 'Driving Licence Expiry Date (YYYY-MM-DD)' })
  @IsNotEmpty()
  @IsString()
  licenseExpiry: string;

  @ApiProperty({ example: '123456789012', required: false, description: '12-digit Aadhaar number' })
  @IsOptional()
  @IsString()
  aadhaarNumber?: string;

  @ApiProperty({
    example: ['Gachibowli', 'HITEC City', 'Madhapur', 'Banjara Hills'],
    description: 'Preferred operating zones in Hyderabad',
    required: false,
    type: [String],
  })
  @IsOptional()
  @IsArray()
  preferredAreas?: string[];

  @ApiProperty({
    example: 'HDFC0001234',
    description: 'Bank IFSC Code for payouts',
    required: false,
  })
  @IsOptional()
  @IsString()
  bankIfsc?: string;

  @ApiProperty({
    example: '50100234567890',
    description: 'Bank Account Number for payouts',
    required: false,
  })
  @IsOptional()
  @IsString()
  bankAccountNumber?: string;
}
