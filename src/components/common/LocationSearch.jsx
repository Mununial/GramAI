import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Loader2, X, Navigation } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const LocationSearch = ({ 
    onSelect, 
    placeholder = "Search location...", 
    className = "", 
    initialValue = "",
    icon: Icon = MapPin
}) => {
    const { lang } = useLanguage();
    const [query, setQuery] = useState(initialValue);
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);
    const timeoutRef = useRef(null);

    useEffect(() => {
        setQuery(initialValue);
    }, [initialValue]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const searchLocations = async (val) => {
        if (!val || val.length < 3) {
            setResults([]);
            return;
        }

        setLoading(true);
        try {
            // Priority to Odisha locations for better UX in this app
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(val)}&addressdetails=1&limit=5&countrycodes=in`
            );
            const data = await response.json();
            setResults(data);
            setShowDropdown(true);
        } catch (error) {
            console.error("Search error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const val = e.target.value;
        setQuery(val);

        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
            searchLocations(val);
        }, 500);
    };

    const handleSelect = (item) => {
        const name = item.display_name.split(',')[0] + ', ' + (item.address.city || item.address.state_district || '');
        setQuery(name);
        setResults([]);
        setShowDropdown(false);
        if (onSelect) {
            onSelect({
                lat: parseFloat(item.lat),
                lng: parseFloat(item.lon),
                name: name,
                fullDetails: item
            });
        }
    };

    return (
        <div className={`relative w-full ${className}`} ref={dropdownRef}>
            <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-focus-within:text-primary-500 transition-colors">
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Icon className="w-4 h-4" />}
                </div>
                <input
                    type="text"
                    value={query}
                    onChange={handleInputChange}
                    onFocus={() => results.length > 0 && setShowDropdown(true)}
                    placeholder={placeholder}
                    className="w-full bg-white dark:bg-slate-800 border-2 border-transparent focus:border-primary-500 rounded-2xl py-3.5 pl-11 pr-4 outline-none font-bold text-slate-800 dark:text-white shadow-sm transition-all text-sm"
                />
                {query && (
                    <button 
                        onClick={() => { setQuery(''); setResults([]); }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full text-slate-400 transition-all"
                    >
                        <X className="w-3.5 h-3.5" />
                    </button>
                )}
            </div>

            <AnimatePresence>
                {showDropdown && results.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-[1000]"
                    >
                        <div className="max-h-[280px] overflow-y-auto">
                            {results.map((item, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleSelect(item)}
                                    className="w-full flex items-start gap-4 p-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-left border-b border-slate-100 dark:border-slate-800 last:border-0"
                                >
                                    <div className="mt-1 p-2 bg-slate-100 dark:bg-slate-800 rounded-xl shrink-0 group-hover:bg-primary-100 transition-colors">
                                        <MapPin className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-black text-sm text-slate-800 dark:text-white truncate">
                                            {item.display_name.split(',')[0]}
                                        </p>
                                        <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate mt-0.5 line-clamp-1">
                                            {item.display_name.split(',').slice(1).join(',').trim()}
                                        </p>
                                    </div>
                                </button>
                            ))}
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-900/50 p-2 text-center border-t border-slate-100 dark:border-slate-800">
                             <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center justify-center gap-1">
                                <Navigation className="w-2.5 h-2.5" /> Search Results Powered by OSM
                             </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default LocationSearch;
