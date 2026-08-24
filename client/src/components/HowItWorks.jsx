import React from 'react';
import { Search, Calendar, Send, PhoneCall, CheckCircle } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      step: "01",
      title: "Choose a Service",
      desc: "Browse our cleaning or maintenance categories and select the specific services you need.",
      icon: <Search className="h-6 w-6 text-accent" />
    },
    {
      step: "02",
      title: "Select Date & Time",
      desc: "Choose a preferred date and morning, midday, or evening time slot that fits your schedule.",
      icon: <Calendar className="h-6 w-6 text-accent" />
    },
    {
      step: "03",
      title: "Submit Request",
      desc: "Fill in your mobile number and Raichur service address to confirm your booking.",
      icon: <Send className="h-6 w-6 text-accent" />
    },
    {
      step: "04",
      title: "Admin Confirmation",
      desc: "Our customer service team reviews the details and reaches out to confirm scheduling.",
      icon: <PhoneCall className="h-6 w-6 text-accent" />
    },
    {
      step: "05",
      title: "Service Completed",
      desc: "Our verified service partner arrives with equipment and completes the service professionally.",
      icon: <CheckCircle className="h-6 w-6 text-accent" />
    }
  ];

  return (
    <section className="py-16 bg-white border-b border-slate-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h3 className="font-display text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
            How It Works
          </h3>
          <p className="mt-3 text-sm text-slate-500">
            Booking professional home services with us takes less than 2 minutes.
          </p>
        </div>

        <div className="relative">
          {/* Connecting line on desktop */}
          <div className="hidden lg:block absolute top-1/2 left-[10%] right-[10%] h-0.5 bg-slate-200 -translate-y-12 z-0" />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 relative z-10">
            {steps.map((st, idx) => (
              <div key={idx} className="flex flex-col items-center text-center group">
                <div className="relative mb-6">
                  {/* Step bubble */}
                  <div className="w-16 h-16 bg-accent-light rounded-full border border-accent/20 flex items-center justify-center group-hover:scale-105 transition-all">
                    {st.icon}
                  </div>
                  
                  {/* Step index label */}
                  <span className="absolute -top-1.5 -right-1.5 bg-slate-900 text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded-full">
                    {st.step}
                  </span>
                </div>
                
                <h4 className="font-display text-sm font-extrabold text-slate-900 mb-2">
                  {st.title}
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed max-w-[200px]">
                  {st.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default HowItWorks;
