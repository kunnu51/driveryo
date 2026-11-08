import React, { useState } from 'react';
import Head from 'next/head';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

export default function CorporateServicesPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="min-h-screen bg-[#F5F7FB] text-[#26364F] flex flex-col font-sans">
      <Head>
        <title>Corporate Chauffeur Services | DRIVERYO Hyderabad</title>
        <meta name="description" content="Dedicated executive driver services and centralized monthly billing for IT enterprises and multinationals in HITEC City and Gachibowli." />
      </Head>

      <Header />

      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#246BFD] bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                🏢 Enterprise Mobility Partner
              </span>
              <h1 className="text-3xl sm:text-4xl font-black text-[#101D35] mt-3 mb-4">
                Corporate Chauffeur Solutions for Hyderabad Enterprises
              </h1>
              <p className="text-sm text-gray-600 leading-relaxed mb-6">
                Deliver seamless executive mobility for your leadership team, corporate visitors, and late-working staff across Cyberabad. Benefit from centralized GST invoicing, dedicated SLA guarantees, and pre-negotiated volume corporate tariffs.
              </p>

              <div className="space-y-3 text-xs text-gray-700 mb-8">
                <div className="flex items-center gap-2"><span className="text-[#19B887] font-bold text-sm">✓</span> Monthly consolidated billing with 18% GST input tax credit</div>
                <div className="flex items-center gap-2"><span className="text-[#19B887] font-bold text-sm">✓</span> Dedicated chauffeurs assigned for senior leadership vehicles</div>
                <div className="flex items-center gap-2"><span className="text-[#19B887] font-bold text-sm">✓</span> 100% Police verification and NDAs signed for corporate confidentiality</div>
                <div className="flex items-center gap-2"><span className="text-[#19B887] font-bold text-sm">✓</span> Priority 10-minute dispatch across HITEC City & Gachibowli</div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl">
              {submitted ? (
                <div className="text-center py-8 space-y-3">
                  <div className="w-14 h-14 bg-emerald-100 text-[#19B887] rounded-full flex items-center justify-center text-2xl font-bold mx-auto">✓</div>
                  <h3 className="font-bold text-base text-[#101D35]">Inquiry Received</h3>
                  <p className="text-xs text-gray-500">Our Enterprise Account Manager will reach out within 2 hours with customized rate proposals.</p>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setSubmitted(true);
                  }}
                  className="space-y-4 text-xs"
                >
                  <h3 className="font-bold text-base text-[#101D35]">Request Corporate Partnership</h3>
                  <p className="text-[11px] text-gray-500">HITEC City • Gachibowli • Financial District Hubs</p>

                  <div>
                    <label className="block font-bold text-gray-600 mb-1">Company Legal Name</label>
                    <input type="text" required placeholder="e.g. Infotech Solutions India Pvt Ltd" className="w-full px-3 py-2.5 rounded-xl border bg-gray-50 text-xs" />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-600 mb-1">Official Work Email</label>
                    <input type="email" required placeholder="corporate@company.com" className="w-full px-3 py-2.5 rounded-xl border bg-gray-50 text-xs" />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-600 mb-1">Contact Phone</label>
                    <input type="tel" required placeholder="9876543210" className="w-full px-3 py-2.5 rounded-xl border bg-gray-50 text-xs" />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-600 mb-1">Monthly Chauffeur Requirement</label>
                    <select className="w-full px-3 py-2.5 rounded-xl border bg-gray-50 text-xs">
                      <option>100 - 300 Hours (Small Team)</option>
                      <option>300 - 1,000 Hours (Mid Enterprise)</option>
                      <option>1,000+ Hours (Multi-Site Corporate Fleet)</option>
                    </select>
                  </div>
                  <button type="submit" className="w-full py-3.5 bg-[#101D35] hover:bg-black text-white font-bold rounded-xl text-xs transition-colors mt-2">
                    Submit Corporate Request
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
