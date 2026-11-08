// @driveryo/validation
// Input validation routines and fare calculation logic for Driveryo

const { DEFAULT_PRICING_RULES, GST_RATE_PERCENT } = require('../../shared-config');

/**
 * Validates 10-digit Indian mobile number (with optional +91 prefix)
 */
function validateIndianPhone(phone) {
  if (!phone || typeof phone !== 'string') return { valid: false, error: 'Phone number is required' };
  const cleaned = phone.replace(/[\s\-\(\)]/g, '').replace(/^\+91/, '');
  const isValid = /^[6-9]\d{9}$/.test(cleaned);
  return {
    valid: isValid,
    cleaned: isValid ? `+91${cleaned}` : cleaned,
    error: isValid ? null : 'Please enter a valid 10-digit Indian mobile number'
  };
}

/**
 * Validates Indian Car Registration Number (e.g. TS09FA1234 or AP28AB1122)
 */
function validateVehicleRegNumber(regNo) {
  if (!regNo || typeof regNo !== 'string') return { valid: false, error: 'Registration number is required' };
  const cleaned = regNo.toUpperCase().replace(/[\s\-]/g, '');
  const isValid = /^[A-Z]{2}[0-9]{1,2}[A-Z]{0,3}[0-9]{4}$/.test(cleaned);
  return {
    valid: isValid,
    cleaned,
    error: isValid ? null : 'Enter a valid Indian vehicle number (e.g. TS09FA1234)'
  };
}

/**
 * Validates Indian Driving License format
 */
function validateDrivingLicense(dlNo) {
  if (!dlNo || typeof dlNo !== 'string') return { valid: false, error: 'Driving License number is required' };
  const cleaned = dlNo.toUpperCase().replace(/[\s\-]/g, '');
  const isValid = /^[A-Z]{2}[0-9]{2}[0-9A-Z]{7,12}$/.test(cleaned);
  return {
    valid: isValid,
    cleaned,
    error: isValid ? null : 'Enter a valid Indian Driving License number (e.g. TS0920210001234)'
  };
}

/**
 * Calculates fare estimate using real backend pricing rules
 */
function calculateFareEstimate({
  serviceCategory = 'INSTANT',
  durationHours = 2,
  scheduledStartTime = new Date().toISOString(),
  promoDiscount = 0
}) {
  const rule = DEFAULT_PRICING_RULES[serviceCategory] || DEFAULT_PRICING_RULES.INSTANT;
  const hours = Math.max(1, parseFloat(durationHours) || 2);

  const baseFare = rule.baseFare;
  const includedHours = rule.includedHours;
  const extraHours = Math.max(0, hours - includedHours);
  const extraHoursFare = Math.round(extraHours * rule.hourlyRate);

  // Check if trip falls in night surcharge window (22:00 to 06:00)
  const tripDate = new Date(scheduledStartTime);
  const startHour = tripDate.getHours();
  const isNightTrip = startHour >= 22 || startHour < 6;
  const nightSurcharge = isNightTrip ? Math.round((baseFare + extraHoursFare) * (rule.nightSurchargePct / 100)) : 0;

  const subtotalBeforeDiscount = baseFare + extraHoursFare + nightSurcharge;
  const discount = Math.min(subtotalBeforeDiscount, Math.max(0, parseFloat(promoDiscount) || 0));
  const taxableAmount = subtotalBeforeDiscount - discount;
  const gstAmount = Math.round(taxableAmount * (GST_RATE_PERCENT / 100));
  const totalEstimatedFare = taxableAmount + gstAmount;

  return {
    serviceCategory,
    durationHours: hours,
    baseFare,
    includedHours,
    extraHours,
    extraHoursFare,
    nightSurcharge,
    isNightTrip,
    subtotal: subtotalBeforeDiscount,
    discount,
    taxableAmount,
    gstAmount,
    totalEstimatedFare,
    currency: 'INR'
  };
}

module.exports = {
  validateIndianPhone,
  validateVehicleRegNumber,
  validateDrivingLicense,
  calculateFareEstimate
};
