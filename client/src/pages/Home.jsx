import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Star, ShieldCheck, Sparkles, Wrench, Settings, ChevronRight, Phone, MessageSquare, Plus, Minus } from 'lucide-react';
import { fetchServices } from '../services/api';
import { services as fallbackServices } from '../data/services';
import { spotlightBanners, noteworthyBanners } from '../data/spotlight';
import { addToCart, removeFromCart, selectCartItems } from '../redux/cartSlice';

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [servicesList, setServicesList] = useState([]);
  const [loading, setLoading] = useState(true);

  const cartItems = useSelector(selectCartItems);

  // Load services from API on mount
  useEffect(() => {
    const loadServices = async () => {
      try {
        const data = await fetchServices();
        if (data.success && data.services.length > 0) {
          setServicesList(data.services);
        } else {
          setServicesList(fallbackServices);
        }
      } catch (err) {
        console.warn('API error loading services, using fallback catalog:', err);
        setServicesList(fallbackServices);
      } finally {
        setLoading(false);
      }
    };
    loadServices();
  }, []);

  // Filter actual services for "Most Booked" selection
  const mostBooked = servicesList.slice(0, 5);

  const handleCategoryNav = (cat) => {
    navigate(`/services?category=${cat}`);
  };

  const handleAdd = (service) => {
    dispatch(addToCart(service));
  };

  const handleRemove = (id) => {
    dispatch(removeFromCart(id));
  };

  // Category Icon definition list matching Screenshot 2 Grid
  const doorstepCategories = [
    { label: 'Home Deep Clean', cat: 'cleaning', emoji: '🧹' },
    { label: 'Kitchen & Sump', cat: 'cleaning', emoji: '🚰' },
    { label: 'Sofa & Carpets', cat: 'cleaning', emoji: '🛋️' },
    { label: 'AC Service & Repair', cat: 'maintenance', emoji: '❄️' },
    { label: 'Plumbing Service', cat: 'maintenance', emoji: '🔧' },
    { label: 'Electrical Work', cat: 'maintenance', emoji: '⚡' },
    { label: 'Carpenter & Event Decor', cat: 'others', emoji: '🪚' },
    { label: 'Packers & Movers', cat: 'others', emoji: '📦' }
  ];

  return (
    <div className="flex flex-col bg-slate-50 min-h-screen">
      
      {/* 1. Header Stats Ribbon */}
      <div className="bg-white border-b border-slate-200/80 py-3.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-6 md:gap-12 text-slate-700 text-xs font-bold select-none">
          <div className="flex items-center gap-2">
            <div className="flex items-center text-yellow-500 bg-yellow-50 p-1 rounded-lg">
              <Star className="h-4 w-4 fill-current" />
            </div>
            <span>4.85 Service Rating in Raichur (5.2K Reviews)</span>
          </div>
          <div className="hidden sm:block text-slate-300">|</div>
          <div className="flex items-center gap-2">
            <div className="flex items-center text-primary bg-primary-light p-1 rounded-lg">
              <ShieldCheck className="h-4 w-4 text-primary" />
            </div>
            <span>15,000+ Happy Bookings Completed Locally</span>
          </div>
        </div>
      </div>

      {/* 2. Doorstep Services Main Grid Panel */}
      <section className="bg-white py-10 sm:py-14 border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Column: 8-Category Card */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 tracking-tight leading-none">
                  Home services at your doorstep
                </h1>
                <p className="text-slate-500 text-xs sm:text-sm mt-2 max-w-md">
                  Professional cleaning, repair, vehicle wash, shifting, and home maintenance delivered in Raichur.
                </p>
              </div>

              {/* Grid White Card */}
              <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-sm">
                <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block mb-4">Select Service Category</span>
                
                <div className="grid grid-cols-4 gap-3">
                  {doorstepCategories.map((c, i) => (
                    <button
                      key={i}
                      onClick={() => handleCategoryNav(c.cat)}
                      className="flex flex-col items-center text-center p-2.5 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all select-none group"
                    >
                      <div className="w-11 h-11 bg-slate-100 flex items-center justify-center rounded-2xl text-xl mb-2 transition-transform group-hover:scale-105">
                        {c.emoji}
                      </div>
                      <span className="text-[10px] text-slate-600 font-extrabold leading-tight tracking-tight break-words group-hover:text-primary">
                        {c.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: 3-Image Collage collage */}
            <div className="lg:col-span-7 grid grid-cols-12 gap-4">
              {/* Left tall card */}
              <div className="col-span-6 aspect-[4/5] rounded-3xl overflow-hidden shadow-sm border border-slate-200 relative group">
                <img 
                  src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80" 
                  alt="Home deep cleaning partner" 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-5 text-white">
                  <span className="text-[9px] font-bold text-accent tracking-widest uppercase">Verified Partners</span>
                  <h4 className="font-display text-sm font-extrabold mt-1">Deep Home Cleaning</h4>
                </div>
              </div>

              {/* Right stacked cards */}
              <div className="col-span-6 flex flex-col gap-4">
                
                <div className="flex-1 aspect-[16/10] rounded-3xl overflow-hidden shadow-sm border border-slate-200 relative group">
                  <img 
                    src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80" 
                    alt="AC Service partner at work" 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent p-4 text-white">
                    <span className="text-[8px] font-bold text-accent tracking-widest uppercase">Maintenance</span>
                    <h4 className="font-display text-xs font-extrabold mt-0.5">AC Repair & Charging</h4>
                  </div>
                </div>

                <div className="flex-1 aspect-[16/10] rounded-3xl overflow-hidden shadow-sm border border-slate-200 relative group">
                  <img 
                    src="https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&w=600&q=80" 
                    alt="Plumbing maintenance services" 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent p-4 text-white">
                    <span className="text-[8px] font-bold text-accent tracking-widest uppercase">Household</span>
                    <h4 className="font-display text-xs font-extrabold mt-0.5">Plumbing & Handyman</h4>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. "In the spotlight" horizontal banners */}
      <section className="py-12 bg-white border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex justify-between items-end">
            <div>
              <h2 className="font-display text-2xl font-black text-slate-900 tracking-tight">
                In the spotlight
              </h2>
              <p className="text-slate-500 text-xs mt-1">Special cleaning and maintenance campaigns matching seasonal demands.</p>
            </div>
          </div>

          {/* Horizontal scroll wrap */}
          <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-thin">
            {spotlightBanners.map((banner) => (
              <div
                key={banner.id}
                onClick={() => handleCategoryNav(banner.category)}
                className="flex-shrink-0 w-80 md:w-96 bg-slate-900 rounded-3xl overflow-hidden relative aspect-[16/10] border border-slate-800 shadow-sm cursor-pointer group"
              >
                <img 
                  src={banner.image} 
                  alt={banner.title} 
                  className="w-full h-full object-cover opacity-60 transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent p-5 sm:p-6 flex flex-col justify-between text-white">
                  <span className="self-start text-[8px] font-extrabold bg-accent text-white px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    {banner.tag}
                  </span>
                  <div>
                    <h3 className="font-display text-sm sm:text-base font-black leading-snug max-w-[85%]">{banner.title}</h3>
                    <p className="text-slate-300 text-[10px] sm:text-xs mt-1.5 leading-normal font-medium">{banner.desc}</p>
                    <button className="bg-white text-slate-950 text-[10px] font-black px-4 py-1.5 rounded-lg mt-3 transition-colors hover:bg-slate-100 flex items-center gap-1">
                      <span>{banner.btnText}</span>
                      <ChevronRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. "New and noteworthy" visual carousel */}
      <section className="py-12 bg-white border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <h2 className="font-display text-2xl font-black text-slate-900 tracking-tight">
              New and noteworthy
            </h2>
            <p className="text-slate-500 text-xs mt-1">Discover recently added services and local helper selections.</p>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin">
            {noteworthyBanners.map((note) => (
              <div
                key={note.id}
                onClick={() => handleCategoryNav(note.category)}
                className="flex-shrink-0 w-48 bg-white border border-slate-200/60 rounded-3xl overflow-hidden shadow-sm cursor-pointer group"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img 
                    src={note.image} 
                    alt={note.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute top-2.5 left-2.5 bg-primary text-white text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-wider">
                    {note.tag}
                  </span>
                </div>
                <div className="p-3">
                  <h4 className="font-display text-xs font-black text-slate-800 line-clamp-2 leading-snug">
                    {note.title}
                  </h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. "Most booked services" item cards carousel with cart buttons */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <h2 className="font-display text-2xl font-black text-slate-900 tracking-tight">
              Most booked services
            </h2>
            <p className="text-slate-500 text-xs mt-1">Verified deep cleaning and maintenance jobs selected by Raichur citizens.</p>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-10 gap-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
              <span className="text-slate-400 text-xs font-semibold">Syncing most booked catalog...</span>
            </div>
          ) : (
            <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-thin">
              {mostBooked.map((service) => {
                const cartItem = cartItems.find(item => item.id === service.id);
                const quantity = cartItem ? cartItem.quantity : 0;

                return (
                  <div
                    key={service.id}
                    onClick={() => navigate(`/service/${service.id}`)}
                    className="flex-shrink-0 w-64 bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-sm cursor-pointer hover:shadow-md transition-shadow flex flex-col justify-between"
                  >
                    <div>
                      {/* Image */}
                      <div className="relative aspect-[16/10] overflow-hidden">
                        <img 
                          src={service.image} 
                          alt={service.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      {/* Details */}
                      <div className="p-4 space-y-1.5">
                        <span className="text-[9px] font-bold text-accent uppercase tracking-wider">{service.category}</span>
                        <h4 className="font-display text-sm font-extrabold text-slate-800 line-clamp-1 leading-snug">
                          {service.name}
                        </h4>
                        
                        {/* Rating row */}
                        <div className="flex items-center gap-1 text-[10px] text-slate-500">
                          <div className="flex items-center text-yellow-500">
                            <Star className="h-3 w-3 fill-current" />
                            <span className="font-extrabold ml-0.5">{service.rating.toFixed(1)}</span>
                          </div>
                          <span>•</span>
                          <span>{service.reviewCount} reviews</span>
                        </div>
                      </div>
                    </div>

                    {/* Price and Cart controls */}
                    <div className="p-4 border-t border-slate-100 flex items-center justify-between gap-2">
                      <div className="flex flex-col">
                        <span className="text-[9px] text-slate-400 font-extrabold leading-none uppercase">Starts</span>
                        <span className="text-sm font-black text-slate-900 mt-0.5">₹{service.price}</span>
                      </div>

                      {/* Add button with propagation stop */}
                      <div onClick={(e) => e.stopPropagation()}>
                        {quantity > 0 ? (
                          <div className="flex items-center bg-primary text-white rounded-lg h-7 select-none font-bold text-[10px] overflow-hidden">
                            <button onClick={() => handleRemove(service.id)} className="px-2 hover:bg-primary-hover h-full transition-colors">
                              <Minus className="h-2.5 w-2.5" />
                            </button>
                            <span className="px-1">{quantity}</span>
                            <button onClick={() => handleAdd(service)} className="px-2 hover:bg-primary-hover h-full transition-colors">
                              <Plus className="h-2.5 w-2.5" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleAdd(service)}
                            className="bg-primary hover:bg-primary-hover text-white text-[10px] font-bold px-3 py-1.5 rounded-lg shadow-sm transition-colors"
                          >
                            ADD
                          </button>
                        )}
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* 6. High-impact horizontal promotion banners */}
      <section className="py-12 bg-slate-900 relative overflow-hidden border-t border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(0,163,196,0.12),transparent_40%)]" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-xl text-center md:text-left">
            <span className="inline-block bg-accent/15 border border-accent/25 text-accent text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-3">
              Raichur Solar Campaign
            </span>
            <h3 className="font-display text-xl sm:text-2xl font-black text-white leading-tight">
              Eco-Friendly Solar Panel & Water Heater Clean
            </h3>
            <p className="text-slate-400 text-xs mt-2 max-w-md leading-relaxed">
              Remove dust scaling, restore panel efficiency by up to 25%. Book certified high-pressure washing experts today.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <button 
              onClick={() => navigate('/services?category=others')}
              className="bg-primary hover:bg-primary-hover text-white text-xs font-bold h-11 px-6 rounded-xl shadow-lg transition-colors select-none text-center"
            >
              Explore Green Services
            </button>
            <a 
              href="tel:7411741418"
              className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold h-11 px-6 rounded-xl border border-slate-700 transition-all flex items-center justify-center gap-1.5"
            >
              <Phone className="h-4.5 w-4.5 text-accent" />
              <span>Call 7411741418</span>
            </a>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
