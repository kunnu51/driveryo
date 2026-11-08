import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';

export class StartTripDto {
  @ApiProperty({
    example: '4829',
    description: '4-digit OTP provided by customer to driver at vehicle start',
  })
  @IsNotEmpty()
  @IsString()
  @Length(4, 4)
  @Matches(/^\d{4}$/, { message: 'OTP must be exactly 4 numeric digits' })
  otp: string;
}
