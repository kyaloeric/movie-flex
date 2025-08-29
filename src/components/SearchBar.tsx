import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Input from './ui/Input';
import Button from './ui/Button';
import { useMovieStore } from '../stores/useMovieStore';

const SearchBar: React.FC = () => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  
  const { searchMovies, clearSearch, searchQuery } = useMovieStore();

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (query.trim()) {
        searchMovies(query);
      } else {
        clearSearch();
      }
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [query, searchMovies, clearSearch]);

  const handleClear = () => {
    setQuery('');
    clearSearch();
  };

  return (
    <motion.div 
      className="relative w-full max-w-2xl mx-auto"
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      <div className="relative">
        <Input
          type="text"
          placeholder="Search for movies..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          icon={<Search className="h-4 w-4" />}
          className={`
            pr-12 transition-all duration-200
            ${isFocused ? 'ring-2 ring-red-500 border-red-500' : ''}
          `}
        />
        
        <AnimatePresence>
          {query && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute right-2 top-1/2 transform -translate-y-1/2"
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClear}
                className="p-2 hover:bg-gray-700"
              >
                <X className="h-4 w-4" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Search indicator */}
      <AnimatePresence>
        {searchQuery && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute -bottom-8 left-0 text-sm text-gray-400"
          >
            Searching for "{searchQuery}"
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default SearchBar;