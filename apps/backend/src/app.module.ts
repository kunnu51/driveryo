import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './prisma/prisma.service';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { PricingService } from './pricing/pricing.service';
import { PricingController } from './pricing/pricing.controller';
import { BookingsService } from './bookings/bookings.service';
import { BookingsController } from './bookings/bookings.controller';
import { MatchingService } from './matching/matching.service';
import { TripsService } from './trips/trips.service';
import { TripsController } from './trips/trips.controller';
import { DriversService } from './drivers/drivers.service';
import { DriversController } from './drivers/drivers.controller';
import { PaymentsService } from './payments/payments.service';
import { PaymentsController } from './payments/payments.controller';
import { AdminService } from './admin/admin.service';
import { AdminController } from './admin/admin.controller';
import { NotificationsService } from './notifications/notifications.service';
import { NotificationsController } from './notifications/notifications.controller';
import { EventsGateway } from './gateways/events.gateway';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
  ],
  controllers: [
    AuthController,
    PricingController,
    BookingsController,
    TripsController,
    DriversController,
    PaymentsController,
    AdminController,
    NotificationsController,
  ],
  providers: [
    PrismaService,
    AuthService,
    PricingService,
    BookingsService,
    MatchingService,
    TripsService,
    DriversService,
    PaymentsService,
    AdminService,
    NotificationsService,
    EventsGateway,
  ],
  exports: [PrismaService, MatchingService, PricingService, NotificationsService],
})
export class AppModule {}
