import React, { useState } from 'react';

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#101D35]/95 backdrop-blur-md border-b border-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Tagline */}
          <div className="flex items-center gap-3">
            <a href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#246BFD] to-blue-400 flex items-center justify-center font-black text-xl shadow-lg shadow-blue-500/30 text-white">
                D
              </div>
              <div>
                <span className="text-2xl font-black tracking-tight text-white group-hover:text-blue-400 transition-colors">
                  DRIVERYO
                </span>
                <span className="hidden sm:block text-[10px] text-gray-400 tracking-wider font-semibold uppercase -mt-1">
                  Your Car. Our Driver.
                </span>
              </div>
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium">
            <a href="#services" className="text-gray-300 hover:text-white transition-colors">Services</a>
            <a href="#pricing" className="text-gray-300 hover:text-white transition-colors">Pricing</a>
            <a href="#how-it-works" className="text-gray-300 hover:text-white transition-colors">How It Works</a>
            <a href="#corporate" className="text-gray-300 hover:text-white transition-colors">Corporate</a>
            <a href="#about" className="text-gray-300 hover:text-white transition-colors">About Us</a>
            <a href="#faq" className="text-gray-300 hover:text-white transition-colors">FAQ</a>
          </nav>

          {/* CTA & Actions */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="#driver-registration"
              className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-blue-400 border border-blue-500/40 rounded-xl hover:bg-blue-500/10 transition-all"
            >
              Become a Driver
            </a>
            <a
              href="#login"
              className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white hover:text-blue-300 transition-colors"
            >
              Customer Login
            </a>
            <a
              href="#book"
              className="px-5 py-2.5 text-sm font-bold bg-[#246BFD] text-white rounded-xl shadow-lg shadow-blue-600/30 hover:bg-blue-600 transition-all active:scale-95"
            >
              Book a Driver
            </a>
          </div>

          {/* Mobile hamburger */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-gray-400 hover:text-white focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-800 space-y-3">
            <a href="#services" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-gray-300 hover:text-white font-medium">Services</a>
            <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-gray-300 hover:text-white font-medium">Pricing</a>
            <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-gray-300 hover:text-white font-medium">How It Works</a>
            <a href="#corporate" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-gray-300 hover:text-white font-medium">Corporate Services</a>
            <a href="#driver-registration" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-blue-400 font-medium">Become a Driver Partner</a>
            <a href="#login" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-white font-medium">Customer Login / Signup</a>
            <a href="#book" onClick={() => setMobileMenuOpen(false)} className="block w-full text-center py-3 bg-[#246BFD] text-white font-bold rounded-xl mt-2">
              Book a Driver Now
            </a>
          </div>
        )}
      </div>
    </header>
  );
};
