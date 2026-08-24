import React from 'react';
import { Link } from 'react-router-dom';
import ServiceCard from './ServiceCard';

const ServiceSection = ({ title, categoryKey, services }) => {
  return (
    <div className="py-8 border-b border-slate-100 last:border-b-0">
      
      {/* Header bar: Title and See All link */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-display text-lg font-black text-slate-800 tracking-tight sm:text-xl capitalize">
          {title}
        </h3>
        <Link 
          to={`/services?category=${categoryKey}`} 
          className="text-xs font-bold text-primary hover:underline hover:text-primary-hover shrink-0"
        >
          See All &rarr;
        </Link>
      </div>

      {/* Cards container: Horizontal scroll on mobile, responsive grid on desktop */}
      <div className="relative">
        <div className="flex gap-5 overflow-x-auto pb-4 scrollbar-none -mx-4 px-4 md:-mx-0 md:px-0 md:grid md:grid-cols-2 lg:grid-cols-4 md:overflow-x-visible md:pb-0">
          {services.slice(0, 4).map((service) => (
            <div 
              key={service.id} 
              className="w-[260px] shrink-0 md:w-auto md:shrink"
            >
              <ServiceCard service={service} />
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default ServiceSection;
