import React from 'react';
import Head from 'next/head';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { BookingWidget } from '../components/BookingWidget';

export default function OutstationDriverPage() {
  return (
    <div className="min-h-screen bg-[#F5F7FB] text-[#26364F] flex flex-col font-sans">
      <Head>
        <title>Outstation Highway Drivers | DRIVERYO Hyderabad</title>
        <meta name="description" content="Book professional highway chauffeurs to drive your own car from Hyderabad to Srisailam, Vijayawada, Tirupati, Warangal, Bangalore, and Goa." />
      </Head>

      <Header />

      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto mb-10 text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-[#246BFD] bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            🛣️ Intercity & Highway Chauffeurs
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-[#101D35] mt-3">
            Outstation Road Trips (₹1,899 / 12 Hours)
          </h1>
          <p className="text-sm text-gray-500 mt-2 max-w-xl mx-auto">
            Travel to your favorite pilgrimage or holiday destinations in the comfort and privacy of your own car without highway driving exhaustion.
          </p>
        </div>

        <BookingWidget />

        <div className="max-w-4xl mx-auto mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          {[
            { dest: 'Hyderabad ➔ Srisailam', dist: '215 km', time: '4.5 hrs' },
            { dest: 'Hyderabad ➔ Vijayawada', dist: '275 km', time: '5 hrs' },
            { dest: 'Hyderabad ➔ Warangal', dist: '150 km', time: '3 hrs' },
            { dest: 'Hyderabad ➔ Tirupati', dist: '550 km', time: '9.5 hrs' },
          ].map((r, i) => (
            <div key={i} className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <div className="font-bold text-xs text-[#101D35]">{r.dest}</div>
              <div className="text-[11px] text-gray-500 mt-1">{r.dist} • {r.time}</div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
