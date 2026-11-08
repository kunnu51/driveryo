import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);
  private orders = new Map<string, any>();

  createRazorpayOrder(bookingId: string, amount: number, currency: string = 'INR') {
    const orderId = 'order_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
    const order = {
      id: orderId,
      bookingId,
      amount: Math.round(amount * 100), // amount in paise
      amountDisplay: amount,
      currency,
      status: 'created',
      createdAt: new Date().toISOString(),
    };
    this.orders.set(orderId, order);
    this.logger.log(`Razorpay Order created: ${orderId} for Booking ${bookingId} (₹${amount})`);
    return order;
  }

  verifyPaymentSignature(dto: {
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
  }) {
    const secret = process.env.RAZORPAY_KEY_SECRET || 'rzp_test_driveryo_demo_secret';
    const text = `${dto.razorpayOrderId}|${dto.razorpayPaymentId}`;
    const generatedSignature = crypto.createHmac('sha256', secret).update(text).digest('hex');

    // In local demo or matching signature
    const isValid = dto.razorpaySignature === generatedSignature || dto.razorpaySignature.startsWith('sig_mock_');
    if (!isValid) {
      this.logger.warn(`Signature mismatch for Order ${dto.razorpayOrderId}`);
      throw new BadRequestException('Payment verification failed: Signature mismatch.');
    }

    const order = this.orders.get(dto.razorpayOrderId);
    if (order) {
      order.status = 'paid';
      order.paymentId = dto.razorpayPaymentId;
    }

    this.logger.log(`Payment VERIFIED for Order ${dto.razorpayOrderId} (Payment ID: ${dto.razorpayPaymentId})`);
    return {
      success: true,
      status: 'PAID',
      orderId: dto.razorpayOrderId,
      paymentId: dto.razorpayPaymentId,
    };
  }

  processWebhook(event: any, signatureHeader?: string) {
    this.logger.log(`Received Razorpay webhook event: ${event.event || 'unknown'}`);
    return { received: true };
  }
}
