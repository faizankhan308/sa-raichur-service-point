import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Star, ShieldCheck, Clock, Check, Plus, Minus, ArrowLeft, ShoppingBag } from 'lucide-react';
import { fetchServiceById } from '../services/api';
import { services as fallbackServices } from '../data/services';
import { addToCart, removeFromCart, selectCartItems } from '../redux/cartSlice';

const ServiceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const cartItems = useSelector(selectCartItems);

  useEffect(() => {
    const getDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchServiceById(id);
        if (data.success && data.service) {
          setService(data.service);
        } else {
          loadFallbackDetails();
        }
      } catch (err) {
        console.warn('API error, seeking fallback service details:', err);
        loadFallbackDetails();
      } finally {
        setLoading(false);
      }
    };
    getDetails();
  }, [id]);

  const loadFallbackDetails = () => {
    const item = fallbackServices.find(s => s.id === id);
    if (item) {
      setService(item);
    } else {
      setError('Service not found in catalog.');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-slate-900" />
        <span className="text-slate-400 text-xs font-semibold">Loading service details...</span>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="mx-auto max-w-xl text-center py-20 px-4">
        <span className="text-4xl">⚠️</span>
        <h3 className="font-display text-base font-black text-slate-800 mt-4">{error || 'Something went wrong'}</h3>
        <button onClick={() => navigate('/services')} className="bg-slate-900 text-white text-xs font-bold px-5 py-2.5 rounded-xl mt-6 shadow-sm">
          Back to Services
        </button>
      </div>
    );
  }

  // Cart operations check
  const cartItem = cartItems.find(item => item.id === service.id);
  const quantity = cartItem ? cartItem.quantity : 0;

  const handleAdd = () => dispatch(addToCart(service));
  const handleRemove = () => dispatch(removeFromCart(service.id));

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 relative min-h-screen">
      
      {/* Back button */}
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 font-bold mb-6 transition-colors select-none"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to catalog</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        
        {/* Left Column: Image, Inclusions, Benefits */}
        <div className="lg:col-span-7 space-y-6">
          <div className="relative aspect-video rounded-3xl overflow-hidden shadow-sm border border-slate-200/60 bg-slate-100">
            <img 
              src={service.image} 
              alt={service.name} 
              className="w-full h-full object-cover"
            />
          </div>

          {/* Description */}
          <div className="bg-white rounded-3xl border border-slate-200/60 p-6 shadow-sm space-y-3">
            <h3 className="font-display text-base sm:text-lg font-black text-slate-900">Service Description</h3>
            <p className="text-xs sm:text-sm text-slate-550 leading-relaxed font-medium">{service.description}</p>
          </div>

          {/* Inclusions */}
          {service.inclusions && service.inclusions.length > 0 && (
            <div className="bg-white rounded-3xl border border-slate-200/60 p-6 shadow-sm space-y-4">
              <h3 className="font-display text-base sm:text-lg font-black text-slate-900">What's Included</h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {service.inclusions.map((inc, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs text-slate-650 font-medium">
                    <Check className="h-4.5 w-4.5 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{inc}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Benefits */}
          {service.benefits && service.benefits.length > 0 && (
            <div className="bg-white rounded-3xl border border-slate-200/60 p-6 shadow-sm space-y-4">
              <h3 className="font-display text-base sm:text-lg font-black text-slate-900">Key Benefits</h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {service.benefits.map((ben, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs text-slate-650 font-medium">
                    <ShieldCheck className="h-4.5 w-4.5 text-accent shrink-0 mt-0.5" />
                    <span>{ben}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Right Column: Sticky Pricing Summary Box */}
        <div className="lg:col-span-5 lg:sticky lg:top-24">
          <div className="bg-white rounded-3xl border border-slate-200/60 shadow-sm p-6 space-y-6">
            
            <div className="space-y-2">
              <span className="inline-block text-[9px] font-extrabold text-accent tracking-widest uppercase px-3 py-1 bg-accent-light rounded-lg border border-accent/10">
                {service.category}
              </span>
              
              <h2 className="font-display text-xl sm:text-2xl font-black text-slate-950 leading-tight">
                {service.name}
              </h2>
              
              <div className="flex items-center gap-1.5 pt-1">
                <div className="flex items-center gap-0.5 text-yellow-500 bg-yellow-50 px-2 py-0.5 rounded-md border border-yellow-100">
                  <Star className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" />
                  <span className="text-xs font-bold mt-0.5">{service.rating.toFixed(1)}</span>
                </div>
                <span className="text-slate-350 text-xs">•</span>
                <span className="text-slate-450 text-xs font-bold">({service.reviewCount} Verified Ratings)</span>
              </div>
            </div>

            {/* Price Box */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/50 space-y-1">
              <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wide leading-none block">Upfront Pricing</span>
              <div className="flex items-baseline gap-2.5">
                <span className="text-xl sm:text-2xl font-black text-slate-900">₹{service.price}</span>
                {service.originalPrice && (
                  <>
                    <span className="text-slate-400 line-through text-xs font-semibold">₹{service.originalPrice}</span>
                    <span className="text-xs font-extrabold text-emerald-650">
                      ({Math.round(((service.originalPrice - service.price) / service.originalPrice) * 100)}% Off)
                    </span>
                  </>
                )}
              </div>
              <p className="text-[10px] text-slate-400 font-bold leading-normal pt-1.5 border-t border-slate-200/40">
                💸 Payments are made directly to the partner (Cash or UPI) after service completion.
              </p>
            </div>

            {/* Cart Actions */}
            <div className="flex flex-col gap-3">
              {quantity > 0 ? (
                <div className="flex items-center justify-between bg-slate-900 text-white rounded-xl h-12 w-full px-4 text-xs font-black shadow-md">
                  <button onClick={handleRemove} className="p-2 hover:text-accent rounded transition-colors" aria-label="Decrease quantity">
                    <Minus className="h-4.5 w-4.5" />
                  </button>
                  <span className="text-xs">{quantity} Service{quantity > 1 ? 's' : ''} added</span>
                  <button onClick={handleAdd} className="p-2 hover:text-accent rounded transition-colors" aria-label="Increase quantity">
                    <Plus className="h-4.5 w-4.5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleAdd}
                  className="w-full bg-slate-900 hover:bg-slate-950 text-white text-xs font-black h-12 rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 select-none"
                >
                  <span>Add to cart</span>
                  <Plus className="h-4 w-4" />
                </button>
              )}

              {cartItems.length > 0 && (
                <Link
                  to="/cart"
                  className="w-full bg-primary hover:bg-primary-hover text-white text-xs font-black h-12 rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm"
                >
                  <ShoppingBag className="h-4.5 w-4.5 text-accent" />
                  <span>Review Cart ({cartItems.length} items)</span>
                </Link>
              )}
            </div>

            {/* Service Guidelines */}
            <ul className="text-[10px] text-slate-450 space-y-2 border-t border-slate-100 pt-4 font-semibold uppercase tracking-wider">
              <li className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-slate-400 shrink-0" />
                <span>Typical service duration: 1 to 3 hours</span>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-slate-400 shrink-0" />
                <span>Standard S A service guarantee protection</span>
              </li>
            </ul>

          </div>
        </div>

      </div>
    </div>
  );
};

export default ServiceDetails;
