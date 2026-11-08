import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('Connected to PostgreSQL Database via Prisma ORM');
    } catch (err) {
      this.logger.warn('Could not establish initial PostgreSQL connection: running in resilient/standalone fallback mode');
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
