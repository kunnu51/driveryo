import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNumber, Min, IsString } from 'class-validator';

export class CompleteTripDto {
  @ApiProperty({
    example: 15,
    description: 'Additional waiting time in minutes during trip',
    required: false,
    default: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  waitingMinutes?: number;

  @ApiProperty({
    example: 'Trip concluded at Hyderabad RGIA Terminal 1',
    description: 'Driver trip completion notes',
    required: false,
  })
  @IsOptional()
  @IsString()
  notes?: string;
}
