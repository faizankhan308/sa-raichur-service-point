import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Wind, Droplet } from 'lucide-react';

const PromoBanner = () => {
  const navigate = useNavigate();

  const promotions = [
    {
      title: "Festive Deep Cleaning Offer",
      subtitle: "Get your entire house scrubbed and sanitized. Eco-friendly products used.",
      badge: "20% OFF",
      icon: <Sparkles className="h-6 w-6 text-yellow-500" />,
      color: "bg-gradient-to-br from-indigo-900 to-indigo-950 text-white border border-indigo-800",
      btnColor: "bg-accent text-white hover:bg-accent-hover",
      category: "cleaning",
      targetId: "home-deep"
    },
    {
      title: "Split AC Jet Service",
      subtitle: "High cooling performance wash & diagnostic checks at just ₹499.",
      badge: "POPULAR",
      icon: <Wind className="h-6 w-6 text-cyan-400" />,
      color: "bg-gradient-to-br from-emerald-900 to-emerald-950 text-white border border-emerald-800",
      btnColor: "bg-white text-emerald-950 hover:bg-slate-100",
      category: "maintenance",
      targetId: "ac-service"
    },
    {
      title: "SINTEX Water Tank Sanitizing",
      subtitle: "6-stage high-pressure jet cleaning and UV disinfection. Keep drinking water safe.",
      badge: "HYGIENIC",
      icon: <Droplet className="h-6 w-6 text-sky-400" />,
      color: "bg-gradient-to-br from-slate-900 to-slate-950 text-white border border-slate-800",
      btnColor: "bg-primary text-white hover:bg-primary-hover",
      category: "cleaning",
      targetId: "water-tank"
    }
  ];

  const handlePromoClick = (promo) => {
    if (promo.targetId) {
      navigate(`/service/${promo.targetId}`);
    } else {
      navigate(`/services?category=${promo.category}`);
    }
  };

  return (
    <section className="py-8 bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {promotions.map((promo, idx) => (
            <div
              key={idx}
              className={`relative rounded-2xl p-6 flex flex-col justify-between overflow-hidden shadow-sm group hover:shadow-md transition-all duration-300 ${promo.color}`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2.5 bg-white/10 rounded-xl">
                    {promo.icon}
                  </div>
                  <span className="text-[10px] font-extrabold tracking-wider uppercase px-2.5 py-1 rounded-full bg-white/20 text-white">
                    {promo.badge}
                  </span>
                </div>
                <h4 className="font-display text-lg font-bold mb-2 group-hover:text-accent transition-colors">
                  {promo.title}
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed mb-6">
                  {promo.subtitle}
                </p>
              </div>
              
              <button
                onClick={() => handlePromoClick(promo)}
                className={`w-full py-2 rounded-xl text-xs font-bold transition-colors ${promo.btnColor}`}
              >
                Book Service Now
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PromoBanner;
