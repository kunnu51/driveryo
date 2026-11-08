import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, Min, Max, IsOptional, IsString, MaxLength } from 'class-validator';

export class RateTripDto {
  @ApiProperty({
    example: 5,
    description: 'Rating stars given to driver (1 to 5)',
    minimum: 1,
    maximum: 5,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiProperty({
    example: 'Exceptional driving skills, navigated Hyderabad peak traffic smoothly and safely!',
    description: 'Customer review text comments',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  reviewText?: string;
}
