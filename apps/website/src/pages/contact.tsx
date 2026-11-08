import React, { useState } from 'react';
import Head from 'next/head';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  return (
    <div className="min-h-screen bg-[#F5F7FB] text-[#26364F] flex flex-col font-sans">
      <Head>
        <title>Contact Driveryo Support | Hyderabad Headquarters</title>
        <meta name="description" content="Reach Driveryo customer care and driver partner onboarding in HITEC City, Hyderabad. 24x7 phone, email, and live support." />
      </Head>

      <Header />

      <main className="flex-grow py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-[#246BFD] bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
              We Are Here 24x7
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-[#101D35] mt-3">
              Contact Driveryo Support
            </h1>
            <p className="text-sm text-gray-500 mt-2">Hyderabad Customer Care & Partner Helpdesk</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-8 sm:p-10 rounded-3xl border border-gray-100 shadow-sm">
            <div className="space-y-4 text-xs">
              <h3 className="text-base font-bold text-[#101D35]">Hyderabad Headquarters</h3>
              <p className="text-gray-600 leading-relaxed">
                Driveryo Mobility Private Limited<br />
                4th Floor, Cyber Towers, HITEC City,<br />
                Hyderabad, Telangana 500081, India
              </p>

              <div className="pt-2 space-y-2">
                <p><strong>Support Telephone:</strong> <a href="tel:+914048995500" className="text-blue-600 hover:underline">+91 40 4899 5500</a></p>
                <p><strong>Customer Email:</strong> <a href="mailto:support@driveryo.com" className="text-blue-600 hover:underline">support@driveryo.com</a></p>
                <p><strong>Partner Onboarding:</strong> <a href="mailto:partners@driveryo.com" className="text-blue-600 hover:underline">partners@driveryo.com</a></p>
                <p><strong>Corporate Inquiries:</strong> <a href="mailto:corporate@driveryo.com" className="text-blue-600 hover:underline">corporate@driveryo.com</a></p>
              </div>

              <div className="p-3 bg-blue-50 rounded-xl text-blue-800 text-[11px] leading-relaxed mt-4">
                🚨 <strong>Emergency Ride SOS:</strong> Available 24x7 directly within our customer and driver mobile apps during active trips.
              </div>
            </div>

            {sent ? (
              <div className="text-center py-10 space-y-3">
                <div className="w-12 h-12 bg-emerald-100 text-[#19B887] rounded-full flex items-center justify-center text-xl font-bold mx-auto">✓</div>
                <h4 className="font-bold text-base text-[#101D35]">Message Sent Successfully</h4>
                <p className="text-xs text-gray-500">Our customer support executive will review and respond shortly.</p>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setSent(true);
                }}
                className="space-y-3 text-xs"
              >
                <div>
                  <label className="block font-bold text-gray-600 mb-1">Your Full Name</label>
                  <input type="text" required placeholder="Name" className="w-full px-3 py-2 border rounded-xl bg-gray-50 text-xs" />
                </div>
                <div>
                  <label className="block font-bold text-gray-600 mb-1">Phone or Email Address</label>
                  <input type="text" required placeholder="Contact info" className="w-full px-3 py-2 border rounded-xl bg-gray-50 text-xs" />
                </div>
                <div>
                  <label className="block font-bold text-gray-600 mb-1">Message Subject</label>
                  <select className="w-full px-3 py-2 border rounded-xl bg-gray-50 text-xs">
                    <option>Booking Inquiry</option>
                    <option>Billing / Refund Question</option>
                    <option>Driver Partner Feedback</option>
                    <option>Corporate Partnership</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-gray-600 mb-1">Message</label>
                  <textarea rows={4} required placeholder="How can our team help?" className="w-full px-3 py-2 border rounded-xl bg-gray-50 text-xs"></textarea>
                </div>
                <button type="submit" className="w-full py-3 bg-[#246BFD] hover:bg-blue-600 text-white font-bold rounded-xl text-xs transition-colors">
                  Send Support Message
                </button>
              </form>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
