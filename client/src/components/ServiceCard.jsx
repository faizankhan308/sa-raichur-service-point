import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Star, Plus, Minus, ArrowRight } from 'lucide-react';
import { addToCart, removeFromCart, selectCartItems } from '../redux/cartSlice';

const ServiceCard = ({ service }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);

  // Find if this item exists in the Redux cart
  const cartItem = cartItems.find(item => item.id === service.id);
  const quantity = cartItem ? cartItem.quantity : 0;

  const handleCardClick = () => {
    navigate(`/service/${service.id}`);
  };

  const handleAdd = (e) => {
    e.stopPropagation(); // Stop navigation to details page
    dispatch(addToCart(service));
  };

  const handleRemove = (e) => {
    e.stopPropagation(); // Stop navigation to details page
    dispatch(removeFromCart(service.id));
  };

  // Calculate discount percentage
  const discount = service.originalPrice 
    ? Math.round(((service.originalPrice - service.price) / service.originalPrice) * 100)
    : 0;

  return (
    <div 
      onClick={handleCardClick}
      className="group bg-white rounded-3xl border border-slate-200/60 overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between cursor-pointer w-full"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        <img 
          src={service.image} 
          alt={service.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {discount > 0 && (
          <span className="absolute top-3 left-3 bg-slate-900 text-white text-[9px] font-black px-2.5 py-1 rounded-lg shadow-md tracking-wider">
            {discount}% OFF
          </span>
        )}
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <span className="text-[9px] font-extrabold text-accent tracking-widest uppercase block mb-1">
            {service.category}
          </span>
          <h4 className="font-display text-sm sm:text-base font-black text-slate-850 line-clamp-1 leading-snug group-hover:text-primary transition-colors">
            {service.name}
          </h4>
          
          <div className="flex items-center gap-1.5 mt-2">
            <div className="flex items-center gap-0.5 text-yellow-500 bg-yellow-50 px-2 py-0.5 rounded-md border border-yellow-150">
              <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
              <span className="text-[10px] font-bold mt-0.5">{service.rating.toFixed(1)}</span>
            </div>
            <span className="text-slate-350 text-[10px]">•</span>
            <span className="text-slate-450 text-[10px] font-semibold">({service.reviewCount} reviews)</span>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-5">
          <div className="flex flex-col">
            <span className="text-slate-400 text-[9px] font-extrabold uppercase leading-none mb-1">Starts at</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-black text-slate-900">
                {service.price > 0 ? `₹${service.price}` : "Contact for Quote"}
              </span>
              {service.originalPrice > 0 && (
                <span className="text-[10px] text-slate-400 line-through">₹{service.originalPrice}</span>
              )}
            </div>
          </div>

          {/* Redux Cart Button controller */}
          <div className="h-8.5 min-w-[80px] relative" onClick={(e) => e.stopPropagation()}>
            {quantity > 0 ? (
              <div className="flex items-center justify-between bg-slate-900 text-white rounded-xl h-full w-full px-2 text-xs font-black shadow-md">
                <button 
                  onClick={handleRemove}
                  className="p-1 hover:text-accent rounded transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-3 w-3" />
                </button>
                <span className="px-1 text-xs select-none">{quantity}</span>
                <button 
                  onClick={handleAdd}
                  className="p-1 hover:text-accent rounded transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="h-3 w-3" />
                </button>
              </div>
            ) : (
              <button
                onClick={handleAdd}
                className="w-full h-full bg-slate-50 text-slate-800 border border-slate-200 hover:bg-slate-900 hover:text-white hover:border-slate-900 text-xs font-black rounded-xl transition-all duration-200 shadow-sm flex items-center justify-center gap-1"
              >
                <span>ADD</span>
                <Plus className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
