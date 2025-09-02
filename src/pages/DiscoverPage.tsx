import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import MovieCard from '../components/movie/MovieCard';
import LoadingSkeleton from '../components/ui/LoadingSkeleton';
import { useMovieStore } from '../stores/useMovieStore';
import type { Movie } from '../types/movie';

interface DiscoverPageProps {
  onMovieClick: (movie: Movie) => void;
}

const DiscoverPage: React.FC<DiscoverPageProps> = ({ onMovieClick }) => {
  const { 
    fetchPopularMovies, 
    fetchNowPlayingMovies,
    movies: popularMovies,
    discoverMovies: nowPlayingMovies,
    loading 
  } = useMovieStore();

  useEffect(() => {
    fetchPopularMovies(1);
    fetchNowPlayingMovies(1);
  }, [fetchPopularMovies, fetchNowPlayingMovies]);

  return (
    <div className="space-y-12">
      <section>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h2 className="text-2xl font-bold text-white mb-2">Trending Now</h2>
          <p className="text-gray-400">Explore trending and popular movies from our extensive library.</p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {loading ? (
            Array.from({ length: 10 }, (_, i) => (
              <LoadingSkeleton key={`trending-${i}`} variant="card" />
            ))
          ) : (
            popularMovies.slice(0, 10).map((movie, index) => (
              <MovieCard
                key={`trending-${movie.id}`}
                movie={movie}
                index={index}
                onClick={() => onMovieClick(movie)}
              />
            ))
          )}
        </div>
      </section>

      {/* New Releases Section */}
      <section>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <h2 className="text-2xl font-bold text-white mb-2">Old Releases</h2>
          <p className="text-gray-400">Old movies now playing in theaters.</p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {loading ? (
            Array.from({ length: 10 }, (_, i) => (
              <LoadingSkeleton key={`new-${i}`} variant="card" />
            ))
          ) : (
            nowPlayingMovies.slice(0, 10).map((movie, index) => (
              <MovieCard
                key={`new-${movie.id}`}
                movie={movie}
                index={index}
                onClick={() => onMovieClick(movie)}
              />
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default DiscoverPage;