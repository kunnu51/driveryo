import React from 'react';
import Head from 'next/head';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#F5F7FB] text-[#26364F] flex flex-col font-sans">
      <Head>
        <title>Terms and Conditions | DRIVERYO</title>
      </Head>
      <Header />
      <main className="flex-grow py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-white p-8 sm:p-12 rounded-3xl border border-gray-100 shadow-sm space-y-6 text-xs text-gray-600 leading-relaxed">
          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">User Agreement</span>
          <h1 className="text-3xl font-black text-[#101D35]">Terms & Conditions</h1>
          <p><strong>Effective Date:</strong> January 1, 2026 | Driveryo Mobility Private Limited</p>
          <hr />
          <h3 className="text-sm font-bold text-[#101D35]">1. Platform Scope & Nature of Services</h3>
          <p>Driveryo operates an electronic marketplace technology platform connecting vehicle owners with vetted, independent driver partners. Driveryo does NOT own, lease, or supply taxi vehicles.</p>
          <h3 className="text-sm font-bold text-[#101D35]">2. Customer Vehicle Warranties</h3>
          <p>The customer warrants that the vehicle supplied for the journey is legally registered, possesses valid comprehensive motor third-party insurance, maintains active PUC certification, and is mechanically sound.</p>
          <h3 className="text-sm font-bold text-[#101D35]">3. Mandatory Trip Start OTP</h3>
          <p>No chauffeur is authorized or permitted to turn the car ignition or commence a booking without entering the customer's unique 4-digit OTP into the Driveryo Driver application.</p>
          <h3 className="text-sm font-bold text-[#101D35]">4. Payment Obligations</h3>
          <p>Customers agree to pay the final calculated fare, extra hour charges, and any applicable waiting fees immediately upon trip completion via Razorpay UPI or supported card gateways.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
