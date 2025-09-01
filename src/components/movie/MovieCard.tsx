import React from 'react';
import { motion } from 'framer-motion';
import WatchlistButton from './WatchlistButton';
import { Star, Calendar, TrendingUp } from 'lucide-react';
import type { Movie } from '../../types/movie';
import { tmdbApi } from '../../services/tmdbApi';

interface MovieCardProps {
  movie: Movie;
  onClick?: () => void;
  index?: number;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, onClick, index = 0 }) => {
  const imageUrl = tmdbApi.getImageUrl(movie.poster_path, 'medium');
  const year = movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A';
  const rating = movie.vote_average.toFixed(1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="bg-gray-900 rounded-lg overflow-hidden shadow-lg cursor-pointer group"
      onClick={onClick}
    >
      {/* Poster */}
      <div className="relative aspect-[2/3] overflow-hidden">
        <motion.img
          src={imageUrl}
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/placeholder-movie.jpg';
          }}
        />
                
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {/* Watchlist Button */}
          <div className="absolute bottom-2 left-2">
            <WatchlistButton movie={movie} size="sm" variant="ghost" />
          </div>
        </div>

        {/* Rating */}
        <div className="absolute top-2 right-2 bg-black bg-opacity-80 rounded-full px-2 py-1 flex items-center space-x-1">
          <Star className="h-3 w-3 text-yellow-400 fill-current" />
          <span className="text-xs text-white font-medium">{rating}</span>
        </div>

        {/* Popularity indicator */}
        {movie.popularity > 1000 && (
          <div className="absolute top-2 left-2 bg-red-600 rounded-full p-1">
            <TrendingUp className="h-3 w-3 text-white" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-white font-semibold line-clamp-2 mb-2 group-hover:text-red-400 transition-colors">
          {movie.title}
        </h3>
        
        <div className="flex items-center text-gray-400 text-sm mb-2">
          <Calendar className="h-3 w-3 mr-1" />
          <span>{year}</span>
        </div>

        <p className="text-gray-400 text-sm line-clamp-3 leading-relaxed">
          {movie.overview || 'No description available.'}
        </p>
      </div>
    </motion.div>
  );
};

export default MovieCard;