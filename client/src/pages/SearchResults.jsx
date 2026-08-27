import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search, ArrowLeft } from 'lucide-react';
import { fetchServices } from '../services/api';
import { services as fallbackServices, getOrderedServices } from '../data/services';
import ServiceCard from '../components/ServiceCard';

const SearchResults = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const query = searchParams.get('query') || '';

  const [results, setResults] = useState(() => {
    if (!query.trim()) return [];
    const filterTerm = query.toLowerCase();
    return fallbackServices.filter(s => 
      s.name.toLowerCase().includes(filterTerm) || 
      s.description.toLowerCase().includes(filterTerm) ||
      s.category.toLowerCase().includes(filterTerm)
    );
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }
    
    const filterTerm = query.toLowerCase();
    const initialMatches = fallbackServices.filter(s => 
      s.name.toLowerCase().includes(filterTerm) || 
      s.description.toLowerCase().includes(filterTerm) ||
      s.category.toLowerCase().includes(filterTerm)
    );

    setResults(initialMatches);
    if (initialMatches.length === 0) {
      setLoading(true);
    } else {
      setLoading(false);
    }

    const performSearch = async () => {
      try {
        const data = await fetchServices();
        if (data.success && data.services.length > 0) {
          const ordered = getOrderedServices(data.services);
          const term = query.toLowerCase();
          const matches = ordered.filter(s => 
            s.name.toLowerCase().includes(term) || 
            s.description.toLowerCase().includes(term) ||
            s.category.toLowerCase().includes(term)
          );
          setResults(matches);
        } else {
          searchFallback(query);
        }
      } catch (err) {
        console.warn('API search failed, filtering offline data:', err);
        searchFallback(query);
      } finally {
        setLoading(false);
      }
    };
    performSearch();
  }, [query]);

  const searchFallback = (term) => {
    const filterTerm = term.toLowerCase();
    const matches = fallbackServices.filter(s => 
      s.name.toLowerCase().includes(filterTerm) || 
      s.description.toLowerCase().includes(filterTerm) ||
      s.category.toLowerCase().includes(filterTerm)
    );
    setResults(matches);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 relative min-h-screen">
      
      {/* Back button */}
      <button 
        onClick={() => navigate('/')}
        className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 font-bold mb-6 transition-colors select-none"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Home</span>
      </button>

      {/* Search status header */}
      <div className="mb-8">
        <div className="flex items-center gap-2">
          <Search className="h-5 w-5 text-slate-900" />
          <h2 className="font-display text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Search Results
          </h2>
        </div>
        <p className="text-slate-500 text-xs sm:text-sm mt-1 max-w-lg font-medium">
          Showing matching home cleaning or repair services for: <strong className="text-slate-800">"{query}"</strong>
        </p>
      </div>

      {loading && results.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-slate-900" />
          <span className="text-slate-400 text-xs font-semibold">Querying services catalog...</span>
        </div>
      ) : results.length === 0 ? (
        <div className="text-center py-16 bg-white border border-slate-200 rounded-3xl p-8 max-w-md mx-auto shadow-sm">
          <span className="text-4xl block mb-4">🔍</span>
          <h3 className="font-display text-base font-black text-slate-800">No Services Match</h3>
          <p className="text-slate-550 text-xs mt-1 leading-relaxed">
            We couldn't find any cleaning or maintenance services matching "{query}". Try checking your spelling or select another category.
          </p>
          <button 
            onClick={() => navigate('/services')}
            className="bg-slate-900 text-white text-xs font-bold px-5 py-2.5 rounded-xl mt-6 shadow-sm select-none"
          >
            Browse All Services
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {results.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      )}

    </div>
  );
};

export default SearchResults;
