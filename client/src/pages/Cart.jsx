import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowLeft, ArrowRight, Trash2, Plus, Minus } from 'lucide-react';
import { 
  selectCartItems, 
  selectCartTotal, 
  addToCart, 
  removeFromCart, 
  clearCart 
} from '../redux/cartSlice';

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const cartItems = useSelector(selectCartItems);
  const subtotal = useSelector(selectCartTotal);
  
  const gst = Math.round(subtotal * 0.05); // 5% Safety Tax
  const grandTotal = subtotal + gst;
  const hasQuoteItems = cartItems.some(item => item.price === 0);

  const handleAdd = (item) => dispatch(addToCart(item));
  const handleRemove = (id) => dispatch(removeFromCart(id));
  const handleClear = () => dispatch(clearCart());

  if (cartItems.length === 0) {
    return (
      <div className="mx-auto max-w-lg text-center py-20 px-4">
        <div className="w-20 h-20 bg-slate-100 border border-slate-200 flex items-center justify-center rounded-full mx-auto mb-6 text-slate-400">
          <ShoppingBag className="h-10 w-10" />
        </div>
        <h2 className="font-display text-2xl font-black text-slate-900">Your Cart is Empty</h2>
        <p className="text-slate-500 text-xs sm:text-sm mt-2 max-w-sm mx-auto">
          You haven't selected any home cleaning or maintenance services yet. Browse our catalog to book professional services.
        </p>
        <button
          onClick={() => navigate('/services')}
          className="btn btn-primary mt-6 text-xs"
        >
          Explore Home Services
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-8 border-b border-slate-200 pb-5">
        <div className="flex items-center gap-2">
          <ShoppingBag className="h-6 w-6 text-primary" />
          <h2 className="font-display text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Selected Services
          </h2>
        </div>
        <button
          onClick={handleClear}
          className="flex items-center gap-1 text-[11px] font-bold text-red-500 hover:text-red-700 hover:underline"
        >
          <Trash2 className="h-3.5 w-3.5" />
          <span>Clear All</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Items List */}
        <div className="lg:col-span-7 space-y-4">
          {cartItems.map((item) => (
            <div 
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200/60 p-4 shadow-sm flex items-center justify-between gap-4"
            >
              <div className="flex-1">
                <span className="text-[9px] font-bold text-accent tracking-wider uppercase">{item.category}</span>
                <h4 className="font-display text-sm font-extrabold text-slate-800 leading-tight mt-0.5">{item.name}</h4>
                
                {/* Options Breakdown */}
                {item.selectedOptions && Object.keys(item.selectedOptions).length > 0 && (
                  <div className="text-[10px] text-slate-500 mt-1.5 space-y-0.5 border-l-2 border-slate-200 pl-2">
                    {Object.entries(item.selectedOptions).map(([k, v]) => v && (
                      <div key={k}>
                        <span className="font-bold text-slate-600">{k}:</span> {v}
                      </div>
                    ))}
                  </div>
                )}
                
                <span className="text-xs text-slate-400 mt-1 block">
                  {item.price > 0 ? `₹${item.price} each` : "Contact for Quote"}
                </span>
              </div>

              <div className="flex items-center gap-4">
                {/* Quantity controller */}
                <div className="flex items-center bg-slate-100 border border-slate-200 text-slate-700 rounded-lg h-8 overflow-hidden font-bold text-xs select-none">
                  <button onClick={() => handleRemove(item.id)} className="px-2.5 hover:bg-slate-205 h-full transition-colors">
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="px-1.5">{item.quantity}</span>
                  <button onClick={() => handleAdd(item)} className="px-2.5 hover:bg-slate-205 h-full transition-colors">
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
                
                <span className="text-sm font-black text-slate-850 min-w-[70px] text-right">
                  {item.price > 0 ? `₹${item.price * item.quantity}` : "Quote on Call"}
                </span>
              </div>
            </div>
          ))}

          <button
            onClick={() => navigate('/services')}
            className="flex items-center gap-1.5 text-xs text-primary hover:text-primary-hover font-bold mt-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Add More Services</span>
          </button>
        </div>

        {/* Right Column: Pricing & Booking Summary */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-6">
            <h3 className="font-display text-base font-extrabold text-slate-900 border-b border-slate-100 pb-3">
              Payment Summary
            </h3>
            
            <div className="space-y-3 text-xs sm:text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Services Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Hygienic Safety & Tax (5%)</span>
                <span>₹{gst}</span>
              </div>
              
              <hr className="border-slate-100 my-2" />
              
              <div className="flex justify-between text-slate-950 font-black text-base pt-1">
                <span>Grand Total</span>
                <span className="text-primary">₹{grandTotal}</span>
              </div>
            </div>

            {hasQuoteItems && (
              <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-2xl p-3.5 text-[10px] font-semibold text-center leading-normal">
                ⚠️ Your cart includes items marked as "Quote on Call". The final cost for these will be quoted on-site.
              </div>
            )}

            <div className="bg-slate-50 border border-slate-200/50 rounded-xl p-3.5 text-[10px] text-slate-400 font-medium text-center leading-normal">
              💵 Payments are completed after service execution (Cash or UPI).
            </div>

            <button
              onClick={() => navigate('/booking')}
              className="w-full bg-primary hover:bg-primary-hover text-white text-sm font-extrabold h-12 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-primary/10"
            >
              <span>Proceed to Booking</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};

export default Cart;
