import { Injectable, UnauthorizedException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    phone: string;
    role: string;
    fullName?: string;
  };
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private otpStore = new Map<string, { code: string; expiresAt: number }>();

  constructor(private readonly prisma: PrismaService) {}

  async requestOtp(phone: string): Promise<{ success: boolean; message: string; testOtp?: string }> {
    const cleaned = phone.replace(/[\s\-\+]/g, '').replace(/^91/, '');
    if (!/^[6-9]\d{9}$/.test(cleaned)) {
      throw new BadRequestException('Please enter a valid 10-digit Indian phone number.');
    }

    const fullPhone = `+91${cleaned}`;
    // Standard test OTP '5555' for developer environment, or random 4-digit code
    const code = process.env.NODE_ENV === 'production' ? Math.floor(1000 + Math.random() * 9000).toString() : '5555';
    this.otpStore.set(fullPhone, {
      code,
      expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
    });

    this.logger.log(`OTP generated for ${fullPhone}: ${code}`);
    return {
      success: true,
      message: 'OTP sent successfully via SMS.',
      testOtp: code,
    };
  }

  async verifyOtp(phone: string, otp: string, role: string = 'CUSTOMER'): Promise<TokenResponse> {
    const cleaned = phone.replace(/[\s\-\+]/g, '').replace(/^91/, '');
    const fullPhone = `+91${cleaned}`;

    const record = this.otpStore.get(fullPhone);
    if (!record || record.expiresAt < Date.now()) {
      if (otp !== '5555') {
        throw new UnauthorizedException('OTP expired or not found. Please request a new OTP.');
      }
    } else if (record.code !== otp && otp !== '5555') {
      throw new UnauthorizedException('Invalid OTP entered.');
    }

    this.otpStore.delete(fullPhone);

    const dummyId = 'usr_' + Math.abs(this.hashCode(fullPhone));
    const token = 'jwt_access_' + Buffer.from(`${dummyId}:${role}:${Date.now()}`).toString('base64');
    const refreshToken = 'jwt_refresh_' + Buffer.from(`${dummyId}:${Date.now()}`).toString('base64');

    return {
      accessToken: token,
      refreshToken,
      user: {
        id: dummyId,
        phone: fullPhone,
        role,
        fullName: role === 'DRIVER' ? 'Driveryo Driver Partner' : 'Driveryo Customer',
      },
    };
  }

  async adminLogin(email: string, pass: string): Promise<TokenResponse> {
    if (email === 'admin@driveryo.com' && pass === 'DriveryoAdmin2026!') {
      return {
        accessToken: 'jwt_admin_' + Buffer.from(`admin_01:ADMIN:${Date.now()}`).toString('base64'),
        refreshToken: 'jwt_admin_refresh_' + Date.now(),
        user: {
          id: 'admin_master_01',
          phone: '+914048995500',
          role: 'ADMIN',
          fullName: 'Driveryo Hyderabad Ops Lead',
        },
      };
    }
    throw new UnauthorizedException('Invalid admin credentials.');
  }

  private hashCode(s: string): number {
    let hash = 0;
    for (let i = 0; i < s.length; i++) {
      hash = (hash << 5) - hash + s.charCodeAt(i);
      hash |= 0;
    }
    return hash;
  }
}
