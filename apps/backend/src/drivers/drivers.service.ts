import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { MatchingService } from '../matching/matching.service';

export interface DriverKYC {
  id: string;
  fullName: string;
  phone: string;
  drivingLicenseNumber: string;
  yearsExperience: number;
  transmissionCompetency: 'MANUAL' | 'AUTOMATIC' | 'BOTH';
  preferredZone: string;
  approvalStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  rejectionReason?: string;
  bankAccount: {
    beneficiaryName: string;
    accountNumber: string;
    ifscCode: string;
  };
  submittedAt: string;
}

@Injectable()
export class DriversService {
  private readonly logger = new Logger(DriversService.name);
  private driverApplications = new Map<string, DriverKYC>();

  constructor(private readonly matchingService: MatchingService) {
    // Seed initial pending application for Admin verification workflow
    const demoApp: DriverKYC = {
      id: 'drv_app_201',
      fullName: 'Prasad Rao',
      phone: '+919849099887',
      drivingLicenseNumber: 'TS0920190048291',
      yearsExperience: 4,
      transmissionCompetency: 'BOTH',
      preferredZone: 'Gachibowli / Financial District',
      approvalStatus: 'PENDING',
      bankAccount: {
        beneficiaryName: 'Prasad Rao',
        accountNumber: '5010023948291',
        ifscCode: 'HDFC0001234',
      },
      submittedAt: new Date().toISOString(),
    };
    this.driverApplications.set(demoApp.id, demoApp);
  }

  registerDriver(dto: any): DriverKYC {
    if (!dto.fullName || !dto.phone || !dto.drivingLicenseNumber) {
      throw new BadRequestException('Full name, phone, and Driving License number are mandatory.');
    }

    const id = 'drv_app_' + Date.now();
    const app: DriverKYC = {
      id,
      fullName: dto.fullName,
      phone: dto.phone,
      drivingLicenseNumber: dto.drivingLicenseNumber.toUpperCase(),
      yearsExperience: Number(dto.yearsExperience) || 2,
      transmissionCompetency: dto.transmissionCompetency || 'BOTH',
      preferredZone: dto.preferredZone || 'HITEC City',
      approvalStatus: 'PENDING',
      bankAccount: {
        beneficiaryName: dto.bankBeneficiaryName || dto.fullName,
        accountNumber: dto.bankAccountNumber || '00000000000',
        ifscCode: (dto.bankIfscCode || 'HDFC0000000').toUpperCase(),
      },
      submittedAt: new Date().toISOString(),
    };

    this.driverApplications.set(id, app);
    this.logger.log(`New Driver Partner application registered: ${app.fullName} (${app.drivingLicenseNumber})`);
    return app;
  }

  getPendingApplications(): DriverKYC[] {
    return Array.from(this.driverApplications.values()).filter((d) => d.approvalStatus === 'PENDING');
  }

  verifyDriver(id: string, approved: boolean, reasonNotes?: string): DriverKYC {
    const app = this.driverApplications.get(id);
    if (!app) {
      throw new BadRequestException(`Driver application ${id} not found.`);
    }

    app.approvalStatus = approved ? 'APPROVED' : 'REJECTED';
    app.rejectionReason = reasonNotes;

    this.logger.log(`Driver application ${id} marked ${app.approvalStatus}. Notes: ${reasonNotes || 'None'}`);
    return app;
  }

  getEarnings(driverId: string = 'drv_hyd_101') {
    return {
      driverId,
      todayTrips: 3,
      todayEarnings: 1420,
      weekEarnings: 8950,
      monthEarnings: 34500,
      currency: 'INR',
      pendingPayout: 2850,
      completedPayouts: 31650,
    };
  }
}
