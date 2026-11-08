import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#101D35] text-white pt-16 pb-12 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-[#246BFD] flex items-center justify-center font-black text-xl text-white">
                D
              </div>
              <span className="text-2xl font-black tracking-tight text-white">DRIVERYO</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
              Your Car. Your Journey. Our Driver.
              Premium on-demand driver booking service for customer-owned vehicles across Hyderabad and major Indian metropolitan cities.
            </p>
            <div className="pt-2 text-xs text-gray-400 space-y-1">
              <p className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#19B887]"></span>
                Operating in Hyderabad: HITEC City, Gachibowli, Banjara Hills, Jubilee Hills, Secunderabad & RGIA Airport.
              </p>
              <p>Email: <a href="mailto:support@driveryo.com" className="text-blue-400 hover:underline">support@driveryo.com</a></p>
              <p>Phone: <a href="tel:+914048995500" className="text-blue-400 hover:underline">+91 40 4899 5500</a></p>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-gray-200 mb-4">Driver Services</h4>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li><a href="#services" className="hover:text-blue-400 transition-colors">Instant Driver</a></li>
              <li><a href="#services" className="hover:text-blue-400 transition-colors">Scheduled Driver</a></li>
              <li><a href="#services" className="hover:text-blue-400 transition-colors">Daily Driver Packages</a></li>
              <li><a href="#services" className="hover:text-blue-400 transition-colors">Monthly Chauffeur</a></li>
              <li><a href="#services" className="hover:text-blue-400 transition-colors">Outstation Trips</a></li>
              <li><a href="#corporate" className="hover:text-blue-400 transition-colors">Corporate Accounts</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-gray-200 mb-4">Company</h4>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li><a href="#about" className="hover:text-blue-400 transition-colors">About Us</a></li>
              <li><a href="#driver-registration" className="hover:text-blue-400 transition-colors">Become a Driver Partner</a></li>
              <li><a href="#blog" className="hover:text-blue-400 transition-colors">Blog & Safety Tips</a></li>
              <li><a href="#contact" className="hover:text-blue-400 transition-colors">Contact Support</a></li>
              <li><a href="#faq" className="hover:text-blue-400 transition-colors">FAQ</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-gray-200 mb-4">Trust & Legal</h4>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li><a href="#privacy" className="hover:text-blue-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#terms" className="hover:text-blue-400 transition-colors">Terms of Service</a></li>
              <li><a href="#cancellation" className="hover:text-blue-400 transition-colors">Cancellation Policy</a></li>
              <li><a href="#refund" className="hover:text-blue-400 transition-colors">Refund Policy</a></li>
              <li><a href="#driver-terms" className="hover:text-blue-400 transition-colors">Driver Agreement</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-4">
          <p>© {new Date().getFullYear()} DRIVERYO Mobility Private Limited. All rights reserved.</p>
          <p className="text-gray-400">
            Driveryo provides verified professional drivers for customer vehicles. Driveryo does not supply or rent taxi vehicles.
          </p>
        </div>
      </div>
    </footer>
  );
};
