import React from 'react';
import Head from 'next/head';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { BookingWidget } from '../components/BookingWidget';

export default function DailyDriverPage() {
  return (
    <div className="min-h-screen bg-[#F5F7FB] text-[#26364F] flex flex-col font-sans">
      <Head>
        <title>Daily Driver 8-Hour Packages | DRIVERYO Hyderabad</title>
        <meta name="description" content="Hire a dedicated professional driver for an entire day (8 hours) to drive your own car across Hyderabad for errands, shopping, and meetings." />
      </Head>

      <Header />

      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto mb-10 text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-[#19B887] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            🚗 Full Day Chauffeur • 8 Hours Included
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-[#101D35] mt-3">
            Daily Driver Packages (₹1,199 / 8 Hours)
          </h1>
          <p className="text-sm text-gray-500 mt-2 max-w-xl mx-auto">
            A dedicated, uniformed chauffeur at your disposal for 8 full hours. Ideal for multiple hospital visits, wedding shopping, city sightseeing, or back-to-back corporate client meetings.
          </p>
        </div>

        <BookingWidget />
      </main>

      <Footer />
    </div>
  );
}
