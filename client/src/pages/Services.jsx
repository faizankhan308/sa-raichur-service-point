import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Sparkles, Wrench, Settings, Star, CheckCircle, Clock, Plus, Minus, ArrowRight, ShieldCheck, ShoppingBag } from 'lucide-react';
import { fetchServices } from '../services/api';
import { services as fallbackServices, getOrderedServices } from '../data/services';
import { addToCart, removeFromCart, selectCartItems, selectCartTotal } from '../redux/cartSlice';

const Services = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category') || 'all';

  const [servicesList, setServicesList] = useState([]);
  const [loading, setLoading] = useState(true);

  const cartItems = useSelector(selectCartItems);
  const cartTotal = useSelector(selectCartTotal);

  useEffect(() => {
    const getServicesData = async () => {
      setLoading(true);
      try {
        const data = await fetchServices();
        if (data.success && data.services.length > 0) {
          // Apply ordered mapping strictly on frontend
          setServicesList(getOrderedServices(data.services));
        } else {
          setServicesList(fallbackServices);
        }
      } catch (err) {
        console.warn('API error, using filtered static list:', err);
        setServicesList(fallbackServices);
      } finally {
        setLoading(false);
      }
    };
    getServicesData();
  }, []);

  const handleCategorySelect = (category) => {
    if (category === 'all') {
      searchParams.delete('category');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ category });
    }
  };

  const handleAdd = (service) => {
    dispatch(addToCart(service));
  };

  const handleRemove = (id) => {
    dispatch(removeFromCart(id));
  };

  // Group mappings
  const categories = [
    { key: 'all', label: 'All Services', icon: <Sparkles className="h-4 w-4" /> },
    { key: 'cleaning', label: 'Cleaning Services', icon: <Sparkles className="h-4 w-4" /> },
    { key: 'maintenance', label: 'Home Maintenance Services', icon: <Wrench className="h-4 w-4" /> },
    { key: 'others', label: 'Other Services', icon: <Settings className="h-4 w-4" /> }
  ];

  const cleaningIds = [
    'home-deep',
    'office-deep',
    'commercial-cleaning',
    'bathroom-deep',
    'washroom-cleaning',
    'sofa-cleaning',
    'carpet-cleaning',
    'mattress-cleaning',
    'kitchen-cleaning',
    'kitchen-chimney',
    'water-tank',
    'underground-tank',
    'floor-scrubbing'
  ];

  const maintenanceIds = [
    'ac-service',
    'plumbing',
    'electrical',
    'carpenter',
    'painting',
    'pest-control'
  ];

  const otherIds = [
    'solar-panel',
    'solar-water-heater',
    'car-wash',
    'bike-wash',
    'home-shifting',
    'packers-movers',
    'decoration-services'
  ];

  // Get active IDs based on categoryParam
  let activeIds = [];
  if (categoryParam === 'all') {
    activeIds = [...cleaningIds, ...maintenanceIds, ...otherIds];
  } else if (categoryParam === 'cleaning') {
    activeIds = cleaningIds;
  } else if (categoryParam === 'maintenance') {
    activeIds = maintenanceIds;
  } else if (categoryParam === 'others') {
    activeIds = otherIds;
  }

  // Filter and order services List strictly
  const filteredServices = activeIds
    .map(id => servicesList.find(s => s.id === id) || fallbackServices.find(s => s.id === id))
    .filter(Boolean);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 relative min-h-screen pb-28">
      
      {/* Page Header */}
      <div className="mb-8">
        <span className="text-[9px] font-extrabold text-accent uppercase tracking-widest block mb-1">Service Catalog</span>
        <h2 className="font-display text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Professional Services
        </h2>
        <p className="text-slate-500 text-xs sm:text-sm mt-1 max-w-xl font-medium">
          Transparent pricing. Background-verified professionals. Book cleaning, repair, vehicle, shifting and solar maintenance in minutes.
        </p>
      </div>

      {/* Category Filter Tabs (Horizontal list on mobile/tablet) */}
      <div className="flex flex-wrap gap-2.5 mb-8 border-b border-slate-200/60 pb-5">
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => handleCategorySelect(cat.key)}
            className={`flex items-center gap-2 px-4.5 py-2.5 rounded-xl text-xs font-bold transition-all border select-none ${
              categoryParam === cat.key
                ? 'bg-slate-900 border-slate-900 text-white shadow-md shadow-slate-900/10'
                : 'bg-white border-slate-200 text-slate-650 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            {cat.icon}
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Main Dual-Column Layout */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-slate-900" />
          <span className="text-slate-400 text-xs font-semibold">Loading service details...</span>
        </div>
      ) : filteredServices.length === 0 ? (
        <div className="text-center py-16 bg-white border border-slate-200 rounded-3xl p-8 max-w-md mx-auto shadow-sm">
          <span className="text-4xl">🔍</span>
          <h3 className="font-display text-base font-black text-slate-800 mt-4">No Services Found</h3>
          <p className="text-slate-500 text-xs mt-1">We couldn't find any services matching this selection.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Quick category guide list (visible on desktop) */}
          <div className="hidden lg:block lg:col-span-3 sticky top-24 bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm space-y-4">
            <span className="text-[9px] font-extrabold text-slate-450 uppercase tracking-widest block border-b border-slate-100 pb-2">Jump to category</span>
            <div className="flex flex-col gap-1 text-xs font-bold text-slate-600">
              {categories.map((c) => (
                <button
                  key={c.key}
                  onClick={() => handleCategorySelect(c.key)}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl transition-colors select-none ${
                    categoryParam === c.key
                      ? 'bg-slate-900 text-white font-extrabold'
                      : 'hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: List of services in Urban Company row layout */}
          <div className="lg:col-span-9 space-y-6">
            {filteredServices.map((service) => {
              const cartItem = cartItems.find(item => item.id === service.id);
              const quantity = cartItem ? cartItem.quantity : 0;
              const discount = service.originalPrice
                ? Math.round(((service.originalPrice - service.price) / service.originalPrice) * 100)
                : 0;

              return (
                <div
                  key={service.id}
                  className="bg-white rounded-3xl border border-slate-200/60 p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row gap-6 justify-between relative group"
                >
                  {/* Left Column: Text description, pricing, ratings, inclusions */}
                  <div className="flex-1 space-y-3.5">
                    
                    {/* Header tags */}
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-extrabold text-accent uppercase tracking-widest">
                        {service.category}
                      </span>
                      <span className="text-slate-350 text-[10px]">•</span>
                      <div className="flex items-center gap-0.5 text-yellow-500 text-[10px]">
                        <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                        <span className="font-extrabold">{service.rating.toFixed(1)}</span>
                        <span className="text-slate-450 font-medium ml-1">({service.reviewCount} reviews)</span>
                      </div>
                    </div>

                    {/* Title */}
                    <div>
                      <Link 
                        to={`/service/${service.id}`}
                        className="font-display text-base sm:text-lg font-black text-slate-900 hover:text-primary transition-colors block leading-snug"
                      >
                        {service.name}
                      </Link>
                      
                      <div className="flex items-baseline gap-2 mt-1.5">
                        <span className="text-sm sm:text-base font-black text-slate-900">
                          {service.price > 0 ? `₹${service.price}` : "Contact for Quote"}
                        </span>
                        {service.originalPrice > 0 && (
                          <>
                            <span className="text-xs text-slate-400 line-through">₹{service.originalPrice}</span>
                            <span className="text-[10px] font-extrabold text-emerald-600">({discount}% OFF)</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Key details list (bulleted) */}
                    {service.inclusions && service.inclusions.length > 0 && (
                      <ul className="space-y-1.5 text-xs text-slate-550 border-t border-slate-50 pt-3">
                        {service.inclusions.slice(0, 3).map((inc, i) => (
                          <li key={i} className="flex items-start gap-2 leading-relaxed">
                            <CheckCircle className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                            <span>{inc}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    <div className="flex items-center gap-4 text-[10px] text-slate-400 font-bold uppercase tracking-wider pt-2">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-slate-350" />
                        <span>⏱️ 1-3 hrs</span>
                      </span>
                      <span>•</span>
                      <Link 
                        to={`/service/${service.id}`}
                        className="text-primary hover:underline font-extrabold"
                      >
                        View Full Details
                      </Link>
                    </div>

                  </div>

                  {/* Right Column: Square Image with overlapping ADD counter */}
                  <div className="w-full sm:w-40 flex flex-col items-center justify-start shrink-0 relative">
                    <div className="w-full aspect-[4/3] sm:aspect-square bg-slate-100 rounded-2xl overflow-hidden border border-slate-150 relative">
                      <img 
                        src={service.image} 
                        alt={service.name} 
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>

                    {/* Overlapping ADD button */}
                    <div className="absolute -bottom-2.5 h-8.5 w-28 shadow-lg z-10">
                      {quantity > 0 ? (
                        <div className="flex items-center justify-between bg-slate-900 text-white rounded-xl h-full w-full px-3 text-xs font-black">
                          <button 
                            onClick={() => handleRemove(service.id)} 
                            className="p-1 hover:text-accent transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="px-1 text-xs select-none">{quantity}</span>
                          <button 
                            onClick={() => handleAdd(service)} 
                            className="p-1 hover:text-accent transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleAdd(service)}
                          className="w-full h-full bg-white text-slate-850 hover:bg-slate-900 hover:text-white border border-slate-200/80 hover:border-slate-900 text-xs font-black rounded-xl transition-all shadow-md flex items-center justify-center gap-1 select-none"
                        >
                          <span>ADD</span>
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* Floating Bottom Bar (UC styled Checkout Reminder) */}
      {cartItems.length > 0 && (
        <div className="fixed bottom-0 inset-x-0 bg-white border-t border-slate-250/80 shadow-2xl z-40 py-4 px-4 sm:px-6 transition-all duration-300 animate-in slide-in-from-bottom-5">
          <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-slate-900 text-white flex items-center justify-center rounded-xl shadow-md">
                <ShoppingBag className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-xs font-black text-slate-900">
                  ₹{cartTotal} <span className="text-[10px] text-slate-400 font-bold">(Excl. Taxes)</span>
                </p>
                <p className="text-[10px] text-slate-500 font-bold mt-0.5">
                  {cartItems.length} Service{cartItems.length > 1 ? 's' : ''} added in cart
                </p>
              </div>
            </div>

            <Link
              to="/cart"
              className="bg-primary hover:bg-primary-hover text-white text-xs font-black h-10 px-5 rounded-xl flex items-center gap-1.5 shadow-md shadow-primary/10 transition-all select-none"
            >
              <span>Review Booking</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      )}

    </div>
  );
};

export default Services;
