import { Controller, Post, Body, Headers } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { VerifyPaymentDto } from './dto/verify-payment.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiHeader } from '@nestjs/swagger';

@ApiTags('payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('create-order')
  @ApiOperation({ summary: 'Create Razorpay Order for booking checkout' })
  @ApiResponse({ status: 201, description: 'Razorpay order created with order_id and key_id' })
  async createOrder(@Body() body: CreateOrderDto) {
    return this.paymentsService.createRazorpayOrder(body.bookingId, body.amount);
  }

  @Post('verify')
  @ApiOperation({ summary: 'Server-side verification of Razorpay payment signature' })
  @ApiResponse({ status: 200, description: 'Payment signature verified successfully' })
  async verifyPayment(@Body() body: VerifyPaymentDto) {
    return this.paymentsService.verifyPaymentSignature(body);
  }

  @Post('webhook')
  @ApiOperation({ summary: 'Handle incoming Razorpay webhooks' })
  @ApiHeader({ name: 'x-razorpay-signature', description: 'HMAC signature from Razorpay webhook' })
  @ApiResponse({ status: 200, description: 'Webhook received and processed' })
  async handleWebhook(@Body() body: any, @Headers('x-razorpay-signature') signature: string) {
    return this.paymentsService.processWebhook(body, signature);
  }
}
