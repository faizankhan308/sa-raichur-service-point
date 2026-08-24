import React from 'react';
import { Users, Wrench, ShieldAlert, BadgeCheck, DollarSign, Award, Clock, Building, ShieldCheck } from 'lucide-react';

const WhyChooseUs = () => {
  const points = [
    {
      title: "Trained & Experienced Team",
      desc: "Our partners are background-verified, skilled specialists with years of home maintenance and corporate sanitizing experience.",
      icon: <Users className="h-6 w-6 text-primary" />
    },
    {
      title: "Professional Cleaning Equipment",
      desc: "Equipped with heavy-duty industrial vacuum cleaners, single-disc scrubbers, and high-pressure washing jets.",
      icon: <Wrench className="h-6 w-6 text-primary" />
    },
    {
      title: "Safe & Hygienic Products",
      desc: "We use non-toxic, child-safe, pet-friendly cleaning chemicals that effectively disinfect your environment.",
      icon: <ShieldCheck className="h-6 w-6 text-primary" />
    },
    {
      title: "Reliable Home Service",
      desc: "Rest easy knowing S A Raichur Service Point handles every request with strict professionalism and extreme care.",
      icon: <ShieldAlert className="h-6 w-6 text-primary" />
    },
    {
      title: "Affordable Pricing",
      desc: "Transparent upfront rates with zero surprise charges. We provide first-rate value tailored directly to your budget.",
      icon: <DollarSign className="h-6 w-6 text-primary" />
    },
    {
      title: "Quality Work",
      desc: "We don't cut corners. From deep cleaning tiles to fixing plumbing lines, we guarantee a neat and durable finish.",
      icon: <Award className="h-6 w-6 text-primary" />
    },
    {
      title: "On-Time Service",
      desc: "Punctuality is our core promise. We arrive fully equipped exactly at your selected booking time slot.",
      icon: <Clock className="h-6 w-6 text-primary" />
    },
    {
      title: "Residential & Commercial",
      desc: "Providing home maintenance and commercial cleaning services across small apartments, villas, offices, and hotels.",
      icon: <Building className="h-6 w-6 text-primary" />
    },
    {
      title: "Customer Satisfaction",
      desc: "Focused entirely on client reviews. We do follow-up checks to make sure our work met your expectations.",
      icon: <BadgeCheck className="h-6 w-6 text-primary" />
    }
  ];

  return (
    <section className="py-16 bg-slate-100 border-y border-slate-200" id="why-choose-us">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h3 className="font-display text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
            Why Choose S A Raichur Service Point?
          </h3>
          <p className="mt-3 text-sm text-slate-500">
            Raichur's premier local service marketplace. We focus on quality equipment, verified partners, and upfront pricing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {points.map((pt, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md border border-slate-200/60 flex items-start gap-4 transition-all"
            >
              <div className="p-3 bg-primary-light rounded-xl shrink-0">
                {pt.icon}
              </div>
              <div>
                <h4 className="font-display text-sm font-extrabold text-slate-900 mb-1">
                  {pt.title}
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {pt.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default WhyChooseUs;
