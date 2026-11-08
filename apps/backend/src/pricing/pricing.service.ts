import { Injectable } from '@nestjs/common';

@Injectable()
export class PricingService {
  private readonly rateCards = {
    INSTANT: { baseFare: 349, includedHours: 2, hourlyRate: 149, nightPct: 25, cancellation: 99 },
    SCHEDULED: { baseFare: 399, includedHours: 2, hourlyRate: 149, nightPct: 25, cancellation: 99 },
    DAILY: { baseFare: 1199, includedHours: 8, hourlyRate: 129, nightPct: 25, cancellation: 199 },
    OUTSTATION: { baseFare: 1899, includedHours: 12, hourlyRate: 159, nightPct: 30, cancellation: 299 },
    MONTHLY: { baseFare: 24999, includedHours: 208, hourlyRate: 120, nightPct: 20, cancellation: 1000 },
    CORPORATE: { baseFare: 1299, includedHours: 9, hourlyRate: 130, nightPct: 20, cancellation: 150 },
  };

  getRulesForCity(cityId: string = 'hyd-telangana-01') {
    return {
      cityId,
      cityName: 'Hyderabad',
      currency: 'INR',
      gstPercentage: 18.0,
      rateCards: this.rateCards,
    };
  }

  calculateEstimate(params: {
    serviceCategory?: string;
    durationHours?: number;
    scheduledStartTime?: string;
    promoCode?: string;
  }) {
    const srv = (params.serviceCategory || 'INSTANT').toUpperCase();
    const rule = this.rateCards[srv] || this.rateCards.INSTANT;
    const dur = Math.max(rule.includedHours, Number(params.durationHours) || rule.includedHours);

    const baseFare = rule.baseFare;
    const extraHours = Math.max(0, dur - rule.includedHours);
    const extraHoursFare = extraHours * rule.hourlyRate;

    // Check night window (22:00 to 06:00)
    let isNight = false;
    if (params.scheduledStartTime) {
      const d = new Date(params.scheduledStartTime);
      const h = isNaN(d.getHours()) ? 12 : d.getHours();
      isNight = h >= 22 || h < 6;
    }

    const nightSurcharge = isNight ? Math.round((baseFare + extraHoursFare) * (rule.nightPct / 100)) : 0;

    let discount = 0;
    if (params.promoCode && (params.promoCode.toUpperCase() === 'FIRSTTRIP' || params.promoCode.toUpperCase() === 'HYD100')) {
      discount = 100;
    }

    const subtotal = Math.max(0, baseFare + extraHoursFare + nightSurcharge - discount);
    const gst = Math.round(subtotal * 0.18);
    const total = subtotal + gst;

    return {
      serviceCategory: srv,
      durationHours: dur,
      baseFare,
      includedHours: rule.includedHours,
      extraHours,
      extraHoursFare,
      nightSurcharge,
      isNight,
      discount,
      subtotal,
      gst,
      total,
      currency: 'INR',
    };
  }
}
