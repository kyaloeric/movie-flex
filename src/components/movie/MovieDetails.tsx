import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, Calendar, Clock, DollarSign, Users } from 'lucide-react';
import Button from '../ui/Button';
import WatchlistButton from './WatchlistButton';
import LoadingSkeleton from '../ui/LoadingSkeleton';
import type { MovieDetails as MovieDetailsType } from '../../types/movie';
import { tmdbApi } from '../../services/tmdbApi';

interface MovieDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  movie: MovieDetailsType | null;
  loading: boolean;
}

const MovieDetails: React.FC<MovieDetailsProps> = ({
  isOpen,
  onClose,
  movie,
  loading,
}) => {
  if (!isOpen) return null;

  const posterUrl = movie ? tmdbApi.getImageUrl(movie.poster_path, 'large') : '';

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatRuntime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return hours > 0 ? `${hours}h ${remainingMinutes}m` : `${minutes}m`;
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-80"
          onClick={onClose}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-4xl max-h-[90vh] mx-4 bg-gray-900 rounded-lg overflow-hidden shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <Button
            variant="ghost"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 z-10"
          >
            <X className="h-5 w-5" />
          </Button>

          {loading ? (
            <div className="p-6">
              <LoadingSkeleton variant="card" className="h-96" />
              <div className="mt-4 space-y-2">
                <LoadingSkeleton variant="text" className="w-3/4" />
                <LoadingSkeleton variant="text" className="w-1/2" />
                <LoadingSkeleton variant="text" />
              </div>
            </div>
          ) : movie ? (
            <div className="p-6 overflow-y-auto max-h-[90vh]">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-shrink-0">
                  <img
                    src={posterUrl}
                    alt={movie.title}
                    className="w-40 md:w-48 h-60 md:h-72 object-cover rounded-lg shadow-lg mx-auto md:mx-0"
                  />
                </div>

                <div className="flex-1 space-y-4">
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                      {movie.title}
                    </h2>
                    {movie.tagline && (
                      <p className="text-gray-400 italic">{movie.tagline}</p>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-white font-medium">{movie.vote_average.toFixed(1)}</span>
                      <span className="text-gray-400">({movie.vote_count.toLocaleString()} votes)</span>
                    </div>
                    
                    {movie.release_date && (
                      <div className="flex items-center space-x-1 text-gray-400">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(movie.release_date).getFullYear()}</span>
                      </div>
                    )}

                    {movie.runtime && (
                      <div className="flex items-center space-x-1 text-gray-400">
                        <Clock className="h-4 w-4" />
                        <span>{formatRuntime(movie.runtime)}</span>
                      </div>
                    )}
                  </div>

                  {movie.genres && movie.genres.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {movie.genres.map((genre) => (
                        <span
                          key={genre.id}
                          className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-sm"
                        >
                          {genre.name}
                        </span>
                      ))}
                    </div>
                  )}

                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Overview</h3>
                    <p className="text-gray-300 leading-relaxed">
                      {movie.overview || 'No overview available.'}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-800">
                    <WatchlistButton movie={movie} />
                  </div>

                  {(movie.budget > 0 || movie.revenue > 0) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {movie.budget > 0 && (
                        <div className="flex items-center space-x-2">
                          <DollarSign className="h-4 w-4 text-green-400" />
                          <span className="text-gray-400">Budget:</span>
                          <span className="text-white font-medium">
                            {formatCurrency(movie.budget)}
                          </span>
                        </div>
                      )}
                      {movie.revenue > 0 && (
                        <div className="flex items-center space-x-2">
                          <DollarSign className="h-4 w-4 text-yellow-400" />
                          <span className="text-gray-400">Revenue:</span>
                          <span className="text-white font-medium">
                            {formatCurrency(movie.revenue)}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {movie.credits?.cast && movie.credits.cast.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3 flex items-center space-x-2">
                        <Users className="h-5 w-5" />
                        <span>Cast</span>
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {movie.credits.cast.slice(0, 6).map((actor) => (
                          <div key={actor.id} className="bg-gray-800 p-3 rounded-lg">
                            <p className="text-white font-medium text-sm truncate">{actor.name}</p>
                            <p className="text-gray-400 text-xs truncate">{actor.character}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {movie.production_companies && movie.production_companies.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Production</h3>
                      <div className="flex flex-wrap gap-2">
                        {movie.production_companies.slice(0, 3).map((company) => (
                          <span
                            key={company.id}
                            className="text-gray-400 text-sm"
                          >
                            {company.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 text-center">
              <p className="text-gray-400">Movie details not available</p>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default MovieDetails;