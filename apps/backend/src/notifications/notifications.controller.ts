import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('notifications')
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get user notifications log' })
  async getNotifications(@Param('userId') userId: string) {
    return this.notificationsService.getUserNotifications(userId);
  }

  @Post('send-test')
  @ApiOperation({ summary: 'Trigger a test push notification / SMS' })
  async sendTest(
    @Body() body: { title: string; message: string; phone?: string; fcmToken?: string },
  ) {
    await this.notificationsService.sendPushNotification(
      body.fcmToken || 'demo_token',
      body.title,
      body.message,
    );
    if (body.phone) {
      await this.notificationsService.sendSMS(body.phone, 'TEST_TEMPLATE', { msg: body.message });
    }
    return { success: true, message: 'Notification dispatched.' };
  }
}
