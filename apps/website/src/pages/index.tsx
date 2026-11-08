import React from 'react';
import Head from 'next/head';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { BookingWidget } from '../components/BookingWidget';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F5F7FB] text-[#26364F] flex flex-col font-sans selection:bg-[#246BFD] selection:text-white">
      <Head>
        <title>DRIVERYO — Your Car. Your Journey. Our Driver | Hyderabad</title>
        <meta
          name="description"
          content="Book verified, professional chauffeurs on-demand to drive your own car in Hyderabad. Hourly, daily, monthly, and outstation trips."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main className="flex-grow">
        {/* HERO SECTION */}
        <section className="relative bg-[#101D35] text-white pt-16 pb-24 overflow-hidden">
          {/* Subtle geometric ambient backdrop */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#246BFD_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#246BFD]/20 rounded-full blur-3xl pointer-events-none" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Left Column: Headlines & Call to Actions */}
              <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-semibold tracking-wide">
                  <span className="w-2 h-2 rounded-full bg-[#19B887]"></span>
                  Now Live in Hyderabad (HITEC City • Gachibowli • Banjara Hills)
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15]">
                  Your Car. <br />
                  Your Journey. <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#246BFD] to-blue-400">
                    Our Driver.
                  </span>
                </h1>

                <p className="text-lg text-gray-300 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                  Book trusted professional drivers for your own car whenever you need one. Avoid stressful Hyderabad traffic, attend late parties safely, or enjoy weekend road trips in total peace.
                </p>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                  <a
                    href="#book"
                    className="w-full sm:w-auto px-8 py-4 bg-[#246BFD] text-white font-bold rounded-2xl shadow-xl shadow-blue-600/30 hover:bg-blue-600 transition-all text-center"
                  >
                    Book a Driver
                  </a>
                  <a
                    href="#driver-registration"
                    className="w-full sm:w-auto px-8 py-4 bg-white/10 text-white font-semibold rounded-2xl border border-white/20 hover:bg-white/20 transition-all text-center"
                  >
                    Become a Driver
                  </a>
                </div>

                {/* Trust Badges */}
                <div className="pt-8 border-t border-gray-800 grid grid-cols-3 gap-4 text-center lg:text-left">
                  <div>
                    <div className="text-2xl font-black text-white">100%</div>
                    <div className="text-xs text-gray-400">Police Verified</div>
                  </div>
                  <div>
                    <div className="text-2xl font-black text-white">4.9★</div>
                    <div className="text-xs text-gray-400">Driver Rating</div>
                  </div>
                  <div>
                    <div className="text-2xl font-black text-white">₹349</div>
                    <div className="text-xs text-gray-400">Starts At / 2 Hrs</div>
                  </div>
                </div>
              </div>

              {/* Right Column: Hero Booking Engine */}
              <div className="lg:col-span-6">
                <BookingWidget />
              </div>
            </div>
          </div>
        </section>

        {/* SERVICE CATEGORIES */}
        <section id="services" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-xs font-bold uppercase tracking-wider text-[#246BFD]">Specialized Chauffeur Solutions</span>
              <h2 className="text-3xl font-black text-[#101D35] mt-2">Services Built for Every Car Journey</h2>
              <p className="text-gray-500 mt-3 text-sm">
                From a quick 1-hour errand in HITEC City to a multi-day family holiday in Srisailam or Goa, our drivers operate your private manual or automatic car safely.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: 'Instant Driver',
                  tag: 'Most Popular',
                  desc: 'Need a driver on the spot? Get an experienced chauffeur arriving at your car within 10 to 15 minutes across Hyderabad.',
                  fare: '₹349 (First 2 hrs)',
                  icon: '⚡'
                },
                {
                  title: 'Scheduled Driver',
                  tag: 'Advance Booking',
                  desc: 'Plan ahead for airport pick-and-drop, family functions, dinner parties, or hospital appointments with zero stress.',
                  fare: '₹399 (First 2 hrs)',
                  icon: '📅'
                },
                {
                  title: 'Daily Driver (8 Hours)',
                  tag: 'Best Value',
                  desc: 'Full-day dedicated chauffeur for shopping, multiple city meetings, client visits, or continuous errands.',
                  fare: '₹1,199 (8 hrs included)',
                  icon: '🚗'
                },
                {
                  title: 'Monthly Subscription',
                  tag: 'Commuter Plan',
                  desc: 'A permanent professional chauffeur for your daily office commute. 26 working days with backup driver guarantee.',
                  fare: '₹24,999 / Month',
                  icon: '👔'
                },
                {
                  title: 'Outstation Road Trips',
                  tag: 'Long Distance',
                  desc: 'Travel to Tirupati, Vijayawada, Bangalore, or Warangal in the comfort of your own car without highway driving fatigue.',
                  fare: '₹1,899 / Day',
                  icon: '🛣️'
                },
                {
                  title: 'Corporate Chauffeur Services',
                  tag: 'Enterprise Billing',
                  desc: 'Centralized monthly invoicing, GST input credit, employee transport and executive driver management for Hyderabad enterprises.',
                  fare: 'Custom SLA',
                  icon: '🏢'
                }
              ].map((s, idx) => (
                <div key={idx} className="bg-[#F5F7FB] border border-gray-100 rounded-3xl p-8 hover:shadow-xl transition-all group hover:-translate-y-1">
                  <div className="text-4xl mb-4">{s.icon}</div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-[#101D35] group-hover:text-[#246BFD] transition-colors">{s.title}</h3>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-100 text-[#246BFD]">
                      {s.tag}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed mb-6">{s.desc}</p>
                  <div className="pt-4 border-t border-gray-200 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-gray-400 block">Starting from</span>
                      <span className="text-base font-black text-[#101D35]">{s.fare}</span>
                    </div>
                    <a href="#book" className="text-xs font-bold text-[#246BFD] hover:underline">Book Now →</a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* HOW DRIVERYO WORKS */}
        <section id="how-it-works" className="py-20 bg-[#F5F7FB]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-xs font-bold uppercase tracking-wider text-[#246BFD]">Simple 4-Step Process</span>
              <h2 className="text-3xl font-black text-[#101D35] mt-2">How Driveryo Works</h2>
              <p className="text-gray-500 mt-2 text-sm">Experience effortless personal car mobility in four smooth steps.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { step: '01', title: 'Request Online', desc: 'Select your service type, pickup spot in Hyderabad, duration, and transmission type.' },
                { step: '02', title: 'Driver Arrives', desc: 'A vetted, uniformed chauffeur reaches your parked car and presents his digital badge.' },
                { step: '03', title: 'Verify OTP', desc: 'Provide your 4-digit security OTP to begin the trip meter. Sit back and enjoy the ride.' },
                { step: '04', title: 'Pay Cashless', desc: 'Trip completes automatically. Pay seamlessly via UPI, credit/debit card, or corporate wallet.' }
              ].map((step, idx) => (
                <div key={idx} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 relative">
                  <div className="text-3xl font-black text-[#246BFD]/20 mb-3">{step.step}</div>
                  <h3 className="text-lg font-bold text-[#101D35] mb-2">{step.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* WHY CHOOSE DRIVERYO & VERIFIED DRIVER BENEFITS */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#246BFD]">Safety & Rigorous Standards</span>
                <h2 className="text-3xl font-black text-[#101D35] mt-2 mb-6">
                  Why Car Owners Trust Driveryo Across Hyderabad
                </h2>
                <div className="space-y-4">
                  {[
                    { title: 'Exhaustive Police & Aadhaar Verification', desc: 'Every driver partner undergoes comprehensive criminal background verification, address validation, and driving license authentication.' },
                    { title: 'Expertise in All Transmissions', desc: 'Drivers are certified to skillfully operate manual gears, dual-clutch, CVT, and automated manuals across hatchbacks, sedans, SUVs, and luxury marques.' },
                    { title: 'Zero Surge Surprises', desc: 'Our pricing rules are transparent, pre-calculated, and displayed before you confirm your booking.' },
                    { title: 'Live GPS Telemetry & SOS Emergency', desc: 'Live ride tracking shareable with family members, backed by 24x7 Hyderabad control room assistance.' }
                  ].map((item, idx) => (
                    <div key={idx} className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 text-[#19B887] flex items-center justify-center font-bold text-sm shrink-0">
                        ✓
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-[#101D35]">{item.title}</h4>
                        <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stats / Highlight Box */}
              <div className="bg-[#101D35] text-white rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-2xl"></div>
                <h3 className="text-2xl font-black mb-4">Dedicated to Your Own Car</h3>
                <p className="text-sm text-gray-300 mb-8 leading-relaxed">
                  Unlike taxi platforms where you ride in third-party vehicles, Driveryo ensures you remain in the hygienic, familiar sanctuary of your personal car while freeing you from driving duties.
                </p>
                <div className="grid grid-cols-2 gap-6 pt-6 border-t border-gray-800">
                  <div>
                    <div className="text-3xl font-black text-[#246BFD]">50,000+</div>
                    <div className="text-xs text-gray-400 mt-1">Trips Driven in Hyderabad</div>
                  </div>
                  <div>
                    <div className="text-3xl font-black text-[#19B887]">1,500+</div>
                    <div className="text-xs text-gray-400 mt-1">Verified Driver Partners</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* TRANSPARENT PRICING TABLE */}
        <section id="pricing" className="py-20 bg-[#F5F7FB]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-xs font-bold uppercase tracking-wider text-[#246BFD]">Honest Indian Rupee Pricing</span>
              <h2 className="text-3xl font-black text-[#101D35] mt-2">Transparent Driver Rates (Hyderabad)</h2>
              <p className="text-gray-500 mt-2 text-sm">Configurable rates with zero hidden surge spikes.</p>
            </div>

            <div className="overflow-x-auto bg-white rounded-3xl shadow-sm border border-gray-100">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#101D35] text-white text-xs uppercase tracking-wider">
                  <tr>
                    <th className="py-4 px-6">Service Package</th>
                    <th className="py-4 px-6">Included Duration</th>
                    <th className="py-4 px-6">Base Fare</th>
                    <th className="py-4 px-6">Extra Hour Rate</th>
                    <th className="py-4 px-6">Night Window</th>
                    <th className="py-4 px-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700">
                  <tr>
                    <td className="py-4 px-6 font-bold text-[#101D35]">Instant Driver</td>
                    <td className="py-4 px-6">2 Hours</td>
                    <td className="py-4 px-6 font-semibold">₹349</td>
                    <td className="py-4 px-6">₹149 / hr</td>
                    <td className="py-4 px-6 text-xs text-gray-500">10 PM – 6 AM (+25%)</td>
                    <td className="py-4 px-6 text-right"><a href="#book" className="text-xs font-bold text-[#246BFD] hover:underline">Book</a></td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 font-bold text-[#101D35]">Scheduled Driver</td>
                    <td className="py-4 px-6">2 Hours</td>
                    <td className="py-4 px-6 font-semibold">₹399</td>
                    <td className="py-4 px-6">₹149 / hr</td>
                    <td className="py-4 px-6 text-xs text-gray-500">10 PM – 6 AM (+25%)</td>
                    <td className="py-4 px-6 text-right"><a href="#book" className="text-xs font-bold text-[#246BFD] hover:underline">Book</a></td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 font-bold text-[#101D35]">Daily Chauffeur</td>
                    <td className="py-4 px-6">8 Hours</td>
                    <td className="py-4 px-6 font-semibold">₹1,199</td>
                    <td className="py-4 px-6">₹129 / hr</td>
                    <td className="py-4 px-6 text-xs text-gray-500">10 PM – 6 AM (+25%)</td>
                    <td className="py-4 px-6 text-right"><a href="#book" className="text-xs font-bold text-[#246BFD] hover:underline">Book</a></td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 font-bold text-[#101D35]">Outstation Trip</td>
                    <td className="py-4 px-6">12 Hours</td>
                    <td className="py-4 px-6 font-semibold">₹1,899</td>
                    <td className="py-4 px-6">₹159 / hr</td>
                    <td className="py-4 px-6 text-xs text-gray-500">Night allowance included</td>
                    <td className="py-4 px-6 text-right"><a href="#book" className="text-xs font-bold text-[#246BFD] hover:underline">Book</a></td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 font-bold text-[#101D35]">Monthly Subscription</td>
                    <td className="py-4 px-6">26 Days (8 hrs/day)</td>
                    <td className="py-4 px-6 font-semibold">₹24,999</td>
                    <td className="py-4 px-6">₹120 / hr</td>
                    <td className="py-4 px-6 text-xs text-gray-500">Dedicated Chauffeur</td>
                    <td className="py-4 px-6 text-right"><a href="#book" className="text-xs font-bold text-[#246BFD] hover:underline">Inquire</a></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* CUSTOMER TESTIMONIALS */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-xs font-bold uppercase tracking-wider text-[#246BFD]">Verified Reviews</span>
              <h2 className="text-3xl font-black text-[#101D35] mt-2">What Hyderabad Car Owners Say</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  name: 'Vikram Reddy',
                  area: 'Jubilee Hills, Hyderabad',
                  car: 'Hyundai Creta (Automatic)',
                  review: 'Driveryo has been a lifesaver for our late weekend dinners in Banjara Hills. Driver Ramesh arrived in 10 minutes, drove very gently, and handled my automatic Creta like a pro.'
                },
                {
                  name: 'Dr. Snigdha Rao',
                  area: 'Gachibowli, Hyderabad',
                  car: 'Honda City (Manual)',
                  review: 'I booked a daily 8-hour package for a full day of medical conferences and clinic visits. The driver was punctual, uniformed, and extremely polite. Transparent pricing with no surprises.'
                },
                {
                  name: 'Karthik Varma',
                  area: 'HITEC City, Hyderabad',
                  car: 'Tata Safari',
                  review: 'We took our own SUV for a 3-day family pilgrimage to Srisailam. Our Driveryo chauffeur handled the ghat roads with extreme care. Truly premium experience.'
                }
              ].map((t, idx) => (
                <div key={idx} className="bg-[#F5F7FB] p-8 rounded-3xl border border-gray-100 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="text-amber-400 text-sm">★★★★★</div>
                    <p className="text-sm text-gray-600 italic">"{t.review}"</p>
                  </div>
                  <div className="pt-6 mt-6 border-t border-gray-200">
                    <h4 className="text-sm font-bold text-[#101D35]">{t.name}</h4>
                    <p className="text-xs text-gray-500">{t.area}</p>
                    <span className="inline-block mt-1 text-[10px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                      {t.car}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* BECOME A DRIVER PARTNER (RECRUITMENT) */}
        <section id="driver-registration" className="py-20 bg-[#101D35] text-white relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-r from-blue-900 to-[#101D35] rounded-3xl p-8 sm:p-12 border border-blue-500/30 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-400">Join Driveryo Partner Network</span>
                <h2 className="text-3xl font-black mt-2 mb-4">Drive Customer Cars. Earn Up to ₹45,000 / Month.</h2>
                <p className="text-sm text-gray-300 mb-6 leading-relaxed">
                  Are you a skilled, courteous driver in Hyderabad with a valid driving license? Partner with Driveryo. Zero car maintenance burden—you drive the customer's vehicle. Daily payouts, flexible hours, and health insurance coverage.
                </p>
                <div className="grid grid-cols-2 gap-4 text-xs mb-8">
                  <div className="flex items-center gap-2">
                    <span className="text-[#19B887] font-bold">✓</span> Fast Weekly/Daily Payouts
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#19B887] font-bold">✓</span> No Vehicle Investment
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#19B887] font-bold">✓</span> Operating in All Hyderabad Hubs
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#19B887] font-bold">✓</span> Dedicated Partner Support
                  </div>
                </div>
              </div>

              {/* Quick Partner Signup Form */}
              <div className="bg-white text-[#26364F] rounded-2xl p-6 sm:p-8 shadow-xl">
                <h3 className="text-lg font-bold text-[#101D35] mb-2">Driver Partner Quick Registration</h3>
                <p className="text-xs text-gray-500 mb-4">Hyderabad Region • Commercial & Private Drivers</p>
                <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); alert('Driver registration initiated. Verification team will contact you within 24 hours.'); }}>
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Full Name (as per Aadhaar)</label>
                    <input type="text" placeholder="e.g. Ramesh Kumar" required className="w-full px-3 py-2 border rounded-xl text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Mobile Number</label>
                    <input type="tel" maxLength={10} placeholder="9876543210" required className="w-full px-3 py-2 border rounded-xl text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Driving License Number</label>
                    <input type="text" placeholder="TS0920200001234" required className="w-full px-3 py-2 border rounded-xl text-sm uppercase" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Preferred Hyderabad Zone</label>
                    <select className="w-full px-3 py-2 border rounded-xl text-sm">
                      <option>HITEC City / Madhapur</option>
                      <option>Gachibowli / Financial District</option>
                      <option>Jubilee Hills / Banjara Hills</option>
                      <option>Secunderabad / Begumpet</option>
                      <option>Kukatpally / Miyapur</option>
                      <option>Shamshabad Airport Zone</option>
                    </select>
                  </div>
                  <button type="submit" className="w-full py-3 bg-[#19B887] hover:bg-emerald-600 text-white font-bold rounded-xl text-sm transition-colors mt-2">
                    Submit Driver Application
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* FREQUENTLY ASKED QUESTIONS */}
        <section id="faq" className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-xs font-bold uppercase tracking-wider text-[#246BFD]">Got Questions?</span>
              <h2 className="text-3xl font-black text-[#101D35] mt-2">Frequently Asked Questions</h2>
            </div>

            <div className="space-y-4">
              {[
                {
                  q: 'Does Driveryo provide the car, or do I need my own?',
                  a: 'Driveryo provides verified professional drivers to drive your own car. We are NOT a taxi or cab company; we supply chauffeurs for private vehicle owners.'
                },
                {
                  q: 'Can Driveryo drivers drive automatic transmission cars?',
                  a: 'Yes! When booking, select "Automatic" or "Manual". Our dispatch engine assigns only drivers with proven expertise and certified test verification for your car type.'
                },
                {
                  q: 'How are Driveryo drivers background-verified?',
                  a: 'Every driver undergoes 100% Aadhaar verification, commercial driving license check via Vahan portal, local police clearance certification, and a practical driving test.'
                },
                {
                  q: 'What happens if I need to cancel my booking?',
                  a: 'Free cancellation is available up to 30 minutes before your scheduled start time. A standard cancellation fee applies only if the driver has already reached your pickup location.'
                },
                {
                  q: 'What is the Trip Start OTP?',
                  a: 'When you create a booking, a confidential 4-digit OTP is shown on your screen and sent via SMS. You share this code with the driver only when he meets you at your car to ensure safety.'
                }
              ].map((faq, idx) => (
                <div key={idx} className="bg-[#F5F7FB] p-6 rounded-2xl border border-gray-100">
                  <h4 className="text-base font-bold text-[#101D35] mb-2">{faq.q}</h4>
                  <p className="text-xs text-gray-600 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
