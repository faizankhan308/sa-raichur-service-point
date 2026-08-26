import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Sparkles, 
  Wind, 
  Wrench, 
  Zap, 
  Droplet, 
  Bug, 
  Hammer, 
  HelpCircle, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  ShoppingBag,
  Plus,
  Minus
} from 'lucide-react';
import { fetchServices } from '../services/api';
import { services as fallbackServices, getOrderedServices } from '../data/services';
import { addToCart, selectCartItems } from '../redux/cartSlice';
import { pricingConfig } from '../data/pricingConfig';

// Define categories for Step 1
const SERVICE_CATEGORIES = [
  {
    id: 'deep-cleaning',
    name: 'Deep Cleaning',
    icon: <Sparkles className="h-5 w-5 text-indigo-500" />,
    desc: 'Home, office & kitchen scrub',
    ids: ['home-deep', 'office-deep', 'commercial-cleaning', 'bathroom-deep', 'washroom-cleaning', 'kitchen-cleaning', 'kitchen-chimney', 'floor-scrubbing']
  },
  {
    id: 'sofa-cleaning',
    name: 'Sofa & Fabric Cleaning',
    icon: <Sparkles className="h-5 w-5 text-pink-500" />,
    desc: 'Sofa, carpet & mattress sanitizing',
    ids: ['sofa-cleaning', 'carpet-cleaning', 'mattress-cleaning']
  },
  {
    id: 'water-tank',
    name: 'Water Tank Cleaning',
    icon: <Droplet className="h-5 w-5 text-blue-500" />,
    desc: 'Overhead & underground sumps',
    ids: ['water-tank-sump', 'water-tank', 'underground-tank']
  },
  {
    id: 'ac-service',
    name: 'AC Service & Repair',
    icon: <Wind className="h-5 w-5 text-teal-500" />,
    desc: 'Restoring cooling & cleaning filters',
    ids: ['ac-service']
  },
  {
    id: 'plumbing',
    name: 'Plumbing Services',
    icon: <Wrench className="h-5 w-5 text-amber-500" />,
    desc: 'Leak repairs, tap fits & drainage',
    ids: ['plumbing']
  },
  {
    id: 'electrical',
    name: 'Electrical Services',
    icon: <Zap className="h-5 w-5 text-yellow-500" />,
    desc: 'Fan, switch, lighting & geysers',
    ids: ['electrical']
  },
  {
    id: 'pest-control',
    name: 'Pest Control',
    icon: <Bug className="h-5 w-5 text-rose-500" />,
    desc: 'Cockroach, bedbug & rodent control',
    ids: ['pest-control']
  },
  {
    id: 'carpentry-painting',
    name: 'Carpentry & Painting',
    icon: <Hammer className="h-5 w-5 text-emerald-500" />,
    desc: 'Furniture fixes, keys & house paints',
    ids: ['carpenter', 'painting']
  },
  {
    id: 'others',
    name: 'Other Services',
    icon: <HelpCircle className="h-5 w-5 text-slate-500" />,
    desc: 'Packers & movers, shifting, car wash',
    ids: ['solar-panel', 'solar-water-heater', 'car-wash', 'bike-wash', 'home-shifting', 'packers-movers', 'decoration-services', 'home-maintenance']
  }
];

const BookService = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cartItems = useSelector(selectCartItems);

  // Flow State
  const [step, setStep] = useState(1); // 1 = Category, 2 = Sub-Service, 3 = Options, 4 = Review
  
  const [servicesList, setServicesList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Selected details
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedService, setSelectedService] = useState(null);

  // Step 3 Configuration States
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

  // Success Feedback state
  const [addedSuccess, setAddedSuccess] = useState(false);

  useEffect(() => {
    const getServicesData = async () => {
      setLoading(true);
      try {
        const data = await fetchServices();
        if (data.success && data.services.length > 0) {
          setServicesList(getOrderedServices(data.services));
        } else {
          setServicesList(fallbackServices);
        }
      } catch (err) {
        console.warn('API error, using static list for booking wizard:', err);
        setServicesList(fallbackServices);
      } finally {
        setLoading(false);
      }
    };
    getServicesData();
  }, []);

  // Filtered services list based on category choice in Step 1
  const getSubServices = () => {
    if (!selectedCategory) return [];
    return servicesList.filter(s => selectedCategory.ids.includes(s.id));
  };

  // Pricing calculations
  const getComputedPrice = (service) => {
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

  const currentPrice = getComputedPrice(selectedService);

  const getOptionsPayload = (service) => {
    if (!service) return null;
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

    return selectedOptions;
  };

  const hasOptions = (service) => {
    if (!service) return false;
    return [
      'home-deep', 
      'water-tank-sump', 
      'water-tank', 
      'underground-tank', 
      'sofa-cleaning', 
      'carpet-cleaning', 
      'packers-movers', 
      'home-shifting', 
      'mattress-cleaning'
    ].includes(service.id);
  };

  // Navigations
  const handleSelectCategory = (cat) => {
    setSelectedCategory(cat);
    setSelectedService(null);
    setStep(2);
  };

  const handleSelectService = (service) => {
    setSelectedService(service);
    if (hasOptions(service)) {
      setStep(3);
    } else {
      setStep(4);
    }
  };

  const handleAddToCart = () => {
    if (!selectedService) return;
    const selectedOptions = getOptionsPayload(selectedService);
    
    dispatch(addToCart({
      ...selectedService,
      price: currentPrice,
      selectedOptions
    }));

    setAddedSuccess(true);
    setTimeout(() => {
      setAddedSuccess(false);
    }, 3000);
  };

  const handleBookNow = () => {
    if (!selectedService) return;
    const selectedOptions = getOptionsPayload(selectedService);
    
    dispatch(addToCart({
      ...selectedService,
      price: currentPrice,
      selectedOptions
    }));

    navigate('/booking');
  };

  // Render components for Option Selection (Step 3)
  const renderOptionsConfigurator = () => {
    if (!selectedService) return null;

    if (selectedService.id === 'home-deep') {
      const bhkOptions = ["1 BHK", "2 BHK", "3 BHK", "Duplex House", "Bungalow", "Commercial Place", "Shop", "Office"];
      return (
        <div className="space-y-4">
          <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Property Size</h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {bhkOptions.map((opt) => {
              const price = pricingConfig['home-deep'][opt];
              const isSel = selectedBhk === opt;
              return (
                <button
                  key={opt}
                  onClick={() => setSelectedBhk(opt)}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border text-center transition-all select-none ${
                    isSel 
                      ? 'bg-slate-900 border-slate-900 text-white shadow-md'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className="text-xs font-black">{opt}</span>
                  <span className={`text-[10px] mt-1.5 font-bold ${isSel ? 'text-accent' : 'text-slate-500'}`}>
                    {price > 0 ? `₹${price}` : 'Quote on Call'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      );
    }

    if (selectedService.id === 'water-tank-sump' || selectedService.id === 'water-tank' || selectedService.id === 'underground-tank') {
      const overheadOptions = ["500L", "1000L", "2000L", "5000L"];
      const undergroundOptions = ["1000L", "2000L", "5000L"];
      const activeTankType = selectedService.id === 'water-tank' ? 'overhead' : selectedService.id === 'underground-tank' ? 'underground' : tankType;

      return (
        <div className="space-y-5">
          {selectedService.id === 'water-tank-sump' && (
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Tank Setup</span>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { key: 'overhead', label: 'Overhead Tank' },
                  { key: 'underground', label: 'Underground Sump' },
                  { key: 'both', label: 'Both' }
                ].map((type) => (
                  <button
                    key={type.key}
                    onClick={() => setTankType(type.key)}
                    className={`py-2 px-3 text-xs font-bold rounded-lg border transition-all ${
                      tankType === type.key
                        ? 'bg-slate-900 border-slate-900 text-white'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Overhead Capacity Selection */}
          {(activeTankType === 'overhead' || activeTankType === 'both') && (
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Overhead Tank Capacity</span>
              <div className="grid grid-cols-4 gap-2">
                {overheadOptions.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setOverheadCapacity(opt)}
                    className={`py-2 px-3 text-xs font-bold rounded-lg border transition-all ${
                      overheadCapacity === opt
                        ? 'bg-slate-900 border-slate-900 text-white'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Underground Sump Capacity Selection */}
          {(activeTankType === 'underground' || activeTankType === 'both') && (
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Underground Sump Capacity</span>
              <div className="grid grid-cols-3 gap-2">
                {undergroundOptions.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setUndergroundCapacity(opt)}
                    className={`py-2 px-3 text-xs font-bold rounded-lg border transition-all ${
                      undergroundCapacity === opt
                        ? 'bg-slate-900 border-slate-900 text-white'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Structure Type (For Ring/Box sump checks) */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Sump Construction Structure</span>
            <div className="grid grid-cols-2 gap-3">
              {[
                { key: 'ring-type', label: 'Concrete Rings Sump', desc: 'Pre-cast circular concrete rings' },
                { key: 'box-type', label: 'Concrete Brick Box Sump', desc: 'Square/rectangular brick or RCC wall' }
              ].map((s) => (
                <button
                  key={s.key}
                  onClick={() => setStructureType(s.key)}
                  className={`p-3 text-left rounded-xl border transition-all flex flex-col gap-0.5 ${
                    structureType === s.key
                      ? 'bg-slate-900 border-slate-900 text-white shadow-sm'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-55'
                  }`}
                >
                  <span className="text-xs font-black">{s.label}</span>
                  <span className="text-[9px] text-slate-400 leading-normal font-bold">{s.desc}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      );
    }

    if (selectedService.id === 'sofa-cleaning') {
      const sofaOptions = ["1 Seater", "2 Seater", "3 Seater", "4 Seater", "5 Seater"];
      return (
        <div className="space-y-3">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Sofa Seats Capacity</span>
          <div className="grid grid-cols-5 gap-2">
            {sofaOptions.map((opt) => (
              <button
                key={opt}
                onClick={() => setSofaSeats(opt)}
                className={`py-2.5 px-3 text-xs font-black rounded-xl border transition-all ${
                  sofaSeats === opt
                    ? 'bg-slate-900 border-slate-900 text-white'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      );
    }

    if (selectedService.id === 'carpet-cleaning') {
      return (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-xs font-black text-slate-700 uppercase tracking-wide">Carpet Area Size</span>
            <span className="text-sm font-black text-slate-900">{carpetArea} Sq. Ft.</span>
          </div>
          <input 
            type="range" 
            min="20" 
            max="1000" 
            step="10"
            value={carpetArea}
            onChange={(e) => setCarpetArea(parseInt(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-extrabold uppercase">
            <span>Min: 20 sq.ft.</span>
            <span>Max: 1000 sq.ft.</span>
          </div>
        </div>
      );
    }

    if (selectedService.id === 'packers-movers' || selectedService.id === 'home-shifting') {
      const bhkOpts = ["1 BHK", "2 BHK", "3 BHK", "Duplex", "Bungalow", "Other"];
      const floorOpts = ["Ground Floor", "1st Floor", "2nd Floor", "3rd Floor", "4th Floor", "5th Floor+"];
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Home Size to Shift</span>
            <div className="grid grid-cols-3 gap-2">
              {bhkOpts.map((opt) => (
                <button
                  key={opt}
                  onClick={() => setMoversBhk(opt)}
                  className={`py-2 px-3 text-xs font-bold rounded-lg border transition-all ${
                    moversBhk === opt
                      ? 'bg-slate-900 border-slate-900 text-white'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Pickup Point Floor Level</span>
              <select
                value={pickupFloor}
                onChange={(e) => setPickupFloor(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-slate-400 font-semibold"
              >
                {floorOpts.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Drop Point Floor Level</span>
              <select
                value={dropFloor}
                onChange={(e) => setDropFloor(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-slate-400 font-semibold"
              >
                {floorOpts.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
          </div>
        </div>
      );
    }

    if (selectedService.id === 'mattress-cleaning') {
      const matOpts = ["Single", "Double", "Queen", "King"];
      return (
        <div className="space-y-3">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Mattress Size Type</span>
          <div className="grid grid-cols-4 gap-2">
            {matOpts.map((opt) => (
              <button
                key={opt}
                onClick={() => setSelectedMattressSize(opt)}
                className={`py-2.5 px-3 text-xs font-black rounded-xl border transition-all ${
                  selectedMattressSize === opt
                    ? 'bg-slate-900 border-slate-900 text-white'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      );
    }

    return null;
  };

  // Render options summary for Step 4
  const renderOptionsSummary = () => {
    if (!selectedService || !hasOptions(selectedService)) return null;

    const payload = getOptionsPayload(selectedService);
    if (!payload) return null;

    return (
      <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/50 space-y-2">
        <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wider block mb-1">Configured Customizations</span>
        {Object.entries(payload).map(([k, v]) => (
          <div key={k} className="flex justify-between text-xs font-semibold">
            <span className="text-slate-500">{k}:</span>
            <span className="text-slate-800 font-bold">{v}</span>
          </div>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600" />
        <span className="text-slate-455 text-xs font-bold uppercase tracking-wider">Loading Booking Experience...</span>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:py-12 sm:px-6 lg:px-8">
      
      {/* Header Info */}
      <div className="text-center max-w-2xl mx-auto space-y-3 mb-10">
        <span className="inline-block bg-indigo-50 border border-indigo-150 text-indigo-700 text-[10px] font-black px-4.5 py-1 rounded-full uppercase tracking-wider">
          Dedicated Booking Channel
        </span>
        <h2 className="font-display text-2xl sm:text-3xl font-black text-slate-950 tracking-tight leading-none">
          Book Your Home Service in Steps
        </h2>
        <p className="text-slate-500 text-xs sm:text-sm font-medium">
          Simply select your category, configure requirements, review transparent quote values, and book.
        </p>
      </div>

      {/* Progress Tracker */}
      <div className="mb-10 max-w-lg mx-auto">
        <div className="flex items-center justify-between relative">
          
          {/* Progress Bar Line */}
          <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-1 bg-slate-200 -z-10 rounded-full">
            <div 
              className="bg-indigo-600 h-1 rounded-full transition-all duration-300"
              style={{ width: `${((step - 1) / 3) * 100}%` }}
            />
          </div>

          {[
            { stepNum: 1, label: 'Select Service' },
            { stepNum: 2, label: 'Sub-Service' },
            { stepNum: 3, label: 'Configure' },
            { stepNum: 4, label: 'Review' }
          ].map((item) => {
            const isCompleted = step > item.stepNum;
            const isActive = step === item.stepNum;
            return (
              <div 
                key={item.stepNum} 
                className="flex flex-col items-center gap-1.5 cursor-pointer"
                onClick={() => {
                  if (item.stepNum < step) {
                    setStep(item.stepNum);
                  }
                }}
              >
                <div 
                  className={`h-9 w-9 flex items-center justify-center rounded-full text-xs font-black transition-all border ring-4 ring-slate-50 select-none ${
                    isCompleted 
                      ? 'bg-indigo-600 border-indigo-600 text-white' 
                      : isActive 
                        ? 'bg-white border-indigo-600 text-indigo-600 shadow-md scale-105' 
                        : 'bg-slate-100 border-slate-200 text-slate-400'
                  }`}
                >
                  {isCompleted ? <Check className="h-4.5 w-4.5 stroke-[3]" /> : item.stepNum}
                </div>
                <span className={`text-[9px] font-extrabold uppercase tracking-wide select-none ${isActive ? 'text-indigo-600' : 'text-slate-400'}`}>
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* WIZARD CONTAINER */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-8 min-h-[350px] relative overflow-hidden">
        
        {/* Step 1: Select Category */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div>
              <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest block mb-1">Step 1</span>
              <h3 className="font-display text-base sm:text-lg font-black text-slate-900 leading-tight">What type of service do you need?</h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {SERVICE_CATEGORIES.map((cat) => (
                <div
                  key={cat.id}
                  onClick={() => handleSelectCategory(cat)}
                  className="flex items-start gap-4 p-5 bg-slate-50 hover:bg-white rounded-2xl border border-slate-200/60 hover:border-indigo-500/40 hover:shadow-md hover:shadow-indigo-600/5 cursor-pointer transition-all duration-200 group active:scale-98"
                >
                  <div className="p-3 bg-white group-hover:bg-indigo-50/50 rounded-xl border border-slate-200/50 group-hover:border-indigo-150 transition-colors shrink-0">
                    {cat.icon}
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-black text-slate-800 group-hover:text-indigo-700 transition-colors uppercase tracking-wide">
                      {cat.name}
                    </h4>
                    <p className="text-[10px] font-semibold text-slate-450 leading-normal">{cat.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Choose Sub-service */}
        {step === 2 && selectedCategory && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-3 duration-350">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setStep(1)} 
                  className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200/50 bg-white"
                  title="Back"
                >
                  <ArrowLeft className="h-4 w-4 text-slate-600" />
                </button>
                <div>
                  <span className="text-[9px] font-bold text-indigo-500 uppercase tracking-widest block leading-none">Step 2</span>
                  <h3 className="font-display text-sm sm:text-base font-black text-slate-900 mt-1 uppercase tracking-wide">
                    {selectedCategory.name} Catalog
                  </h3>
                </div>
              </div>
              <span className="text-[10px] text-slate-400 font-extrabold uppercase">Choose one service</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {getSubServices().map((service) => {
                const isSelected = selectedService?.id === service.id;
                return (
                  <div
                    key={service.id}
                    onClick={() => handleSelectService(service)}
                    className={`p-5 rounded-2xl border transition-all cursor-pointer flex gap-4 items-start ${
                      isSelected
                        ? 'bg-indigo-50/20 border-indigo-500 shadow-sm shadow-indigo-500/5'
                        : 'bg-slate-50 border-slate-200/70 hover:bg-white hover:border-slate-355 hover:shadow-sm'
                    }`}
                  >
                    <img 
                      src={service.image} 
                      alt={service.name} 
                      className="w-16 h-16 rounded-xl object-cover border border-slate-200 bg-white shrink-0" 
                    />
                    <div className="space-y-1.5 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="text-xs font-black text-slate-850 truncate leading-none uppercase tracking-wide">{service.name}</h4>
                        {isSelected && <span className="p-0.5 bg-indigo-600 text-white rounded-full"><Check className="h-3 w-3 stroke-[2.5]" /></span>}
                      </div>
                      <p className="text-[10px] text-slate-450 line-clamp-2 leading-relaxed font-semibold">{service.description}</p>
                      <div className="text-[10px] font-bold text-slate-800">
                        {service.price > 0 ? `Starts at ₹${service.price}` : 'Quote on Call'}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 3: Option Selections */}
        {step === 3 && selectedService && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-3 duration-355">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setStep(2)} 
                  className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200/50 bg-white"
                  title="Back"
                >
                  <ArrowLeft className="h-4 w-4 text-slate-600" />
                </button>
                <div>
                  <span className="text-[9px] font-bold text-indigo-500 uppercase tracking-widest block leading-none">Step 3</span>
                  <h3 className="font-display text-sm sm:text-base font-black text-slate-900 mt-1 uppercase tracking-wide">
                    Configure: {selectedService.name}
                  </h3>
                </div>
              </div>
            </div>

            {/* Dynamic Options Configurator based on Service Id */}
            <div className="bg-slate-50/50 rounded-2xl p-5 border border-slate-200/40">
              {renderOptionsConfigurator()}
            </div>

            {/* Sub-footer price indicator and forward action */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
              <div className="text-center sm:text-left">
                <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wide block">Current Estimate</span>
                <span className="text-lg font-black text-slate-900">{currentPrice > 0 ? `₹${currentPrice}` : 'Quote on Call'}</span>
              </div>
              <button
                onClick={() => setStep(4)}
                className="w-full sm:w-auto bg-slate-900 hover:bg-slate-950 text-white text-xs font-black h-11 px-6 rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
              >
                <span>Review booking details</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Review Booking Selection */}
        {step === 4 && selectedService && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-3 duration-355">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => {
                    if (hasOptions(selectedService)) {
                      setStep(3);
                    } else {
                      setStep(2);
                    }
                  }} 
                  className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200/50 bg-white"
                  title="Back"
                >
                  <ArrowLeft className="h-4 w-4 text-slate-600" />
                </button>
                <div>
                  <span className="text-[9px] font-bold text-indigo-500 uppercase tracking-widest block leading-none">Step 4</span>
                  <h3 className="font-display text-sm sm:text-base font-black text-slate-900 mt-1 uppercase tracking-wide">
                    Final Review
                  </h3>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              
              {/* Left Column: Service Identification card */}
              <div className="md:col-span-7 space-y-4">
                <div className="bg-slate-50 rounded-2xl border border-slate-200/60 p-5 flex gap-4 items-start">
                  <img 
                    src={selectedService.image} 
                    alt={selectedService.name} 
                    className="w-20 h-20 rounded-xl object-cover border border-slate-200 bg-white" 
                  />
                  <div className="space-y-1">
                    <span className="inline-block bg-indigo-50 text-indigo-700 text-[8px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                      {selectedService.category}
                    </span>
                    <h4 className="text-sm font-black text-slate-900 leading-tight uppercase tracking-wide">{selectedService.name}</h4>
                    <p className="text-[10px] text-slate-450 leading-relaxed font-semibold">{selectedService.description}</p>
                  </div>
                </div>

                {renderOptionsSummary()}
              </div>

              {/* Right Column: Pricing & Cart actions */}
              <div className="md:col-span-5 bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-5">
                <div className="space-y-1">
                  <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wide block">Computed Quote Price</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-slate-900">
                      {currentPrice > 0 ? `₹${currentPrice}` : 'Quote on Call'}
                    </span>
                    {selectedService.originalPrice > 0 && currentPrice > 0 && (
                      <span className="text-slate-400 line-through text-xs font-semibold">₹{selectedService.originalPrice}</span>
                    )}
                  </div>
                  <p className="text-[9px] text-slate-400 font-bold leading-normal pt-1.5 border-t border-slate-100">
                    🔒 Cash or UPI payments directly to professionals post-service completion.
                  </p>
                </div>

                {/* Primary CTA button list */}
                <div className="flex flex-col gap-3">
                  <button
                    onClick={handleAddToCart}
                    className="w-full bg-white hover:bg-slate-50 text-slate-800 border border-slate-200/85 text-xs font-black h-11 rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 select-none active:scale-98"
                  >
                    <span>Add to Cart</span>
                    <Plus className="h-4 w-4 text-slate-500" />
                  </button>

                  <button
                    onClick={handleBookNow}
                    className="w-full bg-slate-900 hover:bg-slate-950 text-white text-xs font-black h-11 rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 select-none active:scale-98"
                  >
                    <span>Book Now</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>

                  {cartItems.length > 0 && (
                    <button
                      onClick={() => navigate('/cart')}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black h-11 rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 select-none"
                    >
                      <ShoppingBag className="h-4 w-4 text-accent" />
                      <span>Proceed to Cart ({cartItems.length} items)</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Success Feedback Alert banner */}
            {addedSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-150 rounded-xl text-emerald-800 text-xs font-bold text-center animate-in fade-in duration-200">
                ✅ Service added to your cart successfully! Add more services or proceed to booking.
              </div>
            )}
          </div>
        )}

      </div>
      
    </div>
  );
};

export default BookService;
