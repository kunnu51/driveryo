import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const logger = new Logger('DriveryoBootstrap');
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  app.setGlobalPrefix('api/v1');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Swagger OpenAPI 3.0 Documentation
  const config = new DocumentBuilder()
    .setTitle('DRIVERYO API Engine')
    .setDescription('On-Demand Driver Booking Ecosystem for Customer-Owned Vehicles (Hyderabad)')
    .setVersion('1.0.0')
    .addBearerAuth()
    .addTag('auth', 'Authentication and Token Rotation')
    .addTag('bookings', 'Customer Booking Lifecycle and Dispatch')
    .addTag('drivers', 'Driver Partner KYC, Telemetry & Earnings')
    .addTag('trips', 'Trip OTP verification, Metronome & Completion')
    .addTag('pricing', 'Dynamic Fare Rules & Estimates')
    .addTag('payments', 'Razorpay Webhooks & Settlement')
    .addTag('admin', 'Operations Console & Driver Approvals')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 4000;
  await app.listen(port);
  logger.log(`🚀 DRIVERYO REST & WebSocket API running on port ${port} [/api/v1]`);
  logger.log(`📑 Swagger Documentation available at http://localhost:${port}/api/docs`);
}

bootstrap();
