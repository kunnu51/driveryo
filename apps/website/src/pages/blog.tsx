import React from 'react';
import Head from 'next/head';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

export default function BlogPage() {
  const posts = [
    {
      title: 'Top 5 Scenic Weekend Road Trips from Hyderabad in Your Own Car',
      date: 'November 2026',
      read: '5 min read',
      excerpt: 'Explore Nagarjuna Sagar, Srisailam, Ananthagiri Hills, and Warangal without driver exhaustion. Hire a vetted outstation chauffeur.',
      tag: 'Travel Tips'
    },
    {
      title: 'Automatic vs. Manual Transmissions: Why Chauffeur Skill Matters',
      date: 'October 2026',
      read: '4 min read',
      excerpt: 'How dual-clutch, AMT, and CVT transmissions require gentle throttle modulation and how Driveryo trains drivers for private luxury cars.',
      tag: 'Car Care'
    },
    {
      title: 'How IT Professionals in Cyberabad are Saving 40 Hours a Month',
      date: 'September 2026',
      read: '6 min read',
      excerpt: 'Transforming daily commute time along Outer Ring Road into productive work hours with personal chauffeurs.',
      tag: 'Commute'
    }
  ];

  return (
    <div className="min-h-screen bg-[#F5F7FB] text-[#26364F] flex flex-col font-sans">
      <Head>
        <title>Driveryo Mobility Blog | Safe Driving & Road Trips Hyderabad</title>
        <meta name="description" content="Read travel tips, personal car care advice, highway safety guides, and city mobility insights from the Driveryo team." />
      </Head>

      <Header />

      <main className="flex-grow py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-10">
          <div className="text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-[#246BFD] bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
              Articles & Guides
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-[#101D35] mt-3">
              Driveryo Mobility Insights
            </h1>
            <p className="text-sm text-gray-500 mt-2">Hyderabad road trip ideas, car care, and stress-free commute guides</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {posts.map((p, i) => (
              <div key={i} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                <div className="space-y-3">
                  <span className="text-[10px] font-bold text-[#246BFD] bg-blue-50 px-2.5 py-1 rounded-md">{p.tag}</span>
                  <h3 className="font-bold text-sm text-[#101D35] leading-snug">{p.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{p.excerpt}</p>
                </div>
                <div className="pt-4 mt-4 border-t border-gray-100 text-[11px] text-gray-400 flex justify-between items-center">
                  <span>{p.date}</span>
                  <span className="text-blue-600 font-bold hover:underline cursor-pointer">Read →</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
