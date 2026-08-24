import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchServices } from '../services/api';
import { services as fallbackServices } from '../data/services';
import ServiceCard from '../components/ServiceCard';
import { Sparkles, Wrench, Settings } from 'lucide-react';

const Services = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category') || 'all';

  const [servicesList, setServicesList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getServicesData = async () => {
      setLoading(true);
      try {
        // Query API
        const data = await fetchServices(categoryParam === 'all' ? '' : categoryParam);
        if (data.success && data.services.length > 0) {
          setServicesList(data.services);
        } else {
          // fallback filters locally
          filterFallbackList(categoryParam);
        }
      } catch (err) {
        console.warn('API error, using filtered static list:', err);
        filterFallbackList(categoryParam);
      } finally {
        setLoading(false);
      }
    };
    getServicesData();
  }, [categoryParam]);

  const filterFallbackList = (category) => {
    if (category === 'all') {
      setServicesList(fallbackServices);
    } else {
      setServicesList(fallbackServices.filter(s => s.category === category));
    }
  };

  const handleCategorySelect = (category) => {
    if (category === 'all') {
      searchParams.delete('category');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ category });
    }
  };

  const categories = [
    { key: 'all', label: 'All Services', icon: <Sparkles className="h-4 w-4" /> },
    { key: 'cleaning', label: 'Cleaning', icon: <Sparkles className="h-4 w-4" /> },
    { key: 'maintenance', label: 'Maintenance', icon: <Wrench className="h-4 w-4" /> },
    { key: 'others', label: 'Others', icon: <Settings className="h-4 w-4" /> }
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      
      {/* Page Header */}
      <div className="mb-8">
        <h2 className="font-display text-3xl font-black text-slate-900 tracking-tight">
          Service Catalog
        </h2>
        <p className="text-slate-500 text-xs sm:text-sm mt-1">
          Browse our categories and select professional services delivered directly to your doorstep.
        </p>
      </div>

      {/* Category filter tabs */}
      <div className="flex flex-wrap gap-2.5 mb-8 border-b border-slate-200 pb-5">
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => handleCategorySelect(cat.key)}
            className={`flex items-center gap-1.5 px-4.5 py-2.5 rounded-xl text-xs font-bold transition-all border ${
              categoryParam === cat.key
                ? 'bg-primary border-primary text-white shadow-md shadow-primary/10'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            {cat.icon}
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Grid rendering */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
          <span className="text-slate-400 text-sm font-semibold">Filtering service catalog...</span>
        </div>
      ) : servicesList.length === 0 ? (
        <div className="text-center py-16 bg-white border border-slate-200 rounded-3xl p-8">
          <span className="text-4xl">🔍</span>
          <h3 className="font-display text-lg font-bold text-slate-800 mt-4">No Services Found</h3>
          <p className="text-slate-500 text-xs mt-1">We couldn't find any services matching this category parameter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {servicesList.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      )}

    </div>
  );
};

export default Services;
