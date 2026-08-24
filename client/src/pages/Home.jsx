import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Star, ShieldCheck, Sparkles, Wrench, Settings, ChevronRight, Phone, MessageSquare, Plus, Minus, Search, MapPin, Award, CheckCircle2, ChevronDown } from 'lucide-react';
import { fetchServices } from '../services/api';
import { services as fallbackServices, getOrderedServices } from '../data/services';
import { spotlightBanners, noteworthyBanners } from '../data/spotlight';
import { addToCart, removeFromCart, selectCartItems } from '../redux/cartSlice';

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [servicesList, setServicesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [heroSearchQuery, setHeroSearchQuery] = useState('');
  const [heroSuggestions, setHeroSuggestions] = useState([]);
  const [showHeroSuggestions, setShowHeroSuggestions] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);

  const cartItems = useSelector(selectCartItems);
  const heroSearchRef = useRef(null);

  // Load services from API on mount
  useEffect(() => {
    const loadServices = async () => {
      try {
        const data = await fetchServices();
        if (data.success && data.services.length > 0) {
          // Apply ordered mapping strictly on frontend
          setServicesList(getOrderedServices(data.services));
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

  // Filter local suggestions for Hero Search
  useEffect(() => {
    if (!heroSearchQuery.trim()) {
      setHeroSuggestions([]);
      return;
    }
    const query = heroSearchQuery.toLowerCase();
    const filtered = servicesList.filter(s => 
      s.name.toLowerCase().includes(query) ||
      s.category.toLowerCase().includes(query) ||
      s.description.toLowerCase().includes(query)
    ).slice(0, 5);
    setHeroSuggestions(filtered);
  }, [heroSearchQuery, servicesList]);

  // Click outside listener for hero search
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (heroSearchRef.current && !heroSearchRef.current.contains(e.target)) {
        setShowHeroSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleHeroSearchSubmit = (e) => {
    e.preventDefault();
    if (heroSearchQuery.trim()) {
      setShowHeroSuggestions(false);
      navigate(`/search?query=${encodeURIComponent(heroSearchQuery.trim())}`);
    }
  };

  // Slice first 5 services as the most booked selection
  const mostBooked = servicesList.slice(0, 6);

  const handleCategoryNav = (cat) => {
    navigate(`/services?category=${cat}`);
  };

  const handleAdd = (service) => {
    dispatch(addToCart(service));
  };

  const handleRemove = (id) => {
    dispatch(removeFromCart(id));
  };

  // Emojis mapping for categories
  const categoriesList = [
    { label: 'Deep Cleaning', cat: 'cleaning', emoji: '🧹', desc: 'Sofa, home, kitchen' },
    { label: 'Tank & Sump', cat: 'cleaning', emoji: '🚰', desc: 'Overhead & sumps' },
    { label: 'AC & Repairs', cat: 'maintenance', emoji: '❄️', desc: 'AC, electrical, plumbing' },
    { label: 'Electrical Work', cat: 'maintenance', emoji: '⚡', desc: 'Switch, fan, geyser' },
    { label: 'Plumbing Service', cat: 'maintenance', emoji: '🔧', desc: 'Tap leak, pipes' },
    { label: 'Painting Service', cat: 'maintenance', emoji: '🎨', desc: 'Asian premium paints' },
    { label: 'Solar Panel Clean', cat: 'others', emoji: '☀️', desc: 'Panel washing' },
    { label: 'Packers & Movers', cat: 'others', emoji: '📦', desc: 'Household shifting' }
  ];

  const trustBadges = [
    {
      title: "Background-Verified Pros",
      desc: "Every service provider is vetted, background checked, and fully trained to maintain S A quality standards.",
      icon: <Award className="h-6 w-6 text-accent" />
    },
    {
      title: "Hygienic Tools & Solutions",
      desc: "Our cleaning partners carry high-pressure jet wash tools, scrubbers, and safe non-toxic chemicals.",
      icon: <ShieldCheck className="h-6 w-6 text-accent" />
    },
    {
      title: "Satisfaction Guarantee",
      desc: "Customer happiness is our core goal. If anything is missed, we will return and complete it cleanly.",
      icon: <CheckCircle2 className="h-6 w-6 text-accent" />
    }
  ];

  const faqs = [
    {
      q: "How do I book a home service?",
      a: "Simply select your cleaning or repair category, add the items to your cart, specify your address and schedule slot in Raichur, and submit. We also generate a WhatsApp confirmation link for fast support!"
    },
    {
      q: "How are S A Raichur partners verified?",
      a: "Our technicians and cleaning experts go through background checks, address verifications, and practical skill evaluations before getting booked on the platform."
    },
    {
      q: "When and how do I pay?",
      a: "We accept cashless UPI payments (GPay, PhonePe) or cash directly. Payments are only completed after your service request is executed and verified by you."
    },
    {
      q: "Can I reschedule or cancel a booking?",
      a: "Yes! There are no cancellation fees. You can reschedule or cancel by calling our customer helpline directly at 7411741418."
    }
  ];

  return (
    <div className="flex flex-col bg-slate-50 min-h-screen">
      
      {/* 1. Sleek Hero Search Banner (Urban Company style overlay) */}
      <section className="bg-slate-900 text-white py-16 sm:py-20 relative overflow-hidden">
        {/* Radial lights */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(0,163,196,0.15),transparent_40%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(0,82,204,0.12),transparent_45%)]" />
        
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10 space-y-6 sm:space-y-8">
          <div className="space-y-3">
            <span className="inline-block bg-white/10 backdrop-blur-md border border-white/15 text-accent text-[9px] sm:text-[10px] font-black px-4.5 py-1 rounded-full uppercase tracking-wider select-none">
              Raichur's Professional Service Network
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight max-w-2xl mx-auto">
              “Clean Homes. Trusted Service. Happy Customers.”
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm max-w-md mx-auto font-medium">
              S A Raichur Service Point — All Services Under One Roof. We provide professional home cleaning, repairs, and support across Raichur.
            </p>
          </div>

          {/* Search box overlay */}
          <div className="max-w-xl mx-auto" ref={heroSearchRef}>
            <form onSubmit={handleHeroSearchSubmit} className="flex flex-col sm:flex-row gap-2 bg-white p-2 rounded-2xl sm:rounded-xl shadow-2xl border border-white/10 text-slate-800">
              
              {/* Location indicator */}
              <div className="flex items-center gap-2 px-3 py-2 border-b sm:border-b-0 sm:border-r border-slate-100 shrink-0">
                <MapPin className="h-4 w-4 text-accent" />
                <span className="text-xs font-bold text-slate-700 whitespace-nowrap">Raichur, Karnataka</span>
              </div>

              {/* Input text */}
              <div className="relative flex-1">
                <input 
                  type="text"
                  value={heroSearchQuery}
                  onChange={(e) => {
                    setHeroSearchQuery(e.target.value);
                    setShowHeroSuggestions(true);
                  }}
                  onFocus={() => setShowHeroSuggestions(true)}
                  placeholder="Search for deep cleaning, AC repair, plumbing..."
                  className="w-full bg-transparent px-3 py-2.5 text-xs font-semibold text-slate-800 placeholder-slate-450 focus:outline-none"
                />
                <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />

                {/* Autocomplete list */}
                {showHeroSuggestions && heroSuggestions.length > 0 && (
                  <div className="absolute top-12 left-0 right-0 bg-white border border-slate-100 rounded-2xl shadow-2xl z-50 text-left overflow-hidden py-1">
                    {heroSuggestions.map(service => (
                      <div
                        key={service.id}
                        onClick={() => {
                          setShowHeroSuggestions(false);
                          setHeroSearchQuery('');
                          navigate(`/service/${service.id}`);
                        }}
                        className="px-4 py-3 hover:bg-slate-50 cursor-pointer flex items-center justify-between transition-colors border-b border-slate-50 last:border-0"
                      >
                        <div>
                          <div className="text-xs font-bold text-slate-800">{service.name}</div>
                          <div className="text-[10px] text-slate-400 capitalize mt-0.5">{service.category} • Starts at ₹{service.price}</div>
                        </div>
                        <ChevronRight className="h-3 w-3 text-slate-350" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* 2. App-Style Categories Panel (Urban Company Icon Grid) */}
      <section className="bg-white py-12 border-b border-slate-200/50 relative z-20 -mt-6 rounded-t-3xl max-w-7xl mx-auto shadow-sm">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xs mx-auto mb-8 sm:mb-10">
            <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block mb-1">Doorstep Booking</span>
            <h3 className="font-display text-lg font-black text-slate-900">What service do you need?</h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 sm:gap-6">
            {categoriesList.map((c, idx) => (
              <button
                key={idx}
                onClick={() => handleCategoryNav(c.cat)}
                className="flex flex-col items-center text-center p-3.5 bg-slate-50 border border-slate-150 hover:bg-slate-100 hover:border-slate-300 rounded-2xl transition-all group duration-200"
              >
                <div className="w-12 h-12 bg-white flex items-center justify-center rounded-xl text-2xl shadow-sm border border-slate-150 group-hover:scale-105 group-hover:shadow-md transition-all duration-200">
                  {c.emoji}
                </div>
                <span className="text-xs text-slate-850 font-black tracking-tight mt-3 mb-0.5">
                  {c.label}
                </span>
                <span className="text-[9px] text-slate-400 font-medium font-sans">
                  {c.desc}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Spotlight Banners (Offers & Special Campaigns) */}
      <section className="py-14 bg-white border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block mb-1">Curated Offers</span>
            <h2 className="font-display text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              In the spotlight
            </h2>
          </div>

          <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-thin">
            {spotlightBanners.map((banner) => (
              <div
                key={banner.id}
                onClick={() => handleCategoryNav(banner.category)}
                className="flex-shrink-0 w-80 md:w-96 bg-slate-900 rounded-3xl overflow-hidden relative aspect-[16/10] border border-slate-855 shadow-sm cursor-pointer group"
              >
                <img 
                  src={banner.image} 
                  alt={banner.title} 
                  className="w-full h-full object-cover opacity-60 transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent p-5 sm:p-6 flex flex-col justify-between text-white">
                  <span className="self-start text-[8px] font-extrabold bg-accent text-white px-2.5 py-0.5 rounded-md uppercase tracking-wider">
                    {banner.tag}
                  </span>
                  <div>
                    <h3 className="font-display text-sm sm:text-base font-black leading-snug max-w-[85%]">{banner.title}</h3>
                    <p className="text-slate-350 text-[10px] sm:text-xs mt-1.5 font-medium">{banner.desc}</p>
                    <button className="bg-white text-slate-950 text-[10px] font-black px-4 py-1.5 rounded-lg mt-3.5 transition-colors hover:bg-slate-100 flex items-center gap-1">
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

      {/* 4. Noteworthy Section (New Launches) */}
      <section className="py-14 bg-white border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block mb-1">New Launches</span>
            <h2 className="font-display text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              New and noteworthy
            </h2>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin">
            {noteworthyBanners.map((note) => (
              <div
                key={note.id}
                onClick={() => handleCategoryNav(note.category)}
                className="flex-shrink-0 w-48 bg-white border border-slate-200/50 rounded-2xl overflow-hidden shadow-sm cursor-pointer group hover:shadow-md transition-shadow"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img 
                    src={note.image} 
                    alt={note.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute top-2.5 left-2.5 bg-slate-900 text-white text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-wider">
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

      {/* 5. Most Booked Carousel Section (Displays actual service items from backend seed) */}
      <section className="py-14 bg-white border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block mb-1">Top Selections</span>
            <h2 className="font-display text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Most booked services
            </h2>
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

                // Calculate discount
                const discount = service.originalPrice 
                  ? Math.round(((service.originalPrice - service.price) / service.originalPrice) * 100)
                  : 0;

                return (
                  <div
                    key={service.id}
                    onClick={() => navigate(`/service/${service.id}`)}
                    className="flex-shrink-0 w-64 bg-white border border-slate-200/70 rounded-3xl overflow-hidden shadow-sm cursor-pointer hover:shadow-md transition-shadow flex flex-col justify-between"
                  >
                    <div>
                      {/* Image */}
                      <div className="relative aspect-[16/10] overflow-hidden">
                        <img 
                          src={service.image} 
                          alt={service.name} 
                          className="w-full h-full object-cover"
                        />
                        {discount > 0 && (
                          <span className="absolute top-2.5 left-2.5 bg-slate-900 text-white text-[8px] font-black px-2 py-0.5 rounded shadow-sm">
                            {discount}% OFF
                          </span>
                        )}
                      </div>
                      
                      {/* Details */}
                      <div className="p-4 space-y-1.5">
                        <span className="text-[9px] font-bold text-accent uppercase tracking-wider block">{service.category}</span>
                        <h4 className="font-display text-sm font-extrabold text-slate-800 line-clamp-1 leading-snug">
                          {service.name}
                        </h4>
                        
                        {/* Rating row */}
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                          <div className="flex items-center text-yellow-500 bg-yellow-50 px-1.5 py-0.5 rounded border border-yellow-100">
                            <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                            <span className="font-bold ml-0.5">{service.rating.toFixed(1)}</span>
                          </div>
                          <span>•</span>
                          <span>{service.reviewCount} reviews</span>
                        </div>
                      </div>
                    </div>

                    {/* Price and Cart controls */}
                    <div className="p-4 border-t border-slate-100 flex items-center justify-between gap-2">
                      <div className="flex flex-col">
                        <span className="text-[9px] text-slate-400 font-extrabold leading-none uppercase">Starts at</span>
                        <span className="text-sm font-black text-slate-900 mt-1">₹{service.price}</span>
                      </div>

                      {/* Add button with propagation stop */}
                      <div onClick={(e) => e.stopPropagation()}>
                        {quantity > 0 ? (
                          <div className="flex items-center bg-slate-900 text-white rounded-lg h-7 select-none font-bold text-[10px] overflow-hidden px-1">
                            <button onClick={() => handleRemove(service.id)} className="px-1.5 hover:text-accent transition-colors">
                              <Minus className="h-2.5 w-2.5" />
                            </button>
                            <span className="px-1 text-xs">{quantity}</span>
                            <button onClick={() => handleAdd(service)} className="px-1.5 hover:text-accent transition-colors">
                              <Plus className="h-2.5 w-2.5" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleAdd(service)}
                            className="bg-slate-50 hover:bg-slate-900 hover:text-white border border-slate-200 text-[10px] font-black px-3.5 py-1.5 rounded-lg shadow-sm transition-all duration-150 flex items-center gap-0.5"
                          >
                            <span>ADD</span>
                            <Plus className="h-3 w-3" />
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

      {/* 6. Why Choose Us (Sleek Dual-Column layout showcasing the official logo) */}
      <section className="py-16 bg-slate-50 border-b border-slate-200/50" id="why-choose-us">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Column: Official Logo and Tagline */}
            <div className="lg:col-span-5 text-center space-y-5 bg-white p-8 rounded-3xl border border-slate-200/60 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 h-16 w-16 bg-accent-light rounded-bl-3xl -z-0 opacity-40" />
              <div className="relative z-10">
                <img 
                  src="/logo.jpg" 
                  alt="S A Raichur Service Point Official Logo" 
                  className="w-56 h-56 sm:w-64 sm:h-64 mx-auto rounded-full object-contain shadow-xl border-4 border-[#d4af37]/45 transition-transform duration-300 hover:scale-102"
                />
              </div>
              <div className="space-y-2 relative z-10">
                <span className="text-[10px] font-extrabold text-[#d4af37] uppercase tracking-widest block">Official Brand Identity</span>
                <p className="font-display text-sm sm:text-base font-extrabold italic text-slate-850 max-w-sm mx-auto leading-relaxed">
                  “Clean Homes. Trusted Service. Happy Customers.”
                </p>
                <p className="text-[10px] font-bold text-slate-450 uppercase tracking-wider">
                  ALL SERVICES UNDER ONE ROOF • RAICHUR
                </p>
              </div>
            </div>

            {/* Right Column: Why Choose Us text and trust badges */}
            <div className="lg:col-span-7 space-y-8">
              <div>
                <span className="text-[9px] font-extrabold text-accent tracking-widest uppercase block mb-1">Our Commitment</span>
                <h3 className="font-display text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  Why S A Raichur Service Point?
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-slate-500 max-w-xl">
                  We are Raichur's leading professional services platform, connecting you with background-verified specialists using state-of-the-art tools.
                </p>
              </div>

              {/* Vertical Stack of Trust Badges */}
              <div className="space-y-4">
                {trustBadges.map((badge, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-2xl p-5 border border-slate-200/50 shadow-sm hover:shadow-md transition-shadow flex items-start gap-4"
                  >
                    <div className="h-10 w-10 bg-slate-900/5 flex items-center justify-center rounded-xl text-slate-900 shrink-0">
                      {badge.icon}
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-display text-sm font-extrabold text-slate-900">
                        {badge.title}
                      </h4>
                      <p className="text-xs text-slate-500 leading-relaxed font-sans font-medium">
                        {badge.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 7. FAQ Accordion Grid */}
      <section className="py-16 bg-white border-b border-slate-200/50">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block mb-1">FAQ Help</span>
            <h3 className="font-display text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Frequently Asked Questions
            </h3>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = activeFaq === index;
              return (
                <div 
                  key={index} 
                  className="bg-slate-50 border border-slate-200/60 rounded-2xl overflow-hidden transition-all duration-200"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : index)}
                    className="w-full flex items-center justify-between p-5 text-left text-xs sm:text-sm font-bold text-slate-800 focus:outline-none"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs text-slate-550 leading-relaxed animate-in fade-in duration-200 font-medium">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 8. Solar panel quick booking helper */}
      <section className="py-12 bg-slate-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(0,163,196,0.12),transparent_40%)] animate-pulse" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-xl text-center md:text-left space-y-2">
            <span className="inline-block bg-accent/20 border border-accent/30 text-accent text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Raichur Green Energy
            </span>
            <h3 className="font-display text-lg sm:text-xl font-black text-white leading-tight">
              Eco-Friendly Solar Panel Cleaning & Efficiency Restoration
            </h3>
            <p className="text-slate-400 text-xs leading-relaxed font-sans">
              Accumulated mud and bird droppings drop solar panel efficiency by up to 25%. Book soft-brush high-pressure wash experts today!
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto shrink-0">
            <button 
              onClick={() => navigate('/services?category=others')}
              className="bg-accent hover:bg-accent-hover text-white text-xs font-black h-11 px-6 rounded-xl shadow-lg transition-colors select-none text-center"
            >
              Explore Green Services
            </button>
            <a 
              href="tel:7411741418"
              className="bg-white/10 hover:bg-white/15 text-white text-xs font-black h-11 px-6 rounded-xl border border-white/15 transition-all flex items-center justify-center gap-1.5"
            >
              <Phone className="h-4 w-4 text-accent" />
              <span>Call 7411741418</span>
            </a>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
