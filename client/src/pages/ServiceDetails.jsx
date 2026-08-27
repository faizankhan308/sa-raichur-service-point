import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Star, ShieldCheck, Clock, Check, Plus, Minus, ArrowLeft, ShoppingBag } from 'lucide-react';
import { fetchServiceById } from '../services/api';
import { services as fallbackServices } from '../data/services';
import { addToCart, removeFromCart, selectCartItems } from '../redux/cartSlice';
import { pricingConfig } from '../data/pricingConfig';

const ServiceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [service, setService] = useState(() => fallbackServices.find(s => s.id === id) || null);
  const [loading, setLoading] = useState(() => !fallbackServices.some(s => s.id === id));
  const [error, setError] = useState(null);

  const cartItems = useSelector(selectCartItems);

  // Selected options state variables
  const [selectedBhk, setSelectedBhk] = useState('1 BHK');
  
  const [tankType, setTankType] = useState('overhead'); // overhead, underground, both
  const [overheadCapacity, setOverheadCapacity] = useState('1000L');
  const [undergroundCapacity, setUndergroundCapacity] = useState('1000L');
  const [structureType, setStructureType] = useState('ring-type'); // ring-type, box-type
  
  const [sofaSeats, setSofaSeats] = useState('3 Seater');
  
  const [carpetArea, setCarpetArea] = useState(100);
  
  const [moversBhk, setMoversBhk] = useState('1 BHK');
  const [pickupFloor, setPickupFloor] = useState('Ground Floor');
  const [dropFloor, setDropFloor] = useState('Ground Floor');
  const [selectedMattressSize, setSelectedMattressSize] = useState('Double');

  // Compute price based on selections
  const getComputedPrice = () => {
    if (!service) return 0;
    
    if (service.id === 'home-deep') {
      const config = pricingConfig['home-deep'];
      return config[selectedBhk] !== undefined ? config[selectedBhk] : 0;
    }
    
    if (service.id === 'water-tank-sump' || service.id === 'water-tank' || service.id === 'underground-tank') {
      const config = pricingConfig['water-tank-sump'];
      let totalPrice = 0;
      let hasConfigured = false;
      
      const activeTankType = service.id === 'water-tank' ? 'overhead' : service.id === 'underground-tank' ? 'underground' : tankType;
      
      if (activeTankType === 'overhead' || activeTankType === 'both') {
        const p = config['overhead'][overheadCapacity];
        if (p > 0) {
          totalPrice += p;
          hasConfigured = true;
        }
      }
      if (activeTankType === 'underground' || activeTankType === 'both') {
        const p = config['underground'][undergroundCapacity];
        if (p > 0) {
          totalPrice += p;
          hasConfigured = true;
        }
      }
      
      return hasConfigured ? totalPrice : 0;
    }
    
    if (service.id === 'sofa-cleaning') {
      const config = pricingConfig['sofa-cleaning'];
      return config[sofaSeats] !== undefined ? config[sofaSeats] : 0;
    }
    
    if (service.id === 'carpet-cleaning') {
      const config = pricingConfig['carpet-cleaning'];
      if (config.ratePerSqFt > 0) {
        const calc = carpetArea * config.ratePerSqFt;
        return calc >= config.minCharge ? calc : config.minCharge;
      }
      return 0;
    }
    
    if (service.id === 'packers-movers' || service.id === 'home-shifting') {
      const config = pricingConfig['packers-movers'];
      let base = config[moversBhk] !== undefined ? config[moversBhk] : 0;
      
      if (base > 0 && config.chargePerFloor > 0) {
        const floorToNum = (floorStr) => {
          if (floorStr === 'Ground Floor') return 0;
          const match = floorStr.match(/\d+/);
          return match ? parseInt(match[0]) : 0;
        };
        const pFloor = floorToNum(pickupFloor);
        const dFloor = floorToNum(dropFloor);
        base += (pFloor + dFloor) * config.chargePerFloor;
      }
      return base;
    }

    if (service.id === 'mattress-cleaning') {
      const config = pricingConfig['mattress-cleaning'];
      return (config && config[selectedMattressSize] !== undefined) ? config[selectedMattressSize] : 0;
    }
    
    return service.price; // default fallback
  };

  const currentPrice = getComputedPrice();

  useEffect(() => {
    const fallbackItem = fallbackServices.find(s => s.id === id);
    if (fallbackItem) {
      setService(fallbackItem);
      setLoading(false);
    } else {
      setService(null);
      setLoading(true);
    }
    setError(null);

    const getDetails = async () => {
      try {
        const data = await fetchServiceById(id);
        if (data.success && data.service) {
          setService(prev => {
            const fallback = fallbackServices.find(s => s.id === id) || {};
            return {
              ...fallback,
              ...data.service,
              id: id,
              name: fallback.name || data.service.name,
              category: fallback.category || data.service.category,
              image: fallback.image || data.service.image
            };
          });
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

  const handleAdd = () => {
    let selectedOptions = null;
    if (service.id === 'home-deep') {
      selectedOptions = { "BHK Type": selectedBhk };
    } else if (service.id === 'water-tank-sump' || service.id === 'water-tank' || service.id === 'underground-tank') {
      const activeTankType = service.id === 'water-tank' ? 'overhead' : service.id === 'underground-tank' ? 'underground' : tankType;
      selectedOptions = {
        "Tank Type": activeTankType === 'both' ? "Overhead & Underground Sump" : activeTankType === 'overhead' ? "Overhead Tank" : "Underground Sump",
        "Structure": structureType === 'ring-type' ? 'Ring-type' : 'Box-type'
      };
      if (activeTankType !== 'underground') {
        selectedOptions["Overhead Capacity"] = overheadCapacity;
      }
      if (activeTankType !== 'overhead') {
        selectedOptions["Sump Capacity"] = undergroundCapacity;
      }
    } else if (service.id === 'sofa-cleaning') {
      selectedOptions = { "Seating": sofaSeats };
    } else if (service.id === 'carpet-cleaning') {
      selectedOptions = { "Area": `${carpetArea} sq. ft.` };
    } else if (service.id === 'packers-movers' || service.id === 'home-shifting') {
      selectedOptions = {
        "Property Size": moversBhk,
        "Pickup Floor": pickupFloor,
        "Drop Floor": dropFloor
      };
    } else if (service.id === 'mattress-cleaning') {
      selectedOptions = {
        "Mattress Size": selectedMattressSize
      };
    }
    
    dispatch(addToCart({
      ...service,
      price: currentPrice,
      selectedOptions
    }));
  };
  const renderOptionsPanel = () => {
    if (!service) return null;
    
    if (service.id === 'home-deep') {
      const options = ["1 BHK", "2 BHK", "3 BHK", "Duplex House", "Bungalow", "Commercial Place", "Shop", "Office"];
      return (
        <div className="bg-white rounded-3xl border border-slate-200/60 p-6 shadow-sm space-y-4">
          <h3 className="font-display text-base sm:text-lg font-black text-slate-900">Select Property Size</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {options.map((opt) => {
              const price = pricingConfig['home-deep'][opt];
              const isSelected = selectedBhk === opt;
              return (
                <button
                  key={opt}
                  onClick={() => setSelectedBhk(opt)}
                  className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all text-center select-none ${
                    isSelected
                      ? 'bg-slate-900 border-slate-900 text-white shadow-md'
                      : 'bg-slate-50 border-slate-250 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span className="text-xs font-black">{opt}</span>
                  <span className={`text-[10px] mt-1.5 font-bold ${isSelected ? 'text-accent' : 'text-slate-500'}`}>
                    {price > 0 ? `₹${price}` : 'Quote on Call'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      );
    }
    
    if (service.id === 'water-tank-sump' || service.id === 'water-tank' || service.id === 'underground-tank') {
      const overheadOptions = ["500L", "1000L", "2000L", "5000L"];
      const undergroundOptions = ["1000L", "2000L", "5000L"];
      return (
        <div className="bg-white rounded-3xl border border-slate-200/60 p-6 shadow-sm space-y-5">
          <h3 className="font-display text-base sm:text-lg font-black text-slate-900">Configure Water Storage Cleaning</h3>
          
          {/* Tank Type Toggle */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Tank Type</span>
            <div className="grid grid-cols-3 gap-2">
              {[
                { key: 'overhead', label: 'Overhead Tank' },
                { key: 'underground', label: 'Underground / Sump' },
                { key: 'both', label: 'Both Types' }
              ].map((t) => (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => setTankType(t.key)}
                  className={`px-3 py-2.5 rounded-xl border text-xs font-black text-center transition-all select-none ${
                    tankType === t.key
                      ? 'bg-slate-900 border-slate-900 text-white shadow-sm'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Structure Type Toggle */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Structure Type</span>
            <div className="grid grid-cols-2 gap-2">
              {[
                { key: 'ring-type', label: 'Ring-type Tank' },
                { key: 'box-type', label: 'Box-type Tank' }
              ].map((s) => (
                <button
                  key={s.key}
                  type="button"
                  onClick={() => setStructureType(s.key)}
                  className={`px-3 py-2.5 rounded-xl border text-xs font-black text-center transition-all select-none ${
                    structureType === s.key
                      ? 'bg-slate-900 border-slate-900 text-white shadow-sm'
                      : 'bg-slate-50 border-slate-200 text-slate-755 hover:bg-slate-100'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Capacity selections */}
          {tankType !== 'underground' && (
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Overhead Tank Capacity</span>
              <div className="grid grid-cols-4 gap-2">
                {overheadOptions.map((cap) => {
                  const price = pricingConfig['water-tank-sump']['overhead'][cap];
                  return (
                    <button
                      key={cap}
                      type="button"
                      onClick={() => setOverheadCapacity(cap)}
                      className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all select-none ${
                        overheadCapacity === cap
                          ? 'bg-slate-900 border-slate-900 text-white shadow-sm'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span className="text-xs font-black">{cap}</span>
                      <span className="text-[9px] mt-1 text-slate-400 font-bold">
                        {price > 0 ? `₹${price}` : 'Quote'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {tankType !== 'overhead' && (
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Underground Sump Capacity</span>
              <div className="grid grid-cols-3 gap-2">
                {undergroundOptions.map((cap) => {
                  const price = pricingConfig['water-tank-sump']['underground'][cap];
                  return (
                    <button
                      key={cap}
                      type="button"
                      onClick={() => setUndergroundCapacity(cap)}
                      className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all select-none ${
                        undergroundCapacity === cap
                          ? 'bg-slate-900 border-slate-900 text-white shadow-sm'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span className="text-xs font-black">{cap}</span>
                      <span className="text-[9px] mt-1 text-slate-400 font-bold">
                        {price > 0 ? `₹${price}` : 'Quote'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      );
    }
    
    if (service.id === 'sofa-cleaning') {
      const seats = ["1 Seater", "2 Seater", "3 Seater", "4 Seater", "5 Seater"];
      return (
        <div className="bg-white rounded-3xl border border-slate-200/60 p-6 shadow-sm space-y-4">
          <h3 className="font-display text-base sm:text-lg font-black text-slate-900">Select Seating Capacity</h3>
          <div className="grid grid-cols-5 gap-2">
            {seats.map((opt) => {
              const price = pricingConfig['sofa-cleaning'][opt];
              const isSelected = sofaSeats === opt;
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setSofaSeats(opt)}
                  className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all select-none ${
                    isSelected
                      ? 'bg-slate-900 border-slate-900 text-white shadow-sm'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span className="text-xs font-black">{opt}</span>
                  <span className="text-[9px] mt-1 text-slate-400 font-bold">
                    {price > 0 ? `₹${price}` : 'Quote'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      );
    }
    
    if (service.id === 'carpet-cleaning') {
      const rangeOptions = [50, 100, 150, 200, 300, 500];
      const rate = pricingConfig['carpet-cleaning'].ratePerSqFt;
      return (
        <div className="bg-white rounded-3xl border border-slate-200/60 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-base sm:text-lg font-black text-slate-900">Select Carpet Area</h3>
            <span className="text-xs font-extrabold text-accent bg-accent-light px-2.5 py-0.5 rounded-lg border border-accent/10">
              {rate > 0 ? `₹${rate} / sq. ft.` : 'Quote on Call'}
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {rangeOptions.map((area) => (
              <button
                key={area}
                type="button"
                onClick={() => setCarpetArea(area)}
                className={`px-3.5 py-2.5 rounded-xl border text-xs font-black text-center transition-all select-none ${
                  carpetArea === area
                    ? 'bg-slate-900 border-slate-900 text-white shadow-sm'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {area} sq. ft.
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <span className="text-xs font-extrabold text-slate-500 whitespace-nowrap">Or Enter Custom:</span>
            <div className="flex items-center bg-white border border-slate-200 rounded-xl overflow-hidden px-3 py-1.5 shadow-inner flex-1 max-w-[150px]">
              <input
                type="number"
                value={carpetArea}
                onChange={(e) => setCarpetArea(Math.max(1, parseInt(e.target.value) || 0))}
                className="w-full text-xs font-extrabold text-slate-800 bg-transparent focus:outline-none"
              />
              <span className="text-[10px] font-bold text-slate-400 ml-1">sq.ft.</span>
            </div>
          </div>
        </div>
      );
    }
    
    if (service.id === 'packers-movers') {
      const bhks = ["1 BHK", "2 BHK", "3 BHK", "Duplex", "Bungalow", "Other"];
      const floors = ["Ground Floor", "1st Floor", "2nd Floor", "3rd Floor", "4th Floor", "5th+ Floor"];
      return (
        <div className="bg-white rounded-3xl border border-slate-200/60 p-6 shadow-sm space-y-5">
          <h3 className="font-display text-base sm:text-lg font-black text-slate-900">Configure Shifting Details</h3>
          
          {/* Property size */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">House/Property Size</span>
            <div className="grid grid-cols-3 gap-2">
              {bhks.map((b) => {
                const price = pricingConfig['packers-movers'][b];
                return (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setMoversBhk(b)}
                    className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all select-none ${
                      moversBhk === b
                        ? 'bg-slate-900 border-slate-900 text-white shadow-sm'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span className="text-xs font-black">{b}</span>
                    <span className="text-[9px] mt-1 text-slate-450 font-bold">
                      {price > 0 ? `₹${price}` : 'Quote'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Floors Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Pickup Floor</span>
              <select
                value={pickupFloor}
                onChange={(e) => setPickupFloor(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:bg-white"
              >
                {floors.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Drop Floor</span>
              <select
                value={dropFloor}
                onChange={(e) => setDropFloor(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:bg-white"
              >
                {floors.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
          </div>

        </div>
      );
    }

    if (service.id === 'mattress-cleaning') {
      const sizes = ["Single", "Double", "Queen", "King"];
      return (
        <div className="bg-white rounded-3xl border border-slate-200/60 p-6 shadow-sm space-y-4">
          <h3 className="font-display text-base sm:text-lg font-black text-slate-900">Select Mattress Size</h3>
          <div className="grid grid-cols-4 gap-2">
            {sizes.map((opt) => {
              const price = pricingConfig['mattress-cleaning']?.[opt] || 0;
              const isSelected = selectedMattressSize === opt;
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setSelectedMattressSize(opt)}
                  className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all select-none ${
                    isSelected
                      ? 'bg-slate-900 border-slate-900 text-white shadow-sm'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span className="text-xs font-black">{opt}</span>
                  <span className="text-[9px] mt-1 text-slate-450 font-bold">
                    {price > 0 ? `₹${price}` : 'Quote'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      );
    }
    
    return null;
  };

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

          {/* Options Selection Form */}
          {renderOptionsPanel()}

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

        {/* Right Column: Pricing Summary Box */}
        <div className="lg:col-span-5">
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
                <span className="text-xl sm:text-2xl font-black text-slate-900">
                  {currentPrice > 0 ? `₹${currentPrice}` : "Contact for Quote"}
                </span>
                {service.originalPrice > 0 && currentPrice > 0 && (
                  <>
                    <span className="text-slate-400 line-through text-xs font-semibold">₹{service.originalPrice}</span>
                    <span className="text-xs font-extrabold text-emerald-650">
                      ({Math.round(((service.originalPrice - currentPrice) / service.originalPrice) * 100)}% Off)
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
