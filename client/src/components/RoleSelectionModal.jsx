import React from 'react';
import { createPortal } from 'react-dom';
import { X, User, ShieldCheck } from 'lucide-react';

const RoleSelectionModal = ({ isOpen, onClose, onSelectCustomer, onSelectAdmin, isDismissible = true }) => {
  if (!isOpen) return null;

  const modalContent = (
    <div className="fixed inset-0 z-[9999] overflow-y-auto">
      {/* Backdrop with premium blur */}
      <div 
        className={`fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity ${isDismissible ? 'cursor-pointer' : 'cursor-default'}`}
        onClick={isDismissible ? onClose : undefined}
      />

      {/* Centering wrapper */}
      <div className="flex min-h-full items-center justify-center p-4 text-center">
        {/* Modal Card */}
        <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-slate-100 bg-white p-6 shadow-2xl transition-all sm:p-8 text-left z-10 animate-in fade-in zoom-in-95 duration-200">
          
          {/* Close Button */}
          {isDismissible && (
            <button
              onClick={onClose}
              className="absolute right-4 top-4 rounded-full p-1.5 text-slate-400 hover:bg-slate-50 hover:text-slate-600 focus:outline-none transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>
          )}

          {/* Header */}
          <div className="text-center mb-8">
            <span className="inline-block bg-primary-light text-primary text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider mb-2.5">
              S A Raichur Service Point
            </span>
            <h3 className="font-display text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Choose Your Profile
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Please select how you would like to proceed with the platform.
            </p>
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Customer Option Card */}
            <button
              onClick={() => {
                onSelectCustomer();
                onClose();
              }}
              className="flex flex-col items-center text-center p-6 bg-white border border-slate-200/80 rounded-2xl hover:border-primary hover:shadow-lg hover:shadow-primary/5 transition-all group cursor-pointer"
            >
              <div className="w-14 h-14 bg-primary-light flex items-center justify-center rounded-2xl text-primary mb-4 group-hover:scale-105 transition-transform duration-300">
                <User className="h-7 w-7" />
              </div>
              <h4 className="font-display text-sm font-extrabold text-slate-800 tracking-tight group-hover:text-primary transition-colors">
                Customer
              </h4>
              <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed font-medium">
                Browse services, book services, and track your bookings without an account.
              </p>
            </button>

            {/* Admin / Service Provider Option Card */}
            <button
              onClick={() => {
                onSelectAdmin();
                onClose();
              }}
              className="flex flex-col items-center text-center p-6 bg-white border border-slate-200/80 rounded-2xl hover:border-accent hover:shadow-lg hover:shadow-accent/5 transition-all group cursor-pointer"
            >
              <div className="w-14 h-14 bg-accent-light flex items-center justify-center rounded-2xl text-accent mb-4 group-hover:scale-105 transition-transform duration-300">
                <ShieldCheck className="h-7 w-7" />
              </div>
              <h4 className="font-display text-sm font-extrabold text-slate-800 tracking-tight group-hover:text-accent transition-colors">
                Admin & Partner
              </h4>
              <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed font-medium">
                Secure dashboard access to manage bookings, service catalog, and system settings.
              </p>
            </button>

          </div>

          {/* Footer info */}
          <div className="mt-6 text-center text-[10px] font-bold text-slate-400 select-none">
            🔒 Secure Role Routing & Data Integrity
          </div>

        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default RoleSelectionModal;
