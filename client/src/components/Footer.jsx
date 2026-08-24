import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Globe } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800">
      
      {/* Top Grid section */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Column 1: Company details */}
          <div>
            <h3 className="text-white font-display text-sm font-bold tracking-wider uppercase mb-4">Company</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/services" className="hover:text-white transition-colors">Our Services</Link></li>
              <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-white transition-colors">Terms & Conditions</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Column 2: Customers */}
          <div>
            <h3 className="text-white font-display text-sm font-bold tracking-wider uppercase mb-4">For Customers</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/services" className="hover:text-white transition-colors">Book a Service</Link></li>
              <li><Link to="/services?category=cleaning" className="hover:text-white transition-colors">Cleaning Categories</Link></li>
              <li><Link to="/services?category=maintenance" className="hover:text-white transition-colors">Maintenance Categories</Link></li>
              <li><Link to="/support" className="hover:text-white transition-colors">Customer Support</Link></li>
            </ul>
          </div>

          {/* Column 3: Professionals */}
          <div>
            <h3 className="text-white font-display text-sm font-bold tracking-wider uppercase mb-4">For Professionals</h3>
            <ul className="space-y-2.5 text-sm">
              <li><a href="https://wa.me/917411741418?text=I%20want%20to%20join%20the%20team%20as%20a%20service%20professional." target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Join Our Team</a></li>
              <li><a href="https://wa.me/917411741418?text=I%20want%20to%20register%20as%20a%20partner." target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Register as a Service Professional</a></li>
              <li><Link to="/login" className="hover:text-white transition-colors text-slate-500 font-semibold">Service Provider Login</Link></li>
            </ul>
          </div>

          {/* Column 4: Contact details */}
          <div>
            <h3 className="text-white font-display text-sm font-bold tracking-wider uppercase mb-4">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                <span>Raichur, Karnataka, India (Service Area: Raichur & Nearby towns)</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-accent shrink-0" />
                <div className="flex flex-col">
                  <a href="tel:7411741418" className="hover:text-white">7411741418</a>
                  <a href="tel:8867647591" className="hover:text-white">8867647591</a>
                </div>
              </li>
              <li className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-accent shrink-0" />
                <a href="http://saraichurservicepoint.com" target="_blank" rel="noreferrer" className="hover:text-white">saraichurservicepoint.com</a>
              </li>
            </ul>
          </div>

        </div>
        
        {/* Middle Line section */}
        <hr className="border-slate-800 my-8" />

        {/* Bottom copyright details and socials */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <span>&copy; 2026 S A Raichur Service Point. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <a href="#" className="text-slate-500 hover:text-white transition-colors" aria-label="Facebook">
              <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/>
              </svg>
            </a>
            <a href="#" className="text-slate-500 hover:text-white transition-colors" aria-label="Instagram">
              <svg className="h-4 w-4 text-current" stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
              </svg>
            </a>
            <a href="#" className="text-slate-500 hover:text-white transition-colors" aria-label="Twitter">
              <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
