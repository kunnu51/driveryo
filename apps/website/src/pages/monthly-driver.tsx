import React from 'react';
import Head from 'next/head';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

export default function MonthlyDriverPage() {
  return (
    <div className="min-h-screen bg-[#F5F7FB] text-[#26364F] flex flex-col font-sans">
      <Head>
        <title>Monthly Chauffeur Subscription | DRIVERYO Hyderabad</title>
        <meta name="description" content="Permanent monthly personal chauffeur for your daily Hyderabad office commute. 26 working days with replacement driver guarantee." />
      </Head>

      <Header />

      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto mb-12 text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-[#246BFD] bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            👔 Premium Daily Commute Subscription
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-[#101D35] mt-3">
            Monthly Personal Chauffeur Plan (₹24,999 / Month)
          </h1>
          <p className="text-sm text-gray-500 mt-2 max-w-xl mx-auto">
            Say goodbye to driver absenteeism, salary disputes, and verification headaches. Driveryo supplies a permanent, police-verified chauffeur with guaranteed backup driver support.
          </p>
        </div>

        <div className="max-w-3xl mx-auto bg-white p-8 sm:p-10 rounded-3xl border border-gray-100 shadow-sm space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-3 text-xs">
              <h3 className="text-sm font-bold text-[#101D35]">Plan Features</h3>
              <p className="flex items-center gap-2"><span className="text-[#19B887] font-bold">✓</span> 26 Working Days per Month</p>
              <p className="flex items-center gap-2"><span className="text-[#19B887] font-bold">✓</span> 8 Hours Daily Duty Window</p>
              <p className="flex items-center gap-2"><span className="text-[#19B887] font-bold">✓</span> 100% Background & Police Verified</p>
              <p className="flex items-center gap-2"><span className="text-[#19B887] font-bold">✓</span> Automatic Replacement if Driver Takes Leave</p>
              <p className="flex items-center gap-2"><span className="text-[#19B887] font-bold">✓</span> Zero Long-Term Hiring Contracts</p>
            </div>
            <div className="space-y-3 text-xs">
              <h3 className="text-sm font-bold text-[#101D35]">Vehicle Competence</h3>
              <p className="flex items-center gap-2"><span className="text-[#19B887] font-bold">✓</span> Manual & Automatic Expertise</p>
              <p className="flex items-center gap-2"><span className="text-[#19B887] font-bold">✓</span> Hatchback, Sedan, SUV, Luxury</p>
              <p className="flex items-center gap-2"><span className="text-[#19B887] font-bold">✓</span> Trained in Gentle Braking & Smooth Cruising</p>
              <p className="flex items-center gap-2"><span className="text-[#19B887] font-bold">✓</span> Daily Vehicle Pre-Trip Walkaround Checks</p>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="text-2xl font-black text-[#101D35]">₹24,999 <span className="text-xs text-gray-500 font-normal">/ month (+GST)</span></div>
              <div className="text-[11px] text-gray-400">Fixed rate • No sudden driver salary hikes</div>
            </div>
            <a
              href="/contact"
              className="px-6 py-3 bg-[#246BFD] text-white font-bold rounded-xl text-xs hover:bg-blue-600 transition-colors"
            >
              Request Monthly Chauffeur Consultation
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
