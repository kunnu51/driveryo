import React from 'react';
import Head from 'next/head';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { BookingWidget } from '../components/BookingWidget';

export default function ScheduledDriverPage() {
  return (
    <div className="min-h-screen bg-[#F5F7FB] text-[#26364F] flex flex-col font-sans">
      <Head>
        <title>Scheduled Driver Advance Booking | DRIVERYO Hyderabad</title>
        <meta name="description" content="Reserve a professional chauffeur ahead of time for airport drop-offs, early morning flights, family events, and medical visits in Hyderabad." />
      </Head>

      <Header />

      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto mb-10 text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-[#246BFD] bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            📅 Guaranteed On-Time Chauffeur
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-[#101D35] mt-3">
            Schedule a Driver in Advance
          </h1>
          <p className="text-sm text-gray-500 mt-2 max-w-xl mx-auto">
            Book hours or days ahead for RGIA airport departures, early morning medical appointments, or family social gatherings with complete peace of mind.
          </p>
        </div>

        <BookingWidget />
      </main>

      <Footer />
    </div>
  );
}
