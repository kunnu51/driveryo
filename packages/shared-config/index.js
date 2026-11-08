// @driveryo/shared-config
// Core configuration, Hyderabad geo constants, pricing standards & brand guidelines

const BRAND = {
  name: 'DRIVERYO',
  tagline: 'Your Car. Your Journey. Our Driver.',
  domain: 'https://driveryo.com',
  supportEmail: 'support@driveryo.com',
  supportPhone: '+91 40 4899 5500',
  colors: {
    primaryNavy: '#101D35',
    primaryBlue: '#246BFD',
    secondaryBlue: '#EAF1FF',
    white: '#FFFFFF',
    background: '#F5F7FB',
    successGreen: '#19B887',
    textDark: '#26364F',
    textMuted: '#6B7A99',
    warning: '#F59E0B',
    danger: '#EF4444'
  }
};

const HYDERABAD_CONFIG = {
  cityId: 'hyd-telangana-01',
  cityName: 'Hyderabad',
  state: 'Telangana',
  country: 'India',
  center: {
    latitude: 17.385044,
    longitude: 78.486671
  },
  popularHubs: [
    { name: 'HITEC City / Cyber Towers', lat: 17.4504, lng: 78.3808 },
    { name: 'Gachibowli Financial District', lat: 17.4401, lng: 78.3489 },
    { name: 'Jubilee Hills Check Post', lat: 17.4319, lng: 78.4073 },
    { name: 'Banjara Hills Road No 1', lat: 17.4168, lng: 78.4382 },
    { name: 'Rajiv Gandhi International Airport (RGIA)', lat: 17.2403, lng: 78.4294 },
    { name: 'Secunderabad Railway Station', lat: 17.4399, lng: 78.5017 },
    { name: 'Madhapur Metro Station', lat: 17.4483, lng: 78.3915 },
    { name: 'Kondapur Botanical Garden Road', lat: 17.4616, lng: 78.3614 },
    { name: 'Begumpet Airport Road', lat: 17.4447, lng: 78.4664 }
  ]
};

const DEFAULT_PRICING_RULES = {
  INSTANT: {
    baseFare: 349, // First 2 hours
    includedHours: 2,
    hourlyRate: 149, // Extra hour
    waitingRatePerMin: 2.0,
    nightSurchargePct: 25, // 10 PM - 6 AM
    cancellationFee: 99,
    driverCommissionPct: 20
  },
  SCHEDULED: {
    baseFare: 399, // First 2 hours
    includedHours: 2,
    hourlyRate: 149,
    waitingRatePerMin: 2.0,
    nightSurchargePct: 25,
    cancellationFee: 99,
    driverCommissionPct: 20
  },
  HOURLY: {
    baseFare: 599, // First 4 hours
    includedHours: 4,
    hourlyRate: 139,
    waitingRatePerMin: 2.0,
    nightSurchargePct: 25,
    cancellationFee: 149,
    driverCommissionPct: 20
  },
  DAILY: {
    baseFare: 1199, // 8 hours package
    includedHours: 8,
    hourlyRate: 129,
    waitingRatePerMin: 2.0,
    nightSurchargePct: 25,
    cancellationFee: 199,
    driverCommissionPct: 20
  },
  MONTHLY: {
    baseFare: 24999, // 26 working days (8 hours/day)
    includedHours: 208,
    hourlyRate: 120,
    waitingRatePerMin: 2.0,
    nightSurchargePct: 20,
    cancellationFee: 1000,
    driverCommissionPct: 15
  },
  OUTSTATION: {
    baseFare: 1899, // 12 hours outstation base
    includedHours: 12,
    hourlyRate: 159,
    nightSurchargePct: 30, // Driver night allowance included
    cancellationFee: 299,
    driverCommissionPct: 20
  },
  CORPORATE: {
    baseFare: 1299, // Corporate custom 9 hours
    includedHours: 9,
    hourlyRate: 130,
    nightSurchargePct: 20,
    cancellationFee: 150,
    driverCommissionPct: 18
  }
};

const GST_RATE_PERCENT = 18.0;

module.exports = {
  BRAND,
  HYDERABAD_CONFIG,
  DEFAULT_PRICING_RULES,
  GST_RATE_PERCENT
};
