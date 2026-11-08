import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, Min, Max } from 'class-validator';

export class UpdateLocationDto {
  @ApiProperty({ example: 17.4435, description: 'Current latitude (Hyderabad: ~17.38 to 17.50)' })
  @IsNotEmpty()
  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude: number;

  @ApiProperty({ example: 78.3772, description: 'Current longitude (Hyderabad: ~78.30 to 78.60)' })
  @IsNotEmpty()
  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude: number;

  @ApiProperty({ example: 180, description: 'Direction heading in degrees (0 to 360)', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(360)
  bearing?: number;

  @ApiProperty({ example: 35.5, description: 'Current speed in km/h', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  speedKmh?: number;
}
