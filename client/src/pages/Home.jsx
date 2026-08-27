import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Star, ShieldCheck, Sparkles, Wrench, Settings, ChevronRight, Phone, MessageSquare, Plus, Minus, Search, MapPin, Award, CheckCircle2, ChevronDown, Users, Clock, ShieldAlert, Lock } from 'lucide-react';
import { fetchServices, fetchReviews, submitReview, fetchGoogleReviews } from '../services/api';
import { services as fallbackServices, getOrderedServices } from '../data/services';
import { fallbackReviews } from '../data/reviews';
import { spotlightBanners, noteworthyBanners } from '../data/spotlight';
import { addToCart, removeFromCart, selectCartItems } from '../redux/cartSlice';

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const videoRef = useRef(null);

  const [servicesList, setServicesList] = useState(fallbackServices);
  const [loading, setLoading] = useState(false);
  const [heroSearchQuery, setHeroSearchQuery] = useState('');
  const [heroSuggestions, setHeroSuggestions] = useState([]);
  const [showHeroSuggestions, setShowHeroSuggestions] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);

  // Dynamic Customer Reviews State
  const [reviewsList, setReviewsList] = useState(fallbackReviews);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewService, setReviewService] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Future Google Places API integration states
  const [googleBusiness, setGoogleBusiness] = useState({
    rating: null,
    reviewsCount: null,
    reviews: [],
    profileUrl: "https://maps.google.com/?q=S+A+Raichur+Service+Point+Raichur"
  });
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleUnavailable, setGoogleUnavailable] = useState(true);

  const cartItems = useSelector(selectCartItems);
  const heroSearchRef = useRef(null);

  // Load reviews from API
  const loadReviewsData = async () => {
    if (reviewsList.length === 0) {
      setReviewsLoading(true);
    }
    try {
      const data = await fetchReviews();
      if (data.success && data.reviews) {
        setReviewsList(data.reviews);
      }
    } catch (err) {
      console.warn('Error loading customer reviews:', err);
    } finally {
      setReviewsLoading(false);
    }
  };

  // Future Google Places API integration fetch placeholder
  const loadGoogleReviewsData = async () => {
    setGoogleLoading(true);
    try {
      const data = await fetchGoogleReviews();
      if (data.success && data.configured && data.googleBusiness) {
        setGoogleBusiness(data.googleBusiness);
        setGoogleUnavailable(false);
      } else {
        setGoogleUnavailable(true);
      }
    } catch (err) {
      console.warn('Google Places API integration placeholder error:', err);
      setGoogleUnavailable(true);
    } finally {
      setGoogleLoading(false);
    }
  };

  useEffect(() => {
    loadReviewsData();
    loadGoogleReviewsData();
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const handler = (e) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    if (videoRef.current && videoRef.current.readyState >= 3) {
      setVideoLoaded(true);
    }
  }, []);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewName.trim() || !reviewComment.trim()) {
      setSubmitError('Name and comment are required.');
      return;
    }
    setSubmitLoading(true);
    setSubmitError('');
    setSubmitSuccess(false);
    try {
      const res = await submitReview({
        name: reviewName.trim(),
        rating: reviewRating,
        comment: reviewComment.trim(),
        service: reviewService
      });
      if (res.success) {
        setSubmitSuccess(true);
        setReviewName('');
        setReviewComment('');
        setReviewService('');
        setReviewRating(5);
        loadReviewsData();
      }
    } catch (err) {
      setSubmitError(err.message || 'Failed to submit review.');
    } finally {
      setSubmitLoading(false);
    }
  };

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

  // Priority IDs used in the review form dropdown (keep for review service selector)
  const priorityIds = [
    'home-deep',
    'water-tank-sump',
    'washroom-cleaning',
    'sofa-cleaning',
    'carpet-cleaning',
    'mattress-cleaning',
    'kitchen-chimney',
    'bathroom-deep',
    'floor-scrubbing',
    'pest-control',
    'solar-panel',
    'packers-movers'
  ];

  // All 12 priority services in exact client-approved order for Our Services section
  const allServicesOrder = [
    'home-deep',
    'water-tank-sump',
    'washroom-cleaning',
    'sofa-cleaning',
    'carpet-cleaning',
    'mattress-cleaning',
    'kitchen-chimney',
    'floor-scrubbing',
    'pest-control',
    'solar-panel',
    'packers-movers'
  ];
  const allServicesGrid = allServicesOrder
    .map(id => {
      const found = servicesList.find(s => s.id === id) || fallbackServices.find(s => s.id === id);
      if (!found) return null;
      if (found.id === 'sofa-cleaning') return { ...found, name: 'Sofa Cleaning' };
      return found;
    })
    .filter(Boolean);

  const handleCategoryNav = (cat) => {
    navigate(`/services?category=${cat}`);
  };

  const scrollToBookingFlow = () => {
    const target = document.getElementById('what-service-do-you-need') || document.getElementById('our-services');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
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

  // Configurable Google Reviews
  const googleReviewsConfig = {
    rating: 0, // Configurable Google Rating (set to > 0 once verified)
    totalReviews: 0, // Configurable Review Count
    mapsLink: "https://maps.google.com/?q=S+A+Raichur+Service+Point+Raichur"
  };

  // 9 Commitment Points for Why Choose Us
  const whyChoosePoints = [
    {
      title: "Trained & Experienced Team",
      desc: "Our partners are background-verified, skilled specialists with years of home maintenance and corporate sanitizing experience.",
      icon: <Users className="h-5 w-5 text-accent" />
    },
    {
      title: "Professional Cleaning Equipment",
      desc: "Equipped with heavy-duty industrial vacuum cleaners, single-disc scrubbers, and high-pressure washing jets.",
      icon: <Wrench className="h-5 w-5 text-accent" />
    },
    {
      title: "Safe & Hygienic Cleaning Products",
      desc: "We use non-toxic, child-safe, pet-friendly cleaning chemicals that effectively disinfect your environment.",
      icon: <ShieldCheck className="h-5 w-5 text-accent" />
    },
    {
      title: "Reliable Home Service",
      desc: "Rest easy knowing S A Raichur Service Point handles every request with strict professionalism and extreme care.",
      icon: <ShieldAlert className="h-5 w-5 text-accent" />
    },
    {
      title: "Affordable Pricing",
      desc: "Transparent upfront rates with zero surprise charges. We provide first-rate value tailored directly to your budget.",
      icon: <Award className="h-5 w-5 text-accent" />
    },
    {
      title: "Quality Work",
      desc: "We don't cut corners. From deep cleaning tiles to fixing plumbing lines, we guarantee a neat and durable finish.",
      icon: <Award className="h-5 w-5 text-accent" />
    },
    {
      title: "On-Time Service",
      desc: "Punctuality is our core promise. We arrive fully equipped exactly at your selected booking time slot.",
      icon: <Clock className="h-5 w-5 text-accent" />
    },
    {
      title: "Residential & Commercial Services",
      desc: "Providing home maintenance and commercial cleaning services across small apartments, villas, offices, and hotels.",
      icon: <Sparkles className="h-5 w-5 text-accent" />
    },
    {
      title: "Customer Satisfaction Focused",
      desc: "Focused entirely on client reviews. We do follow-up checks to make sure our work met your expectations.",
      icon: <CheckCircle2 className="h-5 w-5 text-accent" />
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
      
      {/* 1. Sleek Hero Section (Full-Width Background Video) */}
      <section className="relative overflow-hidden bg-slate-950 text-white py-16 lg:py-24">
        {prefersReducedMotion ? (
          <>
            {/* Blurred background image layer */}
            <img 
              src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1200&q=80" 
              alt="S A Raichur Service Point Background Blur Fallback" 
              className="absolute inset-0 w-full h-full object-cover scale-110 blur-xl opacity-30"
            />
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-slate-950/50" />
            {/* Main full image */}
            <img 
              src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1200&q=80" 
              alt="S A Raichur Service Point Background Fallback" 
              className="absolute inset-0 w-full h-full object-contain"
            />
          </>
        ) : (
          <>
            {/* Blurred background video layer */}
            <video
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              className={`absolute inset-0 w-full h-full object-cover scale-110 blur-xl transition-opacity duration-700 ${
                videoLoaded ? "opacity-50" : "opacity-0"
              }`}
            >
              <source src="/video/hero-cleaning.mp4" type="video/mp4" />
            </video>

            {/* Dark overlay */}
            <div className="absolute inset-0 bg-slate-950/50" />

            {/* Main full video */}
            <video
              ref={videoRef}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              onCanPlay={() => setVideoLoaded(true)}
              className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-700 ${
                videoLoaded ? "opacity-100" : "opacity-0"
              }`}
            >
              <source src="/video/hero-cleaning.mp4" type="video/mp4" />
            </video>
          </>
        )}

        {/* Readability overlay for Hero content */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-950/50 to-transparent z-0"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-7 sm:space-y-8 text-left">
            
            {/* Logo & Business Name Row */}
            <div className="flex items-center gap-3">
              <img 
                src="/logo.png" 
                alt="S A Raichur Service Point Official Logo" 
                className="h-16 w-auto rounded-xl object-contain border border-[#d4af37]/35 shadow-md bg-white p-1"
              />
              <div className="flex flex-col">
                <span className="text-[10px] font-extrabold text-[#d4af37] uppercase tracking-widest leading-none">Official Identity</span>
                <h1 className="font-display text-base sm:text-lg font-black text-accent tracking-wide uppercase mt-1 leading-none">
                  S A Raichur Service Point
                </h1>
              </div>
            </div>

            {/* Main Heading & Supporting Text */}
            <div className="space-y-3">
              <span className="inline-block bg-white/10 backdrop-blur-md border border-white/15 text-accent text-[9px] sm:text-[10px] font-black px-4.5 py-1 rounded-full uppercase tracking-wider select-none">
                Raichur's Professional Service Network
              </span>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight max-w-2xl">
                Your Trusted Partner for Every Home Service
              </h2>
              <p className="text-slate-200 text-xs sm:text-sm font-semibold max-w-xl leading-relaxed">
                Professional Cleaning, Maintenance & Home Services at Your Doorstep.
              </p>
            </div>

            {/* Primary Customer Actions */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => navigate('/book-service')}
                className="bg-accent hover:bg-accent-hover text-white text-xs font-black h-11 px-6 rounded-xl shadow-lg transition-all duration-200 active:scale-95 cursor-pointer"
              >
                Book a Service
              </button>
              <a
                href="tel:7411741418"
                className="bg-white/10 hover:bg-white/15 text-white text-xs font-black h-11 px-5 rounded-xl border border-white/15 transition-all flex items-center gap-1.5"
              >
                <Phone className="h-4 w-4 text-accent animate-pulse" />
                <span>Call Now</span>
              </a>
              <a
                href="https://wa.me/917411741418"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black h-11 px-5 rounded-xl transition-all flex items-center gap-1.5"
              >
                <MessageSquare className="h-4 w-4" />
                <span>WhatsApp Us</span>
              </a>
            </div>

            {/* Search box overlay */}
            <div className="max-w-xl" ref={heroSearchRef}>
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
        </div>
      </section>

      {/* Quick Contact Strip */}
      <section className="bg-white border-y border-slate-200/80 py-5 relative z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-center gap-6 md:gap-12">
          
          {/* Call Link */}
          <a
            href="tel:7411741418"
            className="flex items-center gap-2.5 text-xs sm:text-sm font-black text-slate-800 hover:text-accent transition-colors"
          >
            <div className="h-8 w-8 bg-slate-900/5 rounded-full flex items-center justify-center text-slate-905">
              <Phone className="h-4 w-4 text-accent" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[9px] text-slate-400 font-extrabold uppercase leading-none">Call Support</span>
              <span className="mt-1">074117 41418</span>
            </div>
          </a>

          {/* WhatsApp Link */}
          <a
            href="https://wa.me/917411741418"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 text-xs sm:text-sm font-black text-slate-800 hover:text-emerald-600 transition-colors"
          >
            <div className="h-8 w-8 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-650">
              <MessageSquare className="h-4 w-4 text-emerald-500" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[9px] text-slate-400 font-extrabold uppercase leading-none">WhatsApp Chat</span>
              <span className="mt-1">Connect Instantly</span>
            </div>
          </a>

          {/* Instagram Link */}
          <a
            href="https://www.instagram.com/sa_raichur_serives_point?igsi=Y2ZjdGkwdzkyMjV2"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 text-xs sm:text-sm font-black text-slate-800 hover:text-pink-600 transition-colors"
          >
            <div className="h-8 w-8 bg-pink-50 rounded-full flex items-center justify-center text-pink-650">
              <svg className="h-4 w-4 text-pink-600" stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
              </svg>
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[9px] text-slate-400 font-extrabold uppercase leading-none">Follow Us</span>
              <span className="mt-1">Official Instagram</span>
            </div>
          </a>

        </div>
      </section>

      {/* 2. App-Style Categories Panel (Urban Company Icon Grid) */}
      <section id="what-service-do-you-need" className="bg-white py-12 border-b border-slate-200/50 relative z-20 mt-0 max-w-7xl mx-auto shadow-sm">
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

      {/* 3. Our Services — Complete Catalog (all 12 priority services) */}
      <section className="py-16 bg-white border-b border-slate-200/50" id="our-services">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
            <div>
              <span className="text-[9px] font-extrabold text-accent uppercase tracking-widest block mb-1">All Services Under One Roof</span>
              <h2 className="font-display text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Our Services</h2>
              <p className="text-slate-500 text-xs font-medium mt-1.5 max-w-md">
                Professional home services in Raichur — book instantly and we'll be at your door.
              </p>
            </div>
            <button
              onClick={() => navigate('/services')}
              className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-700 text-white text-xs font-black px-5 py-2.5 rounded-xl transition-colors shrink-0 self-start sm:self-auto shadow-sm"
            >
              View All Services <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {loading && servicesList.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-14 gap-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
              <span className="text-slate-400 text-xs font-semibold">Loading services...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

              {/* Cards 1–11: regular service cards in exact priority order */}
              {allServicesGrid.map((service) => {
                const cartItem = cartItems.find(item => item.id === service.id);
                const quantity = cartItem ? cartItem.quantity : 0;
                const discount = service.originalPrice
                  ? Math.round(((service.originalPrice - service.price) / service.originalPrice) * 100)
                  : 0;
                return (
                  <div
                    key={service.id}
                    onClick={() => navigate(`/service/${service.id}`)}
                    className="w-full bg-white border border-slate-200/70 rounded-3xl overflow-hidden shadow-sm cursor-pointer hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between"
                  >
                    <div>
                      {/* Service Image */}
                      <div className="relative aspect-[16/10] overflow-hidden">
                        <img
                          src={service.image}
                          alt={service.name}
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                        />
                        {discount > 0 && (
                          <span className="absolute top-2.5 left-2.5 bg-emerald-600 text-white text-[8px] font-black px-2 py-0.5 rounded shadow-sm">
                            {discount}% OFF
                          </span>
                        )}
                      </div>

                      {/* Service Info */}
                      <div className="p-4 space-y-1.5">
                        <span className="text-[9px] font-bold text-accent uppercase tracking-wider block capitalize">{service.category}</span>
                        <h4 className="font-display text-sm font-extrabold text-slate-800 line-clamp-1 leading-snug">{service.name}</h4>
                        <p className="text-[10px] text-slate-500 font-medium line-clamp-2 leading-relaxed">{service.description}</p>

                        {/* Rating Row */}
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-500 pt-0.5">
                          <div className="flex items-center text-yellow-500 bg-yellow-50 px-1.5 py-0.5 rounded border border-yellow-100">
                            <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                            <span className="font-bold ml-0.5">{service.rating.toFixed(1)}</span>
                          </div>
                          <span>•</span>
                          <span>{service.reviewCount} reviews</span>
                        </div>
                      </div>
                    </div>

                    {/* Price + ADD Button */}
                    <div className="p-4 border-t border-slate-100 flex items-center justify-between gap-2">
                      <div className="flex flex-col">
                        <span className="text-[9px] text-slate-400 font-extrabold leading-none uppercase">Starts at</span>
                        <span className="text-xs sm:text-sm font-black text-slate-900 mt-1">
                          {service.price > 0 ? `₹${service.price}` : 'Get Quote'}
                        </span>
                      </div>
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

              {/* Card #12 — Other Home Maintenance Services (special grouped card) */}
              <div
                onClick={() => navigate('/services?category=maintenance')}
                className="w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-slate-700 rounded-3xl overflow-hidden shadow-sm cursor-pointer hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  {/* Background image with overlay */}
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80"
                      alt="Other Home Maintenance Services"
                      className="w-full h-full object-cover opacity-30 transition-transform duration-500 hover:scale-105"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Wrench className="h-10 w-10 text-white/60" />
                    </div>
                    <span className="absolute top-2.5 left-2.5 bg-white/15 backdrop-blur-sm text-white text-[8px] font-black px-2 py-0.5 rounded border border-white/20 uppercase tracking-wider">
                      Multiple Services
                    </span>
                  </div>

                  {/* Info */}
                  <div className="p-4 space-y-2">
                    <span className="text-[9px] font-bold text-accent uppercase tracking-wider block">maintenance</span>
                    <h4 className="font-display text-sm font-extrabold text-white leading-snug">Other Home Maintenance Services</h4>
                    <p className="text-[10px] text-slate-400 font-medium leading-relaxed">Expert repair & maintenance for all your home needs.</p>

                    {/* Sub-service chips */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {['AC Service & Repair', 'Plumbing', 'Electrical Work', 'Carpenter', 'Painting'].map(sub => (
                        <span
                          key={sub}
                          className="text-[8px] font-bold bg-white/10 text-slate-300 px-2 py-0.5 rounded-lg border border-white/10"
                        >
                          {sub}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-white/10 flex items-center justify-between gap-2">
                  <span className="text-[10px] text-slate-400 font-bold">5 services available</span>
                  <button className="bg-white/10 hover:bg-white/20 text-white text-[10px] font-black px-3.5 py-1.5 rounded-lg border border-white/15 transition-all flex items-center gap-1">
                    <span>VIEW ALL</span>
                    <ChevronRight className="h-3 w-3" />
                  </button>
                </div>
              </div>

            </div>
          )}
        </div>
      </section>

      {/* 4. Spotlight Banners (Offers & Special Campaigns) */}
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



      {/* 6. Why Choose Us (Sleek Dual-Column layout showcasing the official logo) */}
      <section className="py-16 bg-slate-50 border-b border-slate-200/50" id="why-choose-us">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Column: Official Logo and Tagline */}
            <div className="lg:col-span-5 text-center space-y-5 bg-white p-8 rounded-3xl border border-slate-200/60 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 h-16 w-16 bg-accent-light rounded-bl-3xl -z-0 opacity-40" />
              <div className="relative z-10">
                <img 
                  src="/logo.png" 
                  alt="S A Raichur Service Point Official Logo" 
                  className="w-48 h-auto sm:w-56 mx-auto rounded-2xl object-contain shadow-md border-2 border-slate-200/80 p-2 bg-white transition-transform duration-300 hover:scale-102"
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

              {/* Grid of Why Choose Us Points */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {whyChoosePoints.map((badge, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-2xl p-4 border border-slate-200/50 shadow-sm hover:shadow-md transition-shadow flex items-start gap-3"
                  >
                    <div className="h-9 w-9 bg-slate-900/5 flex items-center justify-center rounded-xl text-slate-900 shrink-0">
                      {badge.icon}
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="font-display text-xs font-extrabold text-slate-900">
                        {badge.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 leading-normal font-sans font-medium">
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

      {/* Dynamic Customer Reviews & Ratings Section */}
      <section className="py-16 bg-slate-50 border-b border-slate-200/50" id="reviews">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
            <span className="text-[9px] font-extrabold text-accent uppercase tracking-widest block">Customer Reviews</span>
            <h3 className="font-display text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              What Our Customers Say
            </h3>
            <p className="text-slate-500 text-xs sm:text-sm font-medium">
              Real reviews and ratings submitted by verified homeowners and businesses in Raichur.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Summary and Form */}
            <div className="lg:col-span-4 space-y-6">
              {/* Rating Summary Card */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm text-center space-y-4">
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">Overall Rating</h4>
                
                {reviewsLoading && reviewsList.length === 0 ? (
                  <div className="py-4 text-xs font-semibold text-slate-400">Loading summary...</div>
                ) : reviewsList.length > 0 ? (
                  (() => {
                    const avg = reviewsList.reduce((acc, r) => acc + r.rating, 0) / reviewsList.length;
                    return (
                      <div className="space-y-1">
                        <div className="flex items-center justify-center gap-1">
                          <span className="text-4xl font-black text-slate-900">{avg.toFixed(1)}</span>
                          <span className="text-slate-400 text-sm font-bold mt-2">/ 5.0</span>
                        </div>
                        <div className="flex items-center justify-center gap-0.5 text-yellow-500">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`h-4 w-4 ${i < Math.round(avg) ? 'fill-yellow-500 text-yellow-500' : 'text-slate-200'}`} 
                            />
                          ))}
                        </div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">
                          Based on {reviewsList.length} verified review{reviewsList.length > 1 ? 's' : ''}
                        </p>
                      </div>
                    );
                  })()
                ) : (
                  <div className="space-y-2">
                    <p className="text-sm font-bold text-slate-700">No reviews yet</p>
                    <p className="text-[10px] text-slate-400 font-medium">Be the first to share your experience with S A Raichur Service Point!</p>
                  </div>
                )}

                {/* Divider */}
                <hr className="border-slate-100 my-4" />

                {/* Google Reviews Area */}
                <div className="space-y-3">
                  <h5 className="text-[10px] font-black text-slate-800 uppercase tracking-wider block">Google Reviews</h5>
                  {googleLoading ? (
                    <p className="text-[11px] text-slate-400 font-semibold py-2">Loading Google ratings...</p>
                  ) : (!googleUnavailable && googleBusiness.rating && googleBusiness.reviewsCount) ? (
                    <div className="space-y-1">
                      <div className="flex items-center justify-center gap-1">
                        <span className="text-2xl font-black text-slate-900">{googleBusiness.rating}</span>
                        <span className="text-slate-400 text-xs font-bold mt-1">/ 5.0</span>
                      </div>
                      <div className="flex items-center justify-center gap-0.5 text-yellow-500">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-3.5 w-3.5 ${i < Math.round(googleBusiness.rating) ? 'fill-yellow-500 text-yellow-550' : 'text-slate-200'}`} 
                          />
                        ))}
                      </div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">
                        Based on {googleBusiness.reviewsCount} Google reviews
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-[11px] text-slate-500 font-medium">
                        See our customer feedback on Google
                      </p>
                    </div>
                  )}

                  <a
                    href={googleBusiness.profileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-black px-4 py-2.5 rounded-xl transition-all shadow-sm w-full justify-center select-none"
                  >
                    <svg className="h-4 w-4" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                    View us on Google &rarr;
                  </a>
                </div>
              </div>

              {/* Submit Review Form */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm space-y-4 text-left">
                <h4 className="text-xs font-black text-slate-850 uppercase tracking-wider">Submit a Review</h4>
                <form onSubmit={handleReviewSubmit} className="space-y-3.5">
                  {submitSuccess && (
                    <div className="bg-emerald-50 text-emerald-805 text-[11px] font-bold p-3 rounded-xl border border-emerald-150 animate-fade-in">
                      🎉 Review submitted successfully!
                    </div>
                  )}
                  {submitError && (
                    <div className="bg-red-50 text-red-700 text-[11px] font-bold p-3 rounded-xl border border-red-150">
                      ⚠️ {submitError}
                    </div>
                  )}

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Full Name</label>
                    <input
                      type="text"
                      required
                      value={reviewName}
                      onChange={(e) => setReviewName(e.target.value)}
                      placeholder="Your name"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:bg-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Rating</label>
                    <div className="flex gap-1.5 items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewRating(star)}
                          className="focus:outline-none"
                        >
                          <Star
                            className={`h-6 w-6 cursor-pointer transition-colors ${
                              star <= reviewRating ? 'fill-yellow-500 text-yellow-500' : 'text-slate-200 hover:text-yellow-400'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Service Availed</label>
                    <select
                      value={reviewService}
                      onChange={(e) => setReviewService(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:bg-white"
                    >
                      <option value="">Select Service (Optional)</option>
                      {priorityIds.map((id) => {
                        const s = fallbackServices.find(item => item.id === id);
                        return s ? <option key={id} value={s.name}>{s.name}</option> : null;
                      })}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Your Review</label>
                    <textarea
                      required
                      rows="3"
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="Write your review here..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:bg-white resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitLoading}
                    className="w-full bg-slate-900 hover:bg-slate-950 text-white text-xs font-black h-10 rounded-xl transition-all shadow-sm flex items-center justify-center select-none"
                  >
                    {submitLoading ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>
              </div>
            </div>

            {/* Right Column: Review List */}
            <div className="lg:col-span-8 space-y-4">
              {/* Google Business Reviews Placeholder Card */}
              <div className="bg-slate-100/50 border border-dashed border-slate-200/80 rounded-2xl p-5 text-center space-y-2">
                <div className="flex items-center justify-center gap-1.5 text-slate-450">
                  <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M21.35 11.1h-9.17v2.73h6.51c-.33 1.56-1.56 2.95-3.24 3.5v2.88h5.13c3.02-2.77 4.77-6.86 4.77-11.75 0-.61-.06-1.2-.17-1.76zM12.18 16.5c-2.48 0-4.58-1.68-5.33-3.95H1.58v2.84c1.55 3.09 4.77 5.11 8.5 5.11 2.97 0 5.46-.98 7.28-2.66l-5.13-2.88c-.98.66-2.23 1.06-3.71 1.06zM6.85 11.55c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V4.53H1.58C.59 6.5.03 8.7.03 11s.56 4.5 1.55 6.47l4.43-3.41c-.22-.66-.35-1.36-.35-2.09zM12.18 4.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 1.09 14.97 0 12.18 0 8.45 0 5.23 2.02 3.68 5.11l4.43 3.41c.75-2.27 2.85-3.95 5.33-3.95z"/>
                  </svg>
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Google Customer Reviews</span>
                </div>
                <p className="text-[11px] text-slate-450 font-medium leading-relaxed max-w-sm mx-auto">
                  Customer feedback from our Google Business profile will appear here.
                </p>
              </div>

              {reviewsLoading && reviewsList.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 gap-2 bg-white rounded-3xl border border-slate-200/60 p-8 shadow-sm">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
                  <span className="text-slate-400 text-xs font-semibold">Loading reviews...</span>
                </div>
              ) : reviewsList.length === 0 ? (
                <div className="text-center py-16 bg-white border border-slate-200/60 rounded-3xl p-8 shadow-sm max-w-md mx-auto">
                  <span className="text-4xl">⭐</span>
                  <h4 className="font-display text-base font-black text-slate-800 mt-4">No Verified Reviews Yet</h4>
                  <p className="text-slate-550 text-xs mt-1">Be the first to submit a review for our service point!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {[...reviewsList]
                    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
                    .slice(0, 3)
                    .map((rev, index) => (
                    <div
                      key={rev._id || index}
                      className="bg-white rounded-2xl p-5 border border-slate-200/60 shadow-sm text-left flex flex-col justify-between hover:shadow-md transition-shadow"
                    >
                      <div className="space-y-2">
                        {/* Rating & Date */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-0.5 text-yellow-500">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-3.5 w-3.5 ${i < rev.rating ? 'fill-yellow-500 text-yellow-500' : 'text-slate-150'}`}
                              />
                            ))}
                          </div>
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                            {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            }) : 'Recent'}
                          </span>
                        </div>

                        {/* Comment */}
                        <p className="text-xs text-slate-700 leading-relaxed font-medium">"{rev.comment}"</p>
                      </div>

                      {/* Author Info */}
                      <div className="border-t border-slate-50 pt-3 mt-3 flex items-center justify-between">
                        <div>
                          <p className="text-xs font-black text-slate-900">{rev.name}</p>
                          <p className="text-[10px] text-slate-400 font-bold">Verified Customer • Raichur</p>
                        </div>
                        {rev.service && (
                          <span className="text-[9px] font-extrabold text-accent bg-accent-light px-2.5 py-0.5 rounded-lg border border-accent/10">
                            {rev.service}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
