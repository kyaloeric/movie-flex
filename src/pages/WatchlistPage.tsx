import React from 'react';
import { motion } from 'framer-motion';
import { Bookmark, Star, Calendar, Trash2 } from 'lucide-react';
import Button from '../components/ui/Button';
import { useWatchlistStore } from '../stores/useWatchlistStore';
import { tmdbApi } from '../services/tmdbApi';
import type { Movie } from '../types/movie';

interface WatchlistPageProps {
  onMovieClick?: (movie: Movie) => void;
}

const WatchlistPage: React.FC<WatchlistPageProps> = ({ onMovieClick }) => {
  const { watchlist, removeFromWatchlist } = useWatchlistStore();

  const handleRemoveFromWatchlist = (movieId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    removeFromWatchlist(movieId);
  };

  if (watchlist.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-20"
      >
        <Bookmark className="h-16 w-16 text-gray-600 mx-auto mb-4" />
        <div className="text-gray-400 text-lg mb-4">Your watchlist is empty</div>
        <p className="text-gray-500">Start adding movies to your watchlist to see them here</p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Watchlist Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {watchlist.map((movie, index) => {
          const imageUrl = tmdbApi.getImageUrl(movie.poster_path, 'medium');
          const year = movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A';

          return (
            <motion.div
              key={movie.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-gray-900 rounded-lg overflow-hidden shadow-lg cursor-pointer group"
              onClick={() => onMovieClick?.(movie)}
            >
              <div className="flex">
                {/* Poster */}
                <div className="w-24 h-36 flex-shrink-0">
                  <img
                    src={imageUrl}
                    alt={movie.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>

                {/* Content */}
                <div className="flex-1 p-4 flex flex-col justify-between">
                  <div>
                    <h3 className="text-white font-semibold line-clamp-2 mb-2 group-hover:text-red-400 transition-colors">
                      {movie.title}
                    </h3>
                    
                    <div className="flex items-center text-gray-400 text-sm mb-2">
                      <Calendar className="h-3 w-3 mr-1" />
                      <span>{year}</span>
                    </div>

                    <p className="text-gray-400 text-sm line-clamp-2 leading-relaxed mb-3">
                      {movie.overview || 'No description available.'}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <Star className="h-3 w-3 text-yellow-400 fill-current" />
                      <span className="text-xs text-white">{movie.vote_average.toFixed(1)}</span>
                    </div>

                    {/* Remove Button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => handleRemoveFromWatchlist(movie.id, e)}
                      className="p-1 text-gray-400 hover:text-red-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default WatchlistPage;