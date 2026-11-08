import { Injectable, Logger } from '@nestjs/common';

export interface NotificationPayload {
  userId: string;
  title: string;
  message: string;
  channel: 'SMS' | 'PUSH' | 'EMAIL' | 'IN_APP';
  metaJson?: any;
}

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);
  private notifications: NotificationPayload[] = [];

  async sendSMS(phone: string, template: string, params: Record<string, string>) {
    this.logger.log(`[SMS-MSG91] Sending template '${template}' to ${phone} with params: ${JSON.stringify(params)}`);
    return { success: true, messageId: 'msg_' + Date.now(), phone };
  }

  async sendPushNotification(fcmToken: string, title: string, body: string, data?: any) {
    this.logger.log(`[FCM-Push] Notification dispatched: '${title}' -> ${body}`);
    this.notifications.push({
      userId: data?.userId || 'usr_demo',
      title,
      message: body,
      channel: 'PUSH',
      metaJson: data,
    });
    return { success: true, multicastId: 'fcm_' + Date.now() };
  }

  async dispatchBookingStatusNotification(bookingNumber: string, status: string, phone: string) {
    let title = 'Booking Update';
    let body = `Your booking ${bookingNumber} status is now ${status}.`;

    if (status === 'ASSIGNED') {
      title = 'Chauffeur Assigned!';
      body = `A verified driver has accepted your booking ${bookingNumber} and is en route.`;
    } else if (status === 'DRIVER_ARRIVED') {
      title = 'Driver Arrived at Car';
      body = `Your chauffeur has arrived at your parked car. Share your Trip Start OTP to begin.`;
    } else if (status === 'TRIP_STARTED') {
      title = 'Trip Started';
      body = `Trip meter active. Have a safe and comfortable ride with Driveryo.`;
    } else if (status === 'TRIP_COMPLETED') {
      title = 'Trip Completed';
      body = `Trip ${bookingNumber} completed. Digital receipt generated. Thank you for riding!`;
    }

    await this.sendPushNotification('fcm_token_device', title, body, { bookingNumber, status });
    await this.sendSMS(phone, 'STATUS_UPDATE', { bookingNumber, status });
    return { success: true };
  }

  getUserNotifications(userId: string) {
    return this.notifications.filter((n) => n.userId === userId || n.userId === 'usr_demo');
  }
}
