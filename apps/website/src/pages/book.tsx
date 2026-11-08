import React from 'react';
import Head from 'next/head';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { BookingWidget } from '../components/BookingWidget';

export default function BookDriverPage() {
  return (
    <div className="min-h-screen bg-[#F5F7FB] text-[#26364F] flex flex-col font-sans">
      <Head>
        <title>Book a Professional Driver | DRIVERYO Hyderabad</title>
        <meta name="description" content="Book vetted, background-checked professional chauffeurs to operate your own car in Hyderabad. Real-time pricing & instant driver dispatch." />
      </Head>

      <Header />

      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-[#246BFD] bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            Dedicated Chauffeurs For Your Car
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-[#101D35] mt-3">
            Book a Verified Driver in Hyderabad
          </h1>
          <p className="text-sm text-gray-500 mt-2 max-w-xl mx-auto">
            Choose your service type, vehicle transmission, and schedule. Our nearby verified driver partner reaches your car promptly.
          </p>
        </div>

        <BookingWidget />
      </main>

      <Footer />
    </div>
  );
}
