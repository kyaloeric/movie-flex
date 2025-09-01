import React from 'react';
import { motion } from 'framer-motion';
import { Bookmark, BookmarkCheck } from 'lucide-react';
import Button from '../ui/Button';
import { useWatchlistStore } from '../../stores/useWatchlistStore';
import type { Movie } from '../../types/movie';

interface WatchlistButtonProps {
  movie: Movie;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
}

const WatchlistButton: React.FC<WatchlistButtonProps> = ({
  movie,
  size = 'md',
  variant = 'outline',
}) => {
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlistStore();
  
  const inWatchlist = isInWatchlist(movie.id);

  const handleToggleWatchlist = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering parent click events
    
    if (inWatchlist) {
      removeFromWatchlist(movie.id);
    } else {
      addToWatchlist(movie);
    }
  };

  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <Button
        variant={inWatchlist ? 'primary' : variant}
        size={size}
        onClick={handleToggleWatchlist}
        className={`
          ${inWatchlist 
            ? 'bg-red-600 hover:bg-red-700 text-white' 
            : 'border-gray-600 text-gray-300 hover:border-red-500 hover:text-red-400'
          }
        `}
      >
        {inWatchlist ? (
          <>
            <BookmarkCheck className="h-4 w-4 mr-2" />
            In Watchlist
          </>
        ) : (
          <>
            <Bookmark className="h-4 w-4 mr-2" />
            Add to Watchlist
          </>
        )}
      </Button>
    </motion.div>
  );
};

export default WatchlistButton;