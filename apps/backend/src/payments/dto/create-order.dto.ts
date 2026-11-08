import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, Min } from 'class-validator';

export class CreateOrderDto {
  @ApiProperty({
    example: 'bkg_1731000000000',
    description: 'Booking ID associated with the payment',
  })
  @IsNotEmpty()
  @IsString()
  bookingId: string;

  @ApiProperty({
    example: 649,
    description: 'Amount in INR (whole rupees or paisa depending on config, converted to paise internally)',
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  amount: number;
}
