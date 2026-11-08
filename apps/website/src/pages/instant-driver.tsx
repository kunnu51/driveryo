import React from 'react';
import Head from 'next/head';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { BookingWidget } from '../components/BookingWidget';

export default function InstantDriverPage() {
  return (
    <div className="min-h-screen bg-[#F5F7FB] text-[#26364F] flex flex-col font-sans">
      <Head>
        <title>Instant Driver on Demand | DRIVERYO Hyderabad</title>
        <meta name="description" content="Need a driver right away in Hyderabad? Get a verified chauffeur at your car in 10-15 minutes across HITEC City, Gachibowli, Jubilee Hills." />
      </Head>

      <Header />

      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto mb-10 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 mb-3">
            ⚡ 10-15 Minute Dispatch Across Hyderabad
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#101D35]">
            Instant On-Demand Driver for Your Car
          </h1>
          <p className="text-sm text-gray-500 mt-2 max-w-xl mx-auto">
            Stuck in traffic? Feeling exhausted after a long workday or party? Our vetted chauffeurs are stationed across HITEC City, Gachibowli, Madhapur, and Banjara Hills.
          </p>
        </div>

        <BookingWidget />

        <div className="max-w-4xl mx-auto mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center">
            <div className="text-3xl mb-2">⏱️</div>
            <h3 className="font-bold text-sm text-[#101D35]">10-15 Mins ETA</h3>
            <p className="text-xs text-gray-500 mt-1">Nearest available driver partner assigned instantaneously via proximity radar.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center">
            <div className="text-3xl mb-2">🛡️</div>
            <h3 className="font-bold text-sm text-[#101D35]">Zero Surge Spike</h3>
            <p className="text-xs text-gray-500 mt-1">Starting at ₹349 for the first 2 hours. Transparent extra hour rates.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center">
            <div className="text-3xl mb-2">🔑</div>
            <h3 className="font-bold text-sm text-[#101D35]">Trip Start OTP</h3>
            <p className="text-xs text-gray-500 mt-1">Your car will not be operated until you verify the driver's confidential 4-digit code.</p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
