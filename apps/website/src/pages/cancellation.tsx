import React from 'react';
import Head from 'next/head';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

export default function CancellationPage() {
  return (
    <div className="min-h-screen bg-[#F5F7FB] text-[#26364F] flex flex-col font-sans">
      <Head>
        <title>Cancellation Policy | DRIVERYO</title>
      </Head>
      <Header />
      <main className="flex-grow py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-white p-8 sm:p-12 rounded-3xl border border-gray-100 shadow-sm space-y-6 text-xs text-gray-600 leading-relaxed">
          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">Booking Cancellation</span>
          <h1 className="text-3xl font-black text-[#101D35]">Cancellation Policy</h1>
          <p><strong>Effective Date:</strong> January 1, 2026 | Driveryo Mobility Private Limited</p>
          <hr />
          <h3 className="text-sm font-bold text-[#101D35]">1. Free Cancellation Period</h3>
          <p>Customers may cancel any scheduled or instant booking free of charge up to 30 minutes prior to the designated pickup start time.</p>
          <h3 className="text-sm font-bold text-[#101D35]">2. Late Cancellation Fee</h3>
          <p>If a booking is cancelled after a driver partner has arrived at your location or is within 5 minutes of arrival, a standard cancellation fee of ₹99 (for Instant/Scheduled) or ₹199 (for Daily packages) will be levied to compensate the driver partner for travel time and fuel expenses.</p>
          <h3 className="text-sm font-bold text-[#101D35]">3. Driver No-Show Guarantee</h3>
          <p>If an assigned driver partner fails to arrive within 15 minutes of the confirmed booking ETA, the customer is entitled to free immediate re-dispatch or a ₹100 credit on their next trip.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
