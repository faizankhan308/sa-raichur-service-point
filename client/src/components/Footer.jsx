import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Globe, MessageSquare, ShieldCheck, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#0f172a] text-slate-400 border-t border-slate-800 font-sans relative overflow-hidden">
      {/* Decorative background grid */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,163,196,0.03),transparent_45%)]" />

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16 relative z-10">
        
        {/* Top Grid Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">
          
          {/* Column 1: Company details */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="flex items-center justify-center h-8 w-8 bg-white/10 rounded-lg text-white font-display text-sm font-black tracking-tight">
                S<span className="text-accent">A</span>
              </div>
              <span className="font-display text-sm font-black tracking-wider text-white">S A RAICHUR</span>
            </div>
            
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              “Clean Homes. Trusted Service. Happy Customers.” <br />
              Your premier professional service platform in Raichur, delivering top-tier deep cleaning, repairs, and household help.
            </p>
            
            <div className="flex items-center gap-2.5 pt-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/5 border border-white/10 text-emerald-400">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">UC Certified Safe Partner</span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-white font-display text-xs font-black tracking-widest uppercase mb-4 pb-1 border-b border-slate-800 w-1/3">
              Catalog
            </h3>
            <ul className="space-y-2 text-xs font-bold uppercase tracking-wider">
              <li>
                <Link to="/services" className="hover:text-white hover:underline transition-all">All Services</Link>
              </li>
              <li>
                <Link to="/services?category=cleaning" className="hover:text-white hover:underline transition-all">Deep Cleaning</Link>
              </li>
              <li>
                <Link to="/services?category=maintenance" className="hover:text-white hover:underline transition-all">Home Maintenance</Link>
              </li>
              <li>
                <Link to="/services?category=others" className="hover:text-white hover:underline transition-all">Other Services</Link>
              </li>
              <li>
                <Link to="/my-bookings" className="text-accent hover:text-white transition-colors">Track Booking</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: For Professionals */}
          <div>
            <h3 className="text-white font-display text-xs font-black tracking-widest uppercase mb-4 pb-1 border-b border-slate-800 w-1/3">
              Careers
            </h3>
            <ul className="space-y-2.5 text-xs font-medium">
              <li>
                <a 
                  href="https://wa.me/917411741418?text=I%20want%20to%20join%20the%20team%20as%20a%20service%20professional." 
                  target="_blank" 
                  rel="noreferrer" 
                  className="hover:text-white hover:underline transition-colors flex items-center gap-1.5"
                >
                  <MessageSquare className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Join Our Partner Network</span>
                </a>
              </li>
              <li>
                <a 
                  href="https://wa.me/918867647591?text=I%20want%20to%20register%2520my%2520business." 
                  target="_blank" 
                  rel="noreferrer" 
                  className="hover:text-white hover:underline transition-colors"
                >
                  Register as a Specialist
                </a>
              </li>
              <li>
                <Link to="/login" className="hover:text-white text-slate-500 font-semibold transition-colors">
                  Admin Dashboard Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Local Contact Info */}
          <div>
            <h3 className="text-white font-display text-xs font-black tracking-widest uppercase mb-4 pb-1 border-b border-slate-800 w-1/3">
              Office
            </h3>
            <ul className="space-y-3.5 text-xs font-medium">
              <li className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  Raichur, Karnataka, India<br />
                  <span className="text-slate-500 text-[10px] font-bold block mt-0.5">SERVING RAICHUR & NEIGHBORING TOWNS</span>
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <Phone className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                <div className="flex flex-col gap-0.5">
                  <a href="tel:7411741418" className="hover:text-white font-bold">7411741418</a>
                  <a href="tel:8867647591" className="hover:text-white font-bold">8867647591</a>
                </div>
              </li>
              <li className="flex items-center gap-2.5">
                <Globe className="h-4 w-4 text-accent shrink-0" />
                <a href="http://saraichurservicepoint.com" target="_blank" rel="noreferrer" className="hover:text-white font-bold">
                  saraichurservicepoint.com
                </a>
              </li>
            </ul>
          </div>

        </div>
        
        {/* Divider */}
        <hr className="border-slate-800/80 my-8" />

        {/* Bottom copyright details and socials */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-5 text-[11px] font-medium text-slate-500">
          <div className="flex items-center gap-1.5">
            <span>&copy; {new Date().getFullYear()} S A Raichur Service Point.</span>
            <span>All rights reserved.</span>
          </div>

          <div className="flex items-center gap-1">
            <span>Crafted with</span>
            <Heart className="h-3 w-3 text-red-500 fill-current animate-pulse" />
            <span>in Raichur, Karnataka</span>
          </div>

          <div className="flex items-center gap-4">
            <a href="#" className="text-slate-600 hover:text-white transition-colors" aria-label="Facebook">
              <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/>
              </svg>
            </a>
            <a 
              href="https://www.instagram.com/sa_raichur_serives_point?igsi=Y2ZjdGkwdzkyMjV2" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-slate-600 hover:text-white transition-colors" 
              aria-label="Instagram"
            >
              <svg className="h-4 w-4 text-current" stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
