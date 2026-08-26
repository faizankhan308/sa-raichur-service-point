import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Search, ShoppingCart, User, MapPin, Menu, X, LogOut, ChevronDown, Bell, HelpCircle, Lock, ArrowRight } from 'lucide-react';
import { selectCartCount } from '../redux/cartSlice';
import { selectAuth, logout } from '../redux/authSlice';
import { selectBookings, fetchBookingsSuccess } from '../redux/bookingSlice';
import { fetchServices, fetchAdminBookings } from '../services/api';
import { getOrderedServices } from '../data/services';
import RoleSelectionModal from './RoleSelectionModal';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  
  const cartCount = useSelector(selectCartCount);
  const { isAuthenticated, username, token } = useSelector(selectAuth);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [userRole, setUserRole] = useState(localStorage.getItem('userRole') || '');
  
  const searchRef = useRef(null);
  const profileRef = useRef(null);

  const bookings = useSelector(selectBookings);
  const isLoginPage = location.pathname === '/login';

  // Fetch admin bookings count for notifications
  useEffect(() => {
    if (isAuthenticated && token) {
      const loadBookings = async () => {
        try {
          const data = await fetchAdminBookings(token);
          if (data.success && data.bookings) {
            dispatch(fetchBookingsSuccess(data.bookings));
          }
        } catch (err) {
          console.error('Navbar failed to load bookings count:', err);
        }
      };
      loadBookings();
    }
  }, [isAuthenticated, token, dispatch]);

  const newBookingsCount = bookings.filter(b => b.status === 'New').length;

  // Clear customer role selection once authenticated
  useEffect(() => {
    if (isAuthenticated) {
      localStorage.removeItem('userRole');
      setUserRole('');
    }
  }, [isAuthenticated]);

  // Close suggestions and user dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowUserDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Fetch and filter search suggestions dynamically (ordered)
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      try {
        const data = await fetchServices('', searchQuery);
        let servicesList = [];
        if (data.success && data.services.length > 0) {
          servicesList = data.services;
        }
        
        // Filter and order search result items strictly from the 15 services list
        const ordered = getOrderedServices(servicesList);
        const queryTerm = searchQuery.toLowerCase();
        
        const filteredSuggestions = ordered.filter(s => 
          s.name.toLowerCase().includes(queryTerm) || 
          s.category.toLowerCase().includes(queryTerm) ||
          s.description.toLowerCase().includes(queryTerm)
        ).slice(0, 5);

        setSuggestions(filteredSuggestions);
      } catch (err) {
        console.error(err);
      }
    }, 200);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSuggestions(false);
      navigate(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleSuggestionClick = (serviceId) => {
    setShowSuggestions(false);
    setSearchQuery('');
    navigate(`/service/${serviceId}`);
  };

  const handleLogout = () => {
    if (isAuthenticated) {
      dispatch(logout());
    }
    localStorage.removeItem('userRole');
    setUserRole('');
    navigate('/');
  };

  const handleProfileClick = () => {
    if (isAuthenticated || userRole === 'customer') {
      setShowUserDropdown(!showUserDropdown);
    } else {
      setIsRoleModalOpen(true);
    }
  };

  const handleSelectCustomer = () => {
    localStorage.setItem('userRole', 'customer');
    setUserRole('customer');
    navigate('/');
  };

  const handleSelectAdmin = () => {
    localStorage.removeItem('userRole');
    setUserRole('');
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md transition-all duration-200">
      <div className="mx-auto flex max-w-7xl h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Left: Brand Logo (Showcasing the official detailed circular logo) */}
        <Link to="/" className="flex items-center gap-3 group shrink-0">
          <div className="relative group-hover:scale-105 transition-transform duration-200 shrink-0">
            <img 
              src="/logo.png" 
              alt="S A Raichur Service Point Logo" 
              className="h-12 w-auto rounded-md object-contain border border-slate-200/80 shadow-sm bg-white p-0.5"
            />
            <div className="absolute -bottom-0.5 -right-1 h-2.5 w-2.5 rounded-full bg-emerald-500 border border-white shadow-sm" />
          </div>
          
          <div className="flex flex-col select-none">
            <h1 className="font-display text-xs sm:text-sm font-black tracking-tight text-slate-950 leading-none group-hover:text-[#0052cc] transition-colors">
              S A RAICHUR
            </h1>
            <span className="font-display text-[8px] font-black tracking-widest text-[#d4af37] leading-none mt-1.5 uppercase">
              SERVICE POINT
            </span>
          </div>
        </Link>

        {/* Center: Search & Location (Urban Company inspired) */}
        <div className="hidden md:flex items-center flex-1 max-w-xl mx-8 gap-3" ref={searchRef}>
          
          {/* Location box */}
          <div className="flex items-center gap-2 bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-200/60 text-xs font-semibold text-slate-700 w-48 justify-between shrink-0 hover:bg-slate-100/50 transition-colors">
            <div className="flex items-center gap-1.5 min-w-0">
              <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
              <span className="truncate text-slate-800 font-bold">Raichur, Karnataka</span>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400 shrink-0" />
          </div>

          {/* Search bar */}
          <form onSubmit={handleSearchSubmit} className="relative flex-1">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                placeholder="Search for 'AC service', deep cleaning..."
                className="w-full bg-slate-50 border border-slate-200/60 rounded-xl py-2.5 pl-10 pr-4 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-slate-300 focus:ring-4 focus:ring-slate-100 transition-all duration-200"
              />
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            </div>

            {/* Suggestions Autocomplete */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-12 left-0 right-0 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden py-1 animate-in fade-in slide-in-from-top-1 duration-150">
                <div className="px-4 py-1.5 text-[9px] font-bold text-slate-400 uppercase tracking-wider select-none border-b border-slate-50">Suggestions</div>
                {suggestions.map((service) => (
                  <div
                    key={service.id}
                    onClick={() => handleSuggestionClick(service.id)}
                    className="flex items-center justify-between px-4 py-3 hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-850 truncate">{service.name}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5 capitalize">{service.category} • Starts at ₹{service.price}</div>
                    </div>
                    <ChevronDown className="h-3 w-3 text-slate-300 -rotate-90" />
                  </div>
                ))}
              </div>
            )}
          </form>
        </div>

        {/* Right: Actions Menu */}
        <div className="flex items-center gap-3 sm:gap-4">
          <nav className="hidden lg:flex items-center gap-6 text-xs font-bold text-slate-650 tracking-wide uppercase mr-2">
            <Link to="/services" className="hover:text-slate-900 transition-colors">Services</Link>
            <Link to="/services?category=cleaning" className="hover:text-slate-900 transition-colors">Cleaning</Link>
            <Link to="/services?category=maintenance" className="hover:text-slate-900 transition-colors">Maintenance</Link>
            <Link to="/my-bookings" className="text-accent hover:text-accent-hover transition-colors font-extraboldNormal mr-2">Track Booking</Link>
            <Link 
              to="/book-service" 
              className="bg-[#0052cc] hover:bg-[#004099] text-white text-xs font-black px-4.5 py-2.5 rounded-xl transition-all shadow-md select-none hover:scale-[1.02] active:scale-98 flex items-center gap-1.5 shrink-0 uppercase tracking-normal"
            >
              <span>Book a Service</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </nav>

          {/* Cart Icon Container (Customer Mode Only) */}
          {!isAuthenticated && (userRole === 'customer' || !userRole) && (
            <Link 
              to="/cart" 
              className="relative flex items-center justify-center h-10 w-10 text-slate-700 hover:text-slate-900 border border-slate-200/80 bg-white hover:bg-slate-50 transition-all rounded-full shadow-sm hover:scale-105" 
              title="Shopping Cart"
            >
              <ShoppingCart className="h-4 w-4" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-slate-900 text-white text-[9px] font-black h-5 w-5 flex items-center justify-center rounded-full ring-2 ring-white">
                  {cartCount}
                </span>
              )}
            </Link>
          )}

          {/* Notification Bell (Admin Mode Only) */}
          {isAuthenticated && (
            <Link 
              to="/admin" 
              className="relative flex items-center justify-center h-10 w-10 text-slate-700 hover:text-slate-900 border border-slate-200/80 bg-white hover:bg-slate-50 transition-all rounded-full shadow-sm hover:scale-105" 
              title="Admin Panel Notification"
            >
              <Bell className="h-4 w-4" />
              {newBookingsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-black h-5 w-5 flex items-center justify-center rounded-full ring-2 ring-white animate-bounce">
                  {newBookingsCount}
                </span>
              )}
            </Link>
          )}


          {/* Admin Lock Access point (Subtle, visually separate) */}
          <Link
            to={isAuthenticated ? "/admin" : "/login"}
            className="hidden sm:flex items-center justify-center h-10 w-10 text-slate-700 hover:text-slate-900 border border-slate-200/80 bg-white hover:bg-slate-50 transition-all rounded-full shadow-sm hover:scale-105"
            title={isAuthenticated ? "Admin Dashboard" : "Admin Login"}
          >
            <Lock className="h-4 w-4 text-slate-500" />
          </Link>

          {/* User Profile dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={handleProfileClick}
              className="flex items-center justify-center h-10 w-10 text-slate-700 hover:text-slate-900 border border-slate-200/80 bg-white hover:bg-slate-50 transition-all rounded-full shadow-sm hover:scale-105 cursor-pointer"
              title="User Account"
            >
              <User className="h-4 w-4" />
            </button>

            {/* Dropdowns */}
            {!isAuthenticated && userRole === 'customer' && showUserDropdown && (
              <div className="absolute right-0 mt-2.5 w-48 rounded-2xl border border-slate-100 bg-white py-1.5 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-4 py-2 border-b border-slate-50 select-none">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Account</p>
                  <p className="text-xs font-black text-slate-800 mt-0.5">Guest Customer</p>
                </div>
                <div className="p-1">
                  <button
                    onClick={() => {
                      setShowUserDropdown(false);
                      handleLogout();
                    }}
                    className="w-full flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-red-500 hover:bg-red-50 rounded-xl transition-colors text-left cursor-pointer"
                  >
                    <LogOut className="h-4 w-4" />
                    Log Out
                  </button>
                </div>
              </div>
            )}

            {isAuthenticated && showUserDropdown && (
              <div className="absolute right-0 mt-2.5 w-56 rounded-2xl border border-slate-100 bg-white py-1.5 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-4 py-2 border-b border-slate-50 select-none">
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">Control Center</p>
                  <p className="text-xs font-black text-slate-800 mt-1 leading-none">Admin Administrator</p>
                  <p className="text-[10px] text-slate-500 mt-1 truncate">{username || 'admin'}</p>
                </div>
                <div className="p-1">
                  <Link
                    to="/admin"
                    onClick={() => setShowUserDropdown(false)}
                    className="flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 rounded-xl transition-colors"
                  >
                    <Bell className="h-4 w-4 text-slate-400" />
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      setShowUserDropdown(false);
                      handleLogout();
                    }}
                    className="w-full flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-red-500 hover:bg-red-50 rounded-xl transition-colors text-left cursor-pointer"
                  >
                    <LogOut className="h-4 w-4" />
                    Log Out
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Hamburger Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-650 hover:text-slate-900 rounded-full hover:bg-slate-100 md:hidden transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

        </div>
      </div>

      {/* Mobile Drawer (Collapsible) */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 py-4 space-y-4 shadow-xl animate-in slide-in-from-top-3 duration-250">
          
          <div className="flex items-center gap-1.5 bg-slate-50 px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-700 w-full justify-center border border-slate-200/50">
            <MapPin className="h-4 w-4 text-accent" />
            <span>Raichur, Karnataka</span>
          </div>

          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search services..."
              className="w-full bg-slate-50 border border-slate-200/50 rounded-xl py-2.5 pl-10 pr-4 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-350"
            />
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-455" />
          </form>

          <nav className="flex flex-col space-y-2.5 font-bold text-xs uppercase tracking-wider text-slate-650">
            <Link to="/book-service" onClick={() => setMobileMenuOpen(false)} className="bg-[#0052cc] text-white text-center hover:bg-[#004099] px-3 py-2.5 rounded-lg transition-all font-extrabold block uppercase tracking-normal">Book a Service</Link>
            <Link to="/services" onClick={() => setMobileMenuOpen(false)} className="hover:text-slate-950 hover:bg-slate-50 px-3 py-2 rounded-lg transition-all">All Services</Link>
            <Link to="/services?category=cleaning" onClick={() => setMobileMenuOpen(false)} className="hover:text-slate-950 hover:bg-slate-50 px-3 py-2 rounded-lg transition-all">Cleaning</Link>
            <Link to="/services?category=maintenance" onClick={() => setMobileMenuOpen(false)} className="hover:text-slate-950 hover:bg-slate-50 px-3 py-2 rounded-lg transition-all">Maintenance</Link>
            <Link to="/my-bookings" onClick={() => setMobileMenuOpen(false)} className="text-accent hover:bg-accent-light px-3 py-2 rounded-lg transition-all font-extrabold">Track Booking</Link>
            
            <a
              href="https://www.instagram.com/sa_raichur_serives_point?igsi=Y2ZjdGkwdzkyMjV2"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-slate-950 hover:bg-slate-50 px-3 py-2 rounded-lg transition-all flex items-center gap-2"
            >
              <svg className="h-4 w-4 text-pink-600" stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
              </svg> Follow Instagram
            </a>

            {!isAuthenticated && (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-slate-950 hover:bg-slate-50 px-3 py-2 rounded-lg transition-all flex items-center gap-2"
              >
                <Lock className="h-4 w-4 text-slate-500" /> Admin Area
              </Link>
            )}

            <hr className="border-slate-100 my-1" />

            {isAuthenticated ? (
              <>
                <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="text-primary hover:bg-slate-50 px-3 py-2 rounded-lg transition-all flex items-center gap-2">
                  <User className="h-4 w-4" /> Admin Portal
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="text-red-500 hover:bg-red-50 px-3 py-2 rounded-lg transition-all flex items-center gap-2 text-left w-full cursor-pointer"
                >
                  <LogOut className="h-4 w-4" /> Log Out
                </button>
              </>
            ) : (
              userRole === 'customer' ? (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="text-red-500 hover:bg-red-50 px-3 py-2 rounded-lg transition-all flex items-center gap-2 text-left w-full cursor-pointer"
                >
                  <LogOut className="h-4 w-4" /> Log Out
                </button>
              ) : (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setIsRoleModalOpen(true);
                  }}
                  className="text-slate-700 hover:bg-slate-50 px-3 py-2 rounded-lg transition-all flex items-center gap-2 text-left w-full cursor-pointer"
                >
                  <User className="h-4 w-4" /> Select Account Role
                </button>
              )
            )}
          </nav>
        </div>
      )}

      <RoleSelectionModal
        isOpen={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
        onSelectCustomer={handleSelectCustomer}
        onSelectAdmin={handleSelectAdmin}
        isDismissible={true}
      />
    </header>
  );
};

export default Navbar;
