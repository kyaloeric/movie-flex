import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { useMovieStore } from '../../stores/useMovieStore';

interface SearchBarProps {
  onSearchStart?: () => void;
  onReturnToDiscover?: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearchStart, onReturnToDiscover }) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  
  const { searchMovies, clearSearch, searchQuery } = useMovieStore();

  const handleSearch = () => {
    if (query.trim()) {
      searchMovies(query, 1);
      onSearchStart?.();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleClear = () => {
    setQuery('');
    clearSearch();
    onReturnToDiscover?.();
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  return (
    <div className="relative w-full max-w-2xl">
      <div className="relative flex items-center">
        <Input
          type="text"
          placeholder="Search movies, actors, directors..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={`
            pr-16 transition-all duration-200 h-12 text-base
            ${isFocused ? 'ring-2 ring-red-500 border-red-500' : 'border-gray-600'}
          `}
        />
        
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
          <AnimatePresence>
            {query && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClear}
                  className="p-1.5 hover:bg-gray-700 rounded-full text-gray-400 hover:text-red-400"
                >
                  <X className="h-4 w-4" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSearch}
            disabled={!query.trim()}
            className="p-1.5 hover:bg-gray-700 rounded-full text-gray-400 hover:text-red-400"
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {searchQuery && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute -bottom-6 left-0 text-xs text-gray-400"
          >
            Searching for "{searchQuery}"
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;