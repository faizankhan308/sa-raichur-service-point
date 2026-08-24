import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { fetchServices } from '../services/api';
import { services as fallbackServices } from '../data/services';
import ServiceCard from '../components/ServiceCard';

const SearchResults = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const query = searchParams.get('query') || '';

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const performSearch = async () => {
      if (!query.trim()) {
        setResults([]);
        setLoading(false);
        return;
      }
      
      setLoading(true);
      try {
        const data = await fetchServices('', query);
        if (data.success && data.services.length > 0) {
          setResults(data.services);
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
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      
      {/* Search status header */}
      <div className="mb-8">
        <div className="flex items-center gap-2">
          <Search className="h-6 w-6 text-primary" />
          <h2 className="font-display text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Search Results
          </h2>
        </div>
        <p className="text-slate-500 text-xs sm:text-sm mt-1">
          Showing matching home services for: <strong className="text-slate-800">"{query}"</strong>
        </p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
          <span className="text-slate-400 text-sm font-semibold">Querying services catalog...</span>
        </div>
      ) : results.length === 0 ? (
        <div className="text-center py-20 bg-white border border-slate-200 rounded-3xl p-8 max-w-lg mx-auto">
          <span className="text-4xl block mb-4">🔍</span>
          <h3 className="font-display text-lg font-black text-slate-800">No Services Match</h3>
          <p className="text-slate-500 text-xs mt-1">
            We couldn't find any cleaning or maintenance services matching "{query}". Try checking your spelling or search another category.
          </p>
          <button 
            onClick={() => navigate('/services')}
            className="btn btn-primary mt-6 text-xs"
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
