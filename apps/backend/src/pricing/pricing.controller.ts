import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { PricingService } from './pricing.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('pricing')
@Controller('pricing')
export class PricingController {
  constructor(private readonly pricingService: PricingService) {}

  @Post('estimate')
  @ApiOperation({ summary: 'Calculate accurate fare estimate based on Hyderabad rate card' })
  async getEstimate(@Body() body: any) {
    return this.pricingService.calculateEstimate(body);
  }

  @Get('rules/:cityId')
  @ApiOperation({ summary: 'Fetch active pricing rules and service packages for a city' })
  async getCityRules(@Param('cityId') cityId: string) {
    return this.pricingService.getRulesForCity(cityId);
  }
}
