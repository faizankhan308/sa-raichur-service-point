import React, { useState } from 'react';
import { fetchBookingsByPhone } from '../services/api';
import { Calendar, Clock, MapPin, Search, CheckCircle2, AlertTriangle, ArrowRight, ClipboardList } from 'lucide-react';

const MyBookings = () => {
  const [phone, setPhone] = useState('');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState(null);

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (!/^[6-9]\d{9}$/.test(phone)) {
      setError('Please input a valid 10-digit Indian mobile number.');
      return;
    }

    setError(null);
    setLoading(true);
    setSearched(true);
    try {
      const data = await fetchBookingsByPhone(phone);
      if (data.success) {
        setBookings(data.bookings || []);
      } else {
        throw new Error(data.error || 'Unable to retrieve bookings.');
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Error occurred while querying tracking details.');
    } finally {
      setLoading(false);
    }
  };

  // Get active step index for progress visualizer
  const getStatusStep = (status) => {
    switch (status) {
      case 'New': return 1;
      case 'Contacted': return 2;
      case 'Confirmed': return 3;
      case 'Completed': return 4;
      default: return 0; // Cancelled or others
    }
  };

  const stepsList = [
    { label: 'Logged', desc: 'Booking received' },
    { label: 'Contacted', desc: 'Expert is assigned' },
    { label: 'Confirmed', desc: 'Slot locked' },
    { label: 'Finished', desc: 'Service completed' }
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      
      {/* Header */}
      <div className="mb-8 text-center max-w-xl mx-auto">
        <h2 className="font-display text-3xl font-black text-slate-900 tracking-tight">
          Track Your Booking
        </h2>
        <p className="text-slate-500 text-xs sm:text-sm mt-1.5 leading-relaxed">
          Enter your registered 10-digit mobile number to view your home service history and track slot statuses.
        </p>
      </div>

      {/* Lookup search box card */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm max-w-lg mx-auto mb-10">
        <form onSubmit={handleSearchSubmit} className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Registered Phone Number</label>
            <div className="relative flex gap-2">
              <div className="relative flex-1">
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="E.g. 7411741418"
                  maxLength="10"
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-800 focus:outline-none focus:bg-white focus:border-primary transition-all"
                />
                <span className="absolute left-3.5 top-3 text-slate-400 font-bold text-sm">+91</span>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="bg-primary hover:bg-primary-hover text-white text-xs font-bold px-5 rounded-xl flex items-center gap-1 transition-all shadow-md shadow-primary/10 select-none shrink-0"
              >
                <Search className="h-3.5 w-3.5" />
                <span>Search</span>
              </button>
            </div>
          </div>

          {error && (
            <p className="text-red-600 text-xs font-bold text-center mt-2 bg-red-50 py-2.5 px-3 rounded-lg border border-red-200">
              ⚠️ {error}
            </p>
          )}
        </form>
      </div>

      {/* Query output result containers */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          <span className="text-slate-400 text-xs font-bold">Fetching booking records...</span>
        </div>
      ) : searched && bookings.length === 0 ? (
        <div className="text-center py-12 bg-white border border-slate-200 rounded-3xl p-8 max-w-lg mx-auto">
          <ClipboardList className="h-10 w-10 text-slate-300 mx-auto mb-3" />
          <h3 className="font-display text-sm font-bold text-slate-800">No Booking Log Found</h3>
          <p className="text-slate-500 text-[11px] mt-1">
            We couldn't locate any service appointments matching mobile number +91 {phone}. Please verify the number and try again.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {bookings.map((bk) => {
            const activeStep = getStatusStep(bk.status);
            const isCancelled = bk.status === 'Cancelled';

            return (
              <div 
                key={bk._id || bk.id}
                className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col gap-6"
              >
                {/* 1. Header info */}
                <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-4">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-primary bg-primary-light px-2.5 py-0.5 rounded border border-primary/10">
                      ID: {bk.id || `SABK-${bk._id.slice(-8).toUpperCase()}`}
                    </span>
                    <h3 className="font-display text-base font-extrabold text-slate-900 mt-2 leading-tight">
                      {bk.service}
                    </h3>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Total Charge</span>
                    <span className="text-base font-black text-slate-950">₹{bk.totalAmount}</span>
                  </div>
                </div>

                {/* 2. Schedule and address info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-slate-400 shrink-0" />
                    <div>
                      <span className="text-slate-400 block text-[9px] uppercase font-extrabold leading-none mb-0.5">Date</span>
                      <span className="font-bold text-slate-800">{bk.preferredDate}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-slate-400 shrink-0" />
                    <div>
                      <span className="text-slate-400 block text-[9px] uppercase font-extrabold leading-none mb-0.5">Slot</span>
                      <span className="font-bold text-slate-800">{bk.preferredTime}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
                    <div>
                      <span className="text-slate-400 block text-[9px] uppercase font-extrabold leading-none mb-0.5">Address</span>
                      <span className="font-bold text-slate-800 line-clamp-1">{bk.address}</span>
                    </div>
                  </div>
                </div>

                {/* 3. Progress tracking bar */}
                {isCancelled ? (
                  <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-semibold p-4 rounded-2xl flex items-center gap-2.5">
                    <AlertTriangle className="h-5 w-5 shrink-0" />
                    <div>
                      <span className="font-bold block text-red-800 leading-none mb-1">Booking Cancelled</span>
                      <span>This request was cancelled. Please call 7411741418 to re-book or schedule another service slot.</span>
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 md:p-6">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-4 leading-none">Service Tracking Progress</h4>
                    
                    {/* Visual bar container */}
                    <div className="relative flex items-center justify-between">
                      {/* Gray line */}
                      <div className="absolute left-0 right-0 h-1 bg-slate-200 -translate-y-4" />
                      {/* Active green line */}
                      <div 
                        className="absolute left-0 h-1 bg-emerald-500 -translate-y-4 transition-all duration-500" 
                        style={{ width: `${activeStep === 4 ? 100 : activeStep === 3 ? 66 : activeStep === 2 ? 33 : 0}%` }}
                      />

                      {stepsList.map((step, idx) => {
                        const stepNum = idx + 1;
                        const isDone = activeStep >= stepNum;
                        const isCurrent = activeStep === stepNum;

                        return (
                          <div key={idx} className="relative z-10 flex flex-col items-center flex-1">
                            <div 
                              className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all duration-300 ${
                                isDone 
                                  ? 'bg-emerald-500 border-emerald-500 text-white' 
                                  : 'bg-white border-slate-300 text-slate-400'
                              } ${isCurrent ? 'ring-4 ring-emerald-50' : ''}`}
                            >
                              {isDone ? (
                                <CheckCircle2 className="w-3.5 h-3.5 fill-current text-white" />
                              ) : (
                                <span className="text-[9px] font-black">{stepNum}</span>
                              )}
                            </div>
                            <span className={`text-[10px] font-black mt-2 leading-tight ${isDone ? 'text-slate-800' : 'text-slate-400'}`}>
                              {step.label}
                            </span>
                            <span className="text-[8px] text-slate-400 text-center leading-normal max-w-[80px] hidden sm:block mt-0.5 font-medium">
                              {step.desc}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                  </div>
                )}

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};

export default MyBookings;
