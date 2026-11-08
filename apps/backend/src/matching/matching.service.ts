import { Injectable, Logger } from '@nestjs/common';

export interface CandidateDriver {
  id: string;
  fullName: string;
  phone: string;
  rating: number;
  totalTrips: number;
  latitude: number;
  longitude: number;
  distanceKm: number;
  transmission: 'MANUAL' | 'AUTOMATIC' | 'BOTH';
  approvalStatus: 'APPROVED';
  isOnline: boolean;
  isBusy: boolean;
}

@Injectable()
export class MatchingService {
  private readonly logger = new Logger(MatchingService.name);

  // Active Hyderabad simulated driver fleet for real matching
  private activeFleet: CandidateDriver[] = [
    {
      id: 'drv_hyd_101',
      fullName: 'Ramesh Reddy',
      phone: '+919848011223',
      rating: 4.9,
      totalTrips: 342,
      latitude: 17.4485,
      longitude: 78.3812, // HITEC City / Cyber Towers
      distanceKm: 0.8,
      transmission: 'BOTH',
      approvalStatus: 'APPROVED',
      isOnline: true,
      isBusy: false,
    },
    {
      id: 'drv_hyd_102',
      fullName: 'Mohammed Khaleel',
      phone: '+919848022334',
      rating: 4.8,
      totalTrips: 215,
      latitude: 17.4398,
      longitude: 78.3510, // Gachibowli
      distanceKm: 1.4,
      transmission: 'BOTH',
      approvalStatus: 'APPROVED',
      isOnline: true,
      isBusy: false,
    },
    {
      id: 'drv_hyd_103',
      fullName: 'Suresh Kumar',
      phone: '+919848033445',
      rating: 4.95,
      totalTrips: 580,
      latitude: 17.4320,
      longitude: 78.4080, // Jubilee Hills
      distanceKm: 2.1,
      transmission: 'MANUAL',
      approvalStatus: 'APPROVED',
      isOnline: true,
      isBusy: false,
    },
    {
      id: 'drv_hyd_104',
      fullName: 'Venkatesh Babu',
      phone: '+919848044556',
      rating: 4.75,
      totalTrips: 180,
      latitude: 17.4170,
      longitude: 78.4385, // Banjara Hills
      distanceKm: 2.8,
      transmission: 'BOTH',
      approvalStatus: 'APPROVED',
      isOnline: true,
      isBusy: false,
    },
    {
      id: 'drv_hyd_105',
      fullName: 'Narsing Rao',
      phone: '+919848055667',
      rating: 4.85,
      totalTrips: 420,
      latitude: 17.2410,
      longitude: 78.4290, // RGIA Airport Zone
      distanceKm: 3.5,
      transmission: 'BOTH',
      approvalStatus: 'APPROVED',
      isOnline: true,
      isBusy: false,
    },
  ];

  /**
   * Discovers nearest eligible drivers filtered by approval status, availability, and transmission capability
   */
  findEligibleDrivers(params: {
    transmissionRequired?: 'MANUAL' | 'AUTOMATIC';
    maxRadiusKm?: number;
  }): CandidateDriver[] {
    const { transmissionRequired = 'MANUAL', maxRadiusKm = 10 } = params;

    return this.activeFleet
      .filter((driver) => {
        if (!driver.isOnline || driver.isBusy || driver.approvalStatus !== 'APPROVED') {
          return false;
        }
        if (transmissionRequired === 'AUTOMATIC' && driver.transmission !== 'AUTOMATIC' && driver.transmission !== 'BOTH') {
          return false;
        }
        return driver.distanceKm <= maxRadiusKm;
      })
      .sort((a, b) => a.distanceKm - b.distanceKm);
  }

  assignBestDriver(transmissionRequired: 'MANUAL' | 'AUTOMATIC' = 'MANUAL'): CandidateDriver | null {
    const candidates = this.findEligibleDrivers({ transmissionRequired });
    if (candidates.length === 0) {
      this.logger.warn('No available eligible drivers found in radius');
      return null;
    }
    const chosen = candidates[0];
    chosen.isBusy = true;
    this.logger.log(`Driver ${chosen.fullName} assigned to booking`);
    return chosen;
  }

  releaseDriver(driverId: string) {
    const driver = this.activeFleet.find((d) => d.id === driverId);
    if (driver) {
      driver.isBusy = false;
      this.logger.log(`Driver ${driver.fullName} released to available pool`);
    }
  }

  getAllFleet(): CandidateDriver[] {
    return this.activeFleet;
  }
}
