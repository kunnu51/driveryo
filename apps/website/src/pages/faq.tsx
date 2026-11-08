import React from 'react';
import Head from 'next/head';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

export default function FAQPage() {
  const faqs = [
    {
      q: 'Does Driveryo provide the vehicle, or do I need my own?',
      a: 'Driveryo provides verified professional drivers to operate your own private or company-owned car. We are NOT a taxi or cab company; customers book a chauffeur for their own car.'
    },
    {
      q: 'Can Driveryo drivers operate automatic transmission cars?',
      a: 'Yes! When placing a booking, select "Automatic" or "Manual". Our dispatch engine matches only drivers verified with practical competency for your vehicle transmission type.'
    },
    {
      q: 'How are Driveryo driver partners vetted and background checked?',
      a: 'Every partner must complete a 4-step compliance check: Aadhaar identity verification, commercial driving license authenticity check via Ministry of Road Transport, local police clearance certificate, and an in-person driving test.'
    },
    {
      q: 'What is the Trip Start OTP?',
      a: 'To safeguard your car, a unique 4-digit code is sent to your mobile phone when a booking is confirmed. Your chauffeur cannot start the trip meter or drive your car until you physically provide this OTP upon meeting at your car.'
    },
    {
      q: 'What if I need to cancel my booking?',
      a: 'Free cancellation is permitted up to 30 minutes before your scheduled start time. A standard cancellation fee applies only if the driver has already reached your pickup location.'
    },
    {
      q: 'Are toll taxes and parking charges included in the fare?',
      a: 'No. Toll charges, state entry taxes (for outstation trips), and parking tickets are paid directly by the customer, as the vehicle belongs to the customer.'
    },
    {
      q: 'What payment options are available?',
      a: 'We accept Razorpay UPI (Google Pay, PhonePe, Paytm), Visa/Mastercard/RuPay credit and debit cards, Net Banking, and corporate invoices.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#F5F7FB] text-[#26364F] flex flex-col font-sans">
      <Head>
        <title>Frequently Asked Questions | DRIVERYO Hyderabad</title>
        <meta name="description" content="Get answers to common questions about Driveryo driver booking, vehicle transmissions, safety vetting, OTP verification, and pricing." />
      </Head>

      <Header />

      <main className="flex-grow py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-10">
          <div className="text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-[#246BFD] bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
              Clear & Transparent Answers
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-[#101D35] mt-3">
              Frequently Asked Questions
            </h1>
            <p className="text-sm text-gray-500 mt-2">Everything you need to know about booking chauffeurs with Driveryo</p>
          </div>

          <div className="space-y-4">
            {faqs.map((f, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <h3 className="text-base font-bold text-[#101D35] mb-2">{f.q}</h3>
                <p className="text-xs text-gray-600 leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
