import React from 'react';
import Head from 'next/head';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#F5F7FB] text-[#26364F] flex flex-col font-sans">
      <Head>
        <title>Privacy Policy | DRIVERYO</title>
      </Head>
      <Header />
      <main className="flex-grow py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-white p-8 sm:p-12 rounded-3xl border border-gray-100 shadow-sm space-y-6 text-xs text-gray-600 leading-relaxed">
          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">Legal Compliance</span>
          <h1 className="text-3xl font-black text-[#101D35]">Privacy Policy</h1>
          <p><strong>Effective Date:</strong> January 1, 2026 | Driveryo Mobility Private Limited</p>
          <hr />
          <h3 className="text-sm font-bold text-[#101D35]">1. Introduction</h3>
          <p>Driveryo Mobility Private Limited respects your privacy and is committed to protecting the personal data of customers and driver partners in compliance with applicable Indian information technology and digital personal data protection laws.</p>
          <h3 className="text-sm font-bold text-[#101D35]">2. Personal Data We Collect</h3>
          <p>We collect customer contact telephone numbers, full legal names, email addresses, vehicle details (Make, Model, Transmission, Registration number), and real-time GPS telemetry strictly while requesting rides and during active trip execution.</p>
          <h3 className="text-sm font-bold text-[#101D35]">3. Use of Location Information</h3>
          <p>GPS tracking is activated solely with explicit user consent to calculate accurate route durations, dispatch the nearest qualified chauffeur, and enable customers to share live trip progress with loved ones.</p>
          <h3 className="text-sm font-bold text-[#101D35]">4. Data Security</h3>
          <p>All sensitive information, including OTP hashes and authentication sessions, is encrypted in transit using TLS 1.3 and at rest using AES-256 protocols. We never sell customer or driver information to external marketing agencies.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
