import React from 'react';
import Head from 'next/head';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#F5F7FB] text-[#26364F] flex flex-col font-sans">
      <Head>
        <title>About Us | DRIVERYO Hyderabad</title>
        <meta name="description" content="Learn about Driveryo's mission to transform personal car ownership into an effortless chauffeur-driven experience in Hyderabad and across India." />
      </Head>

      <Header />

      <main className="flex-grow py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-[#246BFD] bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
              Our Vision & Mission
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-[#101D35] mt-3">
              Your Car. Your Journey. Our Driver.
            </h1>
            <p className="text-sm text-gray-500 mt-2 max-w-xl mx-auto">
              Empowering Indian private car owners to travel in total peace and luxury without driving stress.
            </p>
          </div>

          <div className="bg-white p-8 sm:p-10 rounded-3xl border border-gray-100 shadow-sm space-y-6 text-sm text-gray-600 leading-relaxed">
            <h2 className="text-xl font-bold text-[#101D35]">Why We Built DRIVERYO</h2>
            <p>
              In rapidly expanding metropolitan cities like Hyderabad, car ownership continues to boom. Private car owners invest heavily in comfortable, feature-packed vehicles, yet navigating intense peak-hour traffic, wrestling for parking spots, or enduring fatigue after midnight functions significantly diminishes that comfort.
            </p>
            <p>
              Traditional taxi aggregators force car owners to leave their own vehicles parked at home and ride in third-party cabs of questionable hygiene and maintenance.
            </p>
            <p>
              <strong>DRIVERYO</strong> was founded to solve this dilemma: we provide thoroughly vetted, police-verified, courteous professional drivers who meet you at your parked car and drive you wherever you need to go.
            </p>

            <div className="pt-6 border-t border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-black text-[#246BFD]">50,000+</div>
                <div className="text-xs text-gray-500 mt-1">Trips Driven Safely</div>
              </div>
              <div>
                <div className="text-3xl font-black text-[#19B887]">1,500+</div>
                <div className="text-xs text-gray-500 mt-1">Verified Driver Partners</div>
              </div>
              <div>
                <div className="text-3xl font-black text-[#101D35]">4.9 / 5.0</div>
                <div className="text-xs text-gray-500 mt-1">Average Customer Rating</div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
