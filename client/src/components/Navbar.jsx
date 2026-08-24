import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Search, ShoppingCart, User, MapPin, Menu, X, LogOut, ChevronDown, Bell } from 'lucide-react';
import { selectCartCount } from '../redux/cartSlice';
import { selectAuth, logout } from '../redux/authSlice';
import { selectBookings, fetchBookingsSuccess } from '../redux/bookingSlice';
import { fetchServices, fetchAdminBookings } from '../services/api';
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

  // Fetch search suggestions dynamically
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      try {
        const data = await fetchServices('', searchQuery);
        if (data.success) {
          setSuggestions(data.services.slice(0, 5));
        }
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
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Left: Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5">
          <svg className="h-9 w-9 text-primary transition-transform hover:scale-105 hover:rotate-2" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="48" fill="#f0f5ff" stroke="#0052cc" strokeWidth="3"/>
            <path d="M35 32 L40 24 L50 29 L60 24 L65 32 Z" fill="#00a3c4"/>
            <circle cx="40" cy="24" r="2.5" fill="#0052cc"/>
            <circle cx="50" cy="29" r="2.5" fill="#0052cc"/>
            <circle cx="60" cy="24" r="2.5" fill="#0052cc"/>
            <text x="27" y="65" fontFamily="'Outfit', sans-serif" fontSize="36" fontWeight="900" fill="#0052cc">S</text>
            <text x="50" y="75" fontFamily="'Outfit', sans-serif" fontSize="36" fontWeight="900" fill="#0052cc">A</text>
            <path d="M20 80 Q50 87 80 80" fill="none" stroke="#00a3c4" strokeWidth="4" strokeLinecap="round"/>
          </svg>
          <div className="flex flex-col select-none">
            <span className="font-display text-base font-extrabold tracking-tight text-primary leading-none">S A RAICHUR</span>
            <span className="font-display text-[9px] font-bold tracking-widest text-accent leading-none mt-0.5">SERVICE POINT</span>
          </div>
        </Link>

        {/* Center: Search & Navigation */}
        <div className="hidden md:flex items-center flex-1 max-w-xl mx-6 gap-3">
          
          {/* Location box styled like screenshot */}
          <div className="flex items-center gap-1.5 bg-white px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 w-44 justify-between shrink-0 shadow-sm">
            <div className="flex items-center gap-1.5 min-w-0">
              <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
              <span className="truncate">Raichur, Karnataka</span>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400 shrink-0" />
          </div>

          <form onSubmit={handleSearchSubmit} ref={searchRef} className="relative flex-1">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                placeholder="Search for 'AC service', cleaning..."
                className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-xs font-bold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-400 shadow-sm transition-all"
              />
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            </div>

            {/* Search Autocomplete Suggestions */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-12 left-0 right-0 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden">
                {suggestions.map((service) => (
                  <div
                    key={service.id}
                    onClick={() => handleSuggestionClick(service.id)}
                    className="flex items-center justify-between px-4 py-2.5 hover:bg-slate-50 cursor-pointer border-b border-slate-100 last:border-0"
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-800">{service.name}</div>
                      <div className="text-[10px] text-slate-500 capitalize">{service.category} • Starts ₹{service.price}</div>
                    </div>
                    <span className="text-[10px] font-bold text-primary hover:underline">View</span>
                  </div>
                ))}
              </div>
            )}
          </form>
        </div>

        {/* Right: Actions Menu */}
        <div className="flex items-center gap-2 sm:gap-4">
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600 mr-2">
            <Link to="/services" className="hover:text-primary transition-colors">Services</Link>
            <Link to="/services?category=cleaning" className="hover:text-primary transition-colors">Cleaning</Link>
            <Link to="/services?category=maintenance" className="hover:text-primary transition-colors">Maintenance</Link>
            <Link to="/my-bookings" className="text-accent hover:text-accent-hover font-bold transition-colors">Track Booking</Link>
          </nav>
          {/* Cart Icon Container (Customer Mode Only) */}
          {!isAuthenticated && userRole === 'customer' && (
            <Link 
              to="/cart" 
              className="relative flex items-center justify-center h-10 w-10 text-slate-700 hover:text-primary border border-slate-200 bg-white hover:bg-slate-50 transition-all rounded-full shadow-sm hover:scale-105 animate-in fade-in" 
              title="Shopping Cart"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-primary text-white text-[9px] font-bold h-5 w-5 flex items-center justify-center rounded-full ring-2 ring-white">
                  {cartCount}
                </span>
              )}
            </Link>
          )}

          {/* Booking Indicator / Notification Bell (Admin Mode Only) */}
          {isAuthenticated && (
            <Link 
              to="/admin" 
              className="relative flex items-center justify-center h-10 w-10 text-slate-700 hover:text-primary border border-slate-200 bg-white hover:bg-slate-50 transition-all rounded-full shadow-sm hover:scale-105" 
              title="Admin Control Center Bookings"
            >
              <Bell className="h-5 w-5" />
              {newBookingsCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[9px] font-bold h-5 w-5 flex items-center justify-center rounded-full ring-2 ring-white animate-bounce-short">
                  {newBookingsCount}
                </span>
              )}
            </Link>
          )}

          {/* User Profile / Menu Trigger */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={handleProfileClick}
              className="flex items-center justify-center h-10 w-10 text-slate-700 hover:text-primary border border-slate-200 bg-white hover:bg-slate-50 transition-all rounded-full shadow-sm hover:scale-105 cursor-pointer animate-in fade-in"
              title="User Profile"
            >
              <User className="h-5 w-5" />
            </button>

            {/* Customer Dropdown Menu (Logout only) */}
            {!isAuthenticated && userRole === 'customer' && showUserDropdown && (
              <div className="absolute right-0 mt-2 w-48 rounded-2xl border border-slate-100 bg-white py-2 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-4 py-2.5 border-b border-slate-100 select-none">
                  <p className="text-xs font-black text-slate-800 leading-none">Customer</p>
                </div>
                <div className="p-1">
                  <button
                    onClick={() => {
                      setShowUserDropdown(false);
                      handleLogout();
                    }}
                    className="w-full flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-red-650 hover:bg-red-50 rounded-xl transition-colors text-left cursor-pointer"
                  >
                    <LogOut className="h-4.5 w-4.5 text-red-400" />
                    Log Out
                  </button>
                </div>
              </div>
            )}

              {/* Authenticated Admin Dropdown Menu */}
              {isAuthenticated && showUserDropdown && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-slate-100 bg-white py-2 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-4 py-2.5 border-b border-slate-100 select-none">
                    <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest leading-none">Admin Profile</p>
                    <p className="text-xs font-black text-slate-800 mt-1 leading-none">Administrator</p>
                    <p className="text-[10px] font-medium text-slate-500 mt-1 leading-none truncate">{username || 'admin'}</p>
                  </div>
                  <div className="p-1">
                    <button
                      onClick={() => {
                        setShowUserDropdown(false);
                        handleLogout();
                      }}
                      className="w-full flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-red-650 hover:bg-red-50 rounded-xl transition-colors text-left cursor-pointer"
                    >
                      <LogOut className="h-4.5 w-4.5 text-red-400" />
                      Log Out
                    </button>
                  </div>
                </div>
              )}
            </div>

          {/* Hamburger Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-600 hover:text-primary rounded-full hover:bg-slate-100 md:hidden transition-colors"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer (Collapsible) */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-4 shadow-inner">
          <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-2 rounded-lg text-xs font-semibold text-slate-600 w-full justify-center">
            <MapPin className="h-4 w-4 text-accent" />
            <span>Raichur, Karnataka (Servicing Nearby Areas)</span>
          </div>

          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search services..."
              className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 pl-10 pr-4 text-sm text-slate-800 focus:outline-none focus:border-primary"
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          </form>

          <nav className="flex flex-col space-y-3 font-semibold text-slate-700">
            <Link to="/services" onClick={() => setMobileMenuOpen(false)} className="hover:text-primary py-1">All Services</Link>
            <Link to="/services?category=cleaning" onClick={() => setMobileMenuOpen(false)} className="hover:text-primary py-1">Cleaning Services</Link>
            <Link to="/services?category=maintenance" onClick={() => setMobileMenuOpen(false)} className="hover:text-primary py-1">Home Maintenance</Link>
            <Link to="/services?category=others" onClick={() => setMobileMenuOpen(false)} className="hover:text-primary py-1">Other Services</Link>
            <Link to="/my-bookings" onClick={() => setMobileMenuOpen(false)} className="text-accent hover:text-accent-hover py-1 font-bold">Track Booking</Link>
            {isAuthenticated ? (
              <>
                <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="text-primary hover:underline py-1 flex items-center gap-1.5 font-bold">
                  <User className="h-4 w-4" /> Admin Dashboard
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="text-red-650 hover:underline py-1 flex items-center gap-1.5 text-left font-bold cursor-pointer"
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
                  className="text-red-650 hover:underline py-1 flex items-center gap-1.5 text-left font-bold cursor-pointer"
                >
                  <LogOut className="h-4 w-4" /> Log Out
                </button>
              ) : (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setIsRoleModalOpen(true);
                  }}
                  className="text-slate-600 hover:text-primary py-1 flex items-center gap-1.5 text-left font-bold cursor-pointer"
                >
                  <User className="h-4 w-4" /> Select Role
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
