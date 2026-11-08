import React, { useState, useEffect } from 'react';

const HYDERABAD_HUBS = [
  'HITEC City / Cyber Towers, Hyderabad',
  'Gachibowli Financial District, Hyderabad',
  'Jubilee Hills Road No. 36, Hyderabad',
  'Banjara Hills Road No. 1, Hyderabad',
  'Rajiv Gandhi International Airport (RGIA), Shamshabad',
  'Madhapur Metro Station, Hyderabad',
  'Kondapur Botanical Gardens, Hyderabad',
  'Secunderabad Railway Station',
  'Begumpet Airport Road, Hyderabad',
  'Kukatpally Housing Board (KPHB), Hyderabad'
];

export const BookingWidget: React.FC = () => {
  const [serviceType, setServiceType] = useState<'INSTANT' | 'SCHEDULED' | 'DAILY' | 'MONTHLY' | 'OUTSTATION'>('INSTANT');
  const [pickup, setPickup] = useState('HITEC City / Cyber Towers, Hyderabad');
  const [destination, setDestination] = useState('Rajiv Gandhi International Airport (RGIA), Shamshabad');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('19:00');
  const [duration, setDuration] = useState(2);
  const [transmission, setTransmission] = useState<'MANUAL' | 'AUTOMATIC'>('MANUAL');
  const [vehicleCategory, setVehicleCategory] = useState<'HATCHBACK' | 'SEDAN' | 'SUV' | 'LUXURY'>('SEDAN');
  const [phone, setPhone] = useState('');
  const [promoCode, setPromoCode] = useState('');
  
  // Real-time calculated fare
  const [fareEstimate, setFareEstimate] = useState<any>(null);
  const [bookingSuccess, setBookingSuccess] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Re-calculate real fare whenever inputs change
  useEffect(() => {
    calculateFare();
  }, [serviceType, duration, time, promoCode]);

  const calculateFare = () => {
    // Backend standard pricing model
    let baseFare = 349;
    let includedHours = 2;
    let hourlyRate = 149;

    if (serviceType === 'SCHEDULED') {
      baseFare = 399;
      includedHours = 2;
      hourlyRate = 149;
    } else if (serviceType === 'DAILY') {
      baseFare = 1199;
      includedHours = 8;
      hourlyRate = 129;
    } else if (serviceType === 'MONTHLY') {
      baseFare = 24999;
      includedHours = 208;
      hourlyRate = 120;
    } else if (serviceType === 'OUTSTATION') {
      baseFare = 1899;
      includedHours = 12;
      hourlyRate = 159;
    }

    const dur = Math.max(includedHours, Number(duration));
    const extraHours = Math.max(0, dur - includedHours);
    const extraHoursFare = extraHours * hourlyRate;

    // Night surcharge if between 22:00 and 06:00
    const hourNum = parseInt(time.split(':')[0], 10) || 12;
    const isNight = hourNum >= 22 || hourNum < 6;
    const nightSurcharge = isNight ? Math.round((baseFare + extraHoursFare) * 0.25) : 0;

    let discount = 0;
    if (promoCode.toUpperCase() === 'FIRSTTRIP' || promoCode.toUpperCase() === 'HYD100') {
      discount = 100;
    }

    const subtotal = baseFare + extraHoursFare + nightSurcharge - discount;
    const gst = Math.round(subtotal * 0.18);
    const total = subtotal + gst;

    setFareEstimate({
      baseFare,
      includedHours,
      extraHours,
      extraHoursFare,
      nightSurcharge,
      isNight,
      discount,
      subtotal,
      gst,
      total,
      currency: 'INR'
    });
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!pickup.trim()) {
      setErrorMessage('Please enter or select a pickup location in Hyderabad.');
      return;
    }

    const cleanPhone = phone.replace(/[\s\-\+]/g, '').replace(/^91/, '');
    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      setErrorMessage('Please enter a valid 10-digit Indian mobile number (e.g., 9876543210).');
      return;
    }

    setIsSubmitting(true);

    // Call backend API / local simulation endpoint
    setTimeout(() => {
      setIsSubmitting(false);
      setBookingSuccess({
        bookingId: 'DRV-' + Math.floor(100000 + Math.random() * 900000),
        otp: Math.floor(1000 + Math.random() * 9000),
        status: 'SEARCHING_NEARBY_DRIVER',
        pickup,
        destination,
        vehicleCategory,
        transmission,
        totalFare: fareEstimate.total
      });
    }, 900);
  };

  return (
    <div id="book" className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 border border-gray-100 max-w-2xl mx-auto text-[#26364F]">
      <div className="flex items-center justify-between mb-6 border-b pb-4">
        <div>
          <h3 className="text-xl font-bold text-[#101D35]">Book a Professional Driver</h3>
          <p className="text-xs text-gray-500">For your personal car • Hyderabad Zone</p>
        </div>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-[#19B887] border border-emerald-200">
          <span className="w-2 h-2 rounded-full bg-[#19B887] animate-pulse"></span>
          Drivers Active Now
        </span>
      </div>

      {bookingSuccess ? (
        <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-6 text-center space-y-4">
          <div className="w-16 h-16 bg-[#19B887] text-white rounded-full flex items-center justify-center mx-auto text-2xl font-bold shadow-lg shadow-emerald-500/20">
            ✓
          </div>
          <h4 className="text-xl font-bold text-[#101D35]">Driver Booking Initiated!</h4>
          <p className="text-sm text-gray-600">
            Booking ID: <strong className="text-blue-600">{bookingSuccess.bookingId}</strong>
          </p>
          <div className="bg-white p-4 rounded-xl border border-blue-100 text-left text-xs space-y-2">
            <p><strong>Pickup:</strong> {bookingSuccess.pickup}</p>
            <p><strong>Destination:</strong> {bookingSuccess.destination}</p>
            <p><strong>Car:</strong> {bookingSuccess.vehicleCategory} ({bookingSuccess.transmission})</p>
            <p><strong>Estimated Fare:</strong> ₹{bookingSuccess.totalFare} (incl. GST)</p>
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 font-semibold text-center mt-2">
              Trip Start OTP: <span className="text-lg text-amber-900 tracking-widest">{bookingSuccess.otp}</span>
              <p className="text-[10px] font-normal text-amber-700 mt-0.5">Share with your driver only upon arrival at vehicle.</p>
            </div>
          </div>
          <button
            onClick={() => setBookingSuccess(null)}
            className="w-full py-3 bg-[#246BFD] text-white font-bold rounded-xl hover:bg-blue-600 transition-colors"
          >
            Make Another Booking
          </button>
        </div>
      ) : (
        <form onSubmit={handleBookingSubmit} className="space-y-5">
          {/* Service Tabs */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
              Select Driver Service Type
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {[
                { id: 'INSTANT', label: 'Instant', time: '10-15 mins' },
                { id: 'SCHEDULED', label: 'Scheduled', time: 'Book ahead' },
                { id: 'DAILY', label: 'Daily (8 hrs)', time: 'City tour/errands' },
                { id: 'OUTSTATION', label: 'Outstation', time: 'Getaway trips' },
                { id: 'MONTHLY', label: 'Monthly', time: 'Commute pass' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setServiceType(tab.id as any);
                    if (tab.id === 'DAILY') setDuration(8);
                    else if (tab.id === 'OUTSTATION') setDuration(12);
                    else if (tab.id === 'MONTHLY') setDuration(208);
                    else setDuration(2);
                  }}
                  className={`p-2.5 rounded-xl text-left border transition-all ${
                    serviceType === tab.id
                      ? 'border-[#246BFD] bg-[#EAF1FF] text-[#246BFD] font-bold shadow-sm'
                      : 'border-gray-200 bg-gray-50 text-gray-600 hover:bg-white'
                  }`}
                >
                  <div className="text-xs font-semibold">{tab.label}</div>
                  <div className="text-[10px] text-gray-500 font-normal">{tab.time}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Locations */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                Pickup Location (Hyderabad)
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={pickup}
                  onChange={(e) => setPickup(e.target.value)}
                  placeholder="e.g. HITEC City, Hyderabad"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#246BFD] focus:bg-white transition-all"
                  required
                />
              </div>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {HYDERABAD_HUBS.slice(0, 4).map((hub) => (
                  <button
                    key={hub}
                    type="button"
                    onClick={() => setPickup(hub)}
                    className="text-[10px] bg-gray-100 hover:bg-blue-50 hover:text-blue-600 px-2.5 py-1 rounded-md text-gray-600 transition-colors"
                  >
                    + {hub.split(',')[0]}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                Destination (Optional for hourly packages)
              </label>
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="e.g. RGIA Airport, Banjara Hills"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#246BFD] focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Date, Time & Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                Booking Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#246BFD]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                Booking Time
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#246BFD]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                Estimated Duration
              </label>
              <select
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#246BFD]"
              >
                <option value={2}>2 Hours (Standard)</option>
                <option value={4}>4 Hours (Half Day)</option>
                <option value={8}>8 Hours (Full Day)</option>
                <option value={12}>12 Hours (Outstation)</option>
                <option value={208}>1 Month (Daily Commute)</option>
              </select>
            </div>
          </div>

          {/* Vehicle Specifics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                Car Transmission
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(['MANUAL', 'AUTOMATIC'] as const).map((trans) => (
                  <button
                    key={trans}
                    type="button"
                    onClick={() => setTransmission(trans)}
                    className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all ${
                      transmission === trans
                        ? 'border-[#246BFD] bg-[#246BFD] text-white shadow-sm'
                        : 'border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {trans === 'MANUAL' ? '⚙️ Manual' : '🚗 Automatic'}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                Vehicle Category
              </label>
              <select
                value={vehicleCategory}
                onChange={(e) => setVehicleCategory(e.target.value as any)}
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#246BFD]"
              >
                <option value="HATCHBACK">Hatchback (Swift, i10, Tiago)</option>
                <option value="SEDAN">Sedan (City, Verna, Ciaz)</option>
                <option value="SUV">SUV / MUV (Creta, Innova, Scorpio)</option>
                <option value="LUXURY">Luxury (BMW, Mercedes, Audi)</option>
              </select>
            </div>
          </div>

          {/* Contact and Promo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                Customer Mobile Number
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-gray-200 bg-gray-100 text-gray-600 text-sm">
                  +91
                </span>
                <input
                  type="tel"
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="9876543210"
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-r-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#246BFD]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                Promo Code (Optional)
              </label>
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                placeholder="Try FIRSTTRIP"
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#246BFD]"
              />
            </div>
          </div>

          {/* Pricing Breakdown Summary */}
          {fareEstimate && (
            <div className="bg-[#F5F7FB] border border-blue-100 rounded-2xl p-4 space-y-2 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>Base Fare ({fareEstimate.includedHours} hrs included):</span>
                <span className="font-semibold text-gray-800">₹{fareEstimate.baseFare}</span>
              </div>
              {fareEstimate.extraHours > 0 && (
                <div className="flex justify-between text-gray-600">
                  <span>Additional Duration ({fareEstimate.extraHours} extra hrs):</span>
                  <span className="font-semibold text-gray-800">₹{fareEstimate.extraHoursFare}</span>
                </div>
              )}
              {fareEstimate.nightSurcharge > 0 && (
                <div className="flex justify-between text-amber-700">
                  <span>Night Surcharge (10 PM – 6 AM, 25%):</span>
                  <span className="font-semibold">₹{fareEstimate.nightSurcharge}</span>
                </div>
              )}
              {fareEstimate.discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Promo Discount Applied:</span>
                  <span>-₹{fareEstimate.discount}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-500">
                <span>GST (18% Govt. Tax):</span>
                <span>₹{fareEstimate.gst}</span>
              </div>
              <div className="pt-2 border-t border-gray-200 flex justify-between items-center text-sm">
                <div>
                  <span className="font-bold text-[#101D35]">Estimated Fare:</span>
                  <span className="text-[10px] text-gray-500 block">No hidden fees</span>
                </div>
                <div className="text-xl font-black text-[#246BFD]">
                  ₹{fareEstimate.total}
                </div>
              </div>
            </div>
          )}

          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-medium">
              ⚠️ {errorMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-[#246BFD] hover:bg-blue-600 active:scale-[0.99] text-white font-bold rounded-2xl shadow-xl shadow-blue-500/25 transition-all text-base flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Connecting Nearby Verified Driver...
              </>
            ) : (
              'Confirm & Book Professional Driver'
            )}
          </button>
        </form>
      )}
    </div>
  );
};
