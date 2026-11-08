import React from 'react';
import Head from 'next/head';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-[#F5F7FB] text-[#26364F] flex flex-col font-sans">
      <Head>
        <title>Refund Policy | DRIVERYO</title>
      </Head>
      <Header />
      <main className="flex-grow py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-white p-8 sm:p-12 rounded-3xl border border-gray-100 shadow-sm space-y-6 text-xs text-gray-600 leading-relaxed">
          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">Settlements & Refunds</span>
          <h1 className="text-3xl font-black text-[#101D35]">Refund Policy</h1>
          <p><strong>Effective Date:</strong> January 1, 2026 | Driveryo Mobility Private Limited</p>
          <hr />
          <h3 className="text-sm font-bold text-[#101D35]">1. Eligibility for Refunds</h3>
          <p>Refunds are applicable in cases of double-billing, erroneous cancellations where a fee was incorrectly applied, or service quality disputes verified by our Hyderabad safety team.</p>
          <h3 className="text-sm font-bold text-[#101D35]">2. Processing Timelines</h3>
          <p>All approved refunds are initiated through Razorpay to the original source of payment (UPI bank account, credit card, debit card) within 3 to 5 business days.</p>
          <h3 className="text-sm font-bold text-[#101D35]">3. Support & Dispute Channels</h3>
          <p>To raise a refund request, contact support within 48 hours of trip completion at <strong>support@driveryo.com</strong> or call <strong>+91 40 4899 5500</strong> with your Booking ID.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
