import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Check, MessageSquare, Home, ShoppingBag, ArrowLeft, Loader2 } from 'lucide-react';
import { selectCartItems, selectCartTotal, clearCart } from '../redux/cartSlice';
import { selectActiveBooking, setActiveBooking, clearActiveBooking } from '../redux/bookingSlice';
import { submitBooking } from '../services/api';

const Booking = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cartItems = useSelector(selectCartItems);
  const subtotal = useSelector(selectCartTotal);
  const activeBooking = useSelector(selectActiveBooking);

  // Form states
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [message, setMessage] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // If cart is empty on mount (and no active success booking), redirect to cart
  useEffect(() => {
    if (cartItems.length === 0 && !activeBooking) {
      navigate('/cart');
    }
  }, [cartItems, activeBooking, navigate]);

  // Clean success state when exiting details page
  useEffect(() => {
    return () => {
      dispatch(clearActiveBooking());
    };
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) return;

    setError(null);
    setIsSubmitting(true);

    const services = cartItems.map(item => ({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity
    }));

    // Primary service name for overview
    const serviceName = cartItems[0].name + (cartItems.length > 1 ? ` + ${cartItems.length - 1} other service(s)` : '');
    const grandTotal = subtotal + Math.round(subtotal * 0.05);

    const bookingPayload = {
      customerName: name,
      phone,
      email,
      service: serviceName,
      services,
      address,
      preferredDate: date,
      preferredTime: timeSlot,
      message,
      totalAmount: grandTotal
    };

    try {
      const data = await submitBooking(bookingPayload);
      if (data.success && data.booking) {
        dispatch(setActiveBooking(data.booking));
        dispatch(clearCart()); // Empty the cart upon success

        // Automatically launch WhatsApp with booking info
        const serviceNamesText = data.booking.services.map(s => `${s.name} (x${s.quantity})`).join(', ');
        const whatsappText = encodeURIComponent(
          `*S A RAICHUR SERVICE POINT - NEW BOOKING*\n\n` +
          `*Booking ID:* ${data.booking.id}\n` +
          `*Name:* ${data.booking.customerName}\n` +
          `*Phone:* ${data.booking.phone}\n` +
          `*Service:* ${serviceNamesText}\n` +
          `*Schedule:* ${data.booking.preferredDate} | ${data.booking.preferredTime}\n` +
          `*Address:* ${data.booking.address}\n` +
          `*Amount:* ₹${data.booking.totalAmount}\n\n` +
          `Please confirm my booking slot. Thank you!`
        );
        const whatsappLink = `https://wa.me/917411741418?text=${whatsappText}`;
        window.open(whatsappLink, '_blank');
      } else {
        throw new Error(data.error || 'Failed to submit request.');
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Error occurred while saving booking.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // If successful booking exists, show the confirmation screen
  if (activeBooking) {
    const serviceNamesText = activeBooking.services.map(s => `${s.name} (x${s.quantity})`).join(', ');
    const whatsappText = encodeURIComponent(
      `*S A RAICHUR SERVICE POINT - NEW BOOKING*\n\n` +
      `*Booking ID:* ${activeBooking.id}\n` +
      `*Name:* ${activeBooking.customerName}\n` +
      `*Phone:* ${activeBooking.phone}\n` +
      `*Service:* ${serviceNamesText}\n` +
      `*Schedule:* ${activeBooking.preferredDate} | ${activeBooking.preferredTime}\n` +
      `*Address:* ${activeBooking.address}\n` +
      `*Amount:* ₹${activeBooking.totalAmount}\n\n` +
      `Please confirm my booking slot. Thank you!`
    );
    const whatsappLink = `https://wa.me/917411741418?text=${whatsappText}`;

    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 flex items-center justify-center rounded-full mx-auto mb-6 shadow-inner ring-4 ring-emerald-50">
          <Check className="h-8 w-8 stroke-[3]" />
        </div>

        <h2 className="font-display text-3xl font-black text-slate-900 tracking-tight">Booking Confirmed!</h2>
        <span className="inline-block bg-primary-light text-primary text-xs font-bold px-3.5 py-1 rounded-full mt-2">
          Booking ID: {activeBooking.id}
        </span>

        <p className="text-slate-500 text-xs sm:text-sm mt-4 leading-relaxed">
          Thank you, <strong className="text-slate-800">{activeBooking.customerName}</strong>. Your home service request has been registered in our database. Our partner will call you shortly.
        </p>

        {/* Details list */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 text-left text-xs space-y-2.5 my-8 shadow-sm">
          <div><span className="text-slate-400 font-bold uppercase tracking-wider block mb-0.5">Schedule</span> {activeBooking.preferredDate} ({activeBooking.preferredTime})</div>
          <div><span className="text-slate-400 font-bold uppercase tracking-wider block mb-0.5">Address</span> {activeBooking.address}</div>
          <div><span className="text-slate-400 font-bold uppercase tracking-wider block mb-0.5">Services</span> {serviceNamesText}</div>
          <div><span className="text-slate-400 font-bold uppercase tracking-wider block mb-0.5">Amount</span> ₹{activeBooking.totalAmount} (incl. GST)</div>
        </div>

        <div className="flex flex-col gap-3">
          <a
            href={whatsappLink}
            target="_blank"
            rel="noreferrer"
            className="w-full bg-[#25d366] hover:bg-[#1ebd58] text-white text-sm font-extrabold h-12 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-500/10"
          >
            <MessageSquare className="h-4 w-4 fill-current" />
            <span>Share on WhatsApp</span>
          </a>
          
          <button
            onClick={() => navigate('/')}
            className="w-full bg-slate-900 hover:bg-slate-950 text-white text-sm font-extrabold h-12 rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm"
          >
            <Home className="h-4 w-4 text-accent" />
            <span>Return to Home</span>
          </button>
        </div>
      </div>
    );
  }

  // Cost breakdown
  const gstCost = Math.round(subtotal * 0.05);
  const totalCost = subtotal + gstCost;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      
      {/* Back to Cart link */}
      <button 
        onClick={() => navigate('/cart')}
        className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 font-bold mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Modify Services List</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Form details */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
            <h3 className="font-display text-xl font-extrabold text-slate-900 border-b border-slate-100 pb-4 mb-6">
              Contact & Booking Details
            </h3>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-semibold p-4 rounded-xl mb-6">
                ⚠️ Error: {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Full Name *</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="E.g. Vijay Raj"
                  required
                  className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:bg-white focus:border-primary transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Mobile Number *</label>
                  <input 
                    type="tel" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="10-digit number"
                    pattern="[6-9][0-9]{9}"
                    required
                    className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:bg-white focus:border-primary transition-all"
                  />
                </div>
                
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email (Optional)</label>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="E.g. vijay@gmail.com"
                    className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:bg-white focus:border-primary transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Preferred Date *</label>
                  <input 
                    type="date" 
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                    className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:bg-white focus:border-primary transition-all"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Time Slot *</label>
                  <select 
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    required
                    className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:bg-white focus:border-primary transition-all"
                  >
                    <option value="" disabled>Choose a time slot</option>
                    <option value="Morning (08:00 AM - 11:00 AM)">Morning (08:00 AM - 11:00 AM)</option>
                    <option value="Midday (11:00 AM - 02:00 PM)">Midday (11:00 AM - 02:00 PM)</option>
                    <option value="Afternoon (02:00 PM - 05:00 PM)">Afternoon (02:00 PM - 05:00 PM)</option>
                    <option value="Evening (05:00 PM - 08:00 PM)">Evening (05:00 PM - 08:00 PM)</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Service Address in Raichur *</label>
                <textarea 
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows="3"
                  placeholder="House number, colony name, landmark, Raichur"
                  required
                  className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:bg-white focus:border-primary transition-all resize-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Special Instructions (Optional)</label>
                <textarea 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows="2"
                  placeholder="Any extra comments for the service expert..."
                  className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:bg-white focus:border-primary transition-all resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary hover:bg-primary-hover text-white text-sm font-extrabold h-12 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-primary/10"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Submitting Booking...</span>
                  </>
                ) : (
                  <span>Submit Booking Request</span>
                )}
              </button>

            </form>
          </div>
        </div>

        {/* Right Column: Checkout Summary Box */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-6">
            <h3 className="font-display text-base font-extrabold text-slate-900 border-b border-slate-100 pb-3">
              Booking Cart Summary
            </h3>

            <div className="space-y-3.5 max-h-48 overflow-y-auto pr-1">
              {cartItems.map(item => (
                <div key={item.id} className="flex justify-between items-center text-xs">
                  <div className="max-w-[70%]">
                    <span className="font-semibold text-slate-800 block truncate">{item.name}</span>
                    <span className="text-slate-400 text-[10px]">Qty: {item.quantity}</span>
                  </div>
                  <span className="font-bold text-slate-800">₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            <hr className="border-slate-100" />

            <div className="space-y-2.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>GST (5%)</span>
                <span>₹{gstCost}</span>
              </div>
              <div className="flex justify-between text-slate-950 font-black text-sm pt-2">
                <span>Grand Total</span>
                <span className="text-primary">₹{totalCost}</span>
              </div>
            </div>
            
            <div className="bg-slate-50 border border-slate-200/50 rounded-xl p-3 text-[10px] text-slate-400 text-center leading-relaxed">
              Upon submission, a copy of the request is instantly logged in the server and emailed to the admin office.
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default Booking;
