import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Star, Plus, Minus } from 'lucide-react';
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
      className="bg-white rounded-2xl border border-slate-200/70 overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between cursor-pointer w-full"
    >
      <div className="relative aspect-video overflow-hidden bg-slate-100">
        <img 
          src={service.image} 
          alt={service.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
          loading="lazy"
        />
        {discount > 0 && (
          <span className="absolute top-3 left-3 bg-yellow-500 text-slate-900 text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-sm">
            {discount}% OFF
          </span>
        )}
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <span className="text-[10px] font-bold text-accent tracking-wider uppercase">
            {service.category}
          </span>
          <h4 className="font-display text-sm font-extrabold text-slate-800 line-clamp-1 mt-0.5">
            {service.name}
          </h4>
          
          <div className="flex items-center gap-1.5 mt-1.5">
            <div className="flex items-center gap-0.5 text-yellow-500">
              <Star className="h-3.5 w-3.5 fill-current" />
              <span className="text-xs font-bold">{service.rating.toFixed(1)}</span>
            </div>
            <span className="text-slate-400 text-xs">•</span>
            <span className="text-slate-500 text-xs">({service.reviewCount} reviews)</span>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-slate-100 pt-3.5 mt-4">
          <div className="flex flex-col">
            <span className="text-slate-400 text-[10px] leading-none mb-1">Starts at</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-sm font-black text-slate-900">₹{service.price}</span>
              {service.originalPrice && (
                <span className="text-[10px] text-slate-400 line-through">₹{service.originalPrice}</span>
              )}
            </div>
          </div>

          {/* Redux Cart Button controller */}
          <div className="h-8 min-w-[76px] relative">
            {quantity > 0 ? (
              <div className="flex items-center justify-between bg-primary text-white rounded-lg h-full w-full px-2 text-xs font-bold shadow-sm">
                <button 
                  onClick={handleRemove}
                  className="p-1 hover:bg-primary-hover rounded transition-colors"
                >
                  <Minus className="h-3 w-3" />
                </button>
                <span className="px-1 text-xs select-none">{quantity}</span>
                <button 
                  onClick={handleAdd}
                  className="p-1 hover:bg-primary-hover rounded transition-colors"
                >
                  <Plus className="h-3 w-3" />
                </button>
              </div>
            ) : (
              <button
                onClick={handleAdd}
                className="w-full h-full bg-primary-light text-primary hover:bg-primary hover:text-white border border-primary text-xs font-bold rounded-lg transition-all shadow-sm"
              >
                ADD
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
