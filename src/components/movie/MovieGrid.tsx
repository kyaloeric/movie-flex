import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import MovieCard from './MovieCard';
import LoadingSkeleton from '../ui/LoadingSkeleton';
import type { Movie } from '../../types/movie';
import { useMovieStore } from '../../stores/useMovieStore';

interface MovieGridProps {
  movies: Movie[];
  loading?: boolean;
  onMovieClick?: (movie: Movie) => void;
}

const MovieGrid: React.FC<MovieGridProps> = ({ 
  movies, 
  loading = false, 
  onMovieClick 
}) => {
  const { loadMoreMovies, hasMorePages, searchLoading } = useMovieStore();
  
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false,
  });

  // Load more movies when the sentinel comes into view
  React.useEffect(() => {
    if (inView && hasMorePages && !loading && !searchLoading) {
      loadMoreMovies();
    }
  }, [inView, hasMorePages, loading, searchLoading, loadMoreMovies]);

  return (
    <div className="w-full">
      {/* Movie Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
        {movies.map((movie, index) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            index={index}
            onClick={() => onMovieClick?.(movie)}
          />
        ))}

        {/* Loading Skeletons */}
        {loading &&
          Array.from({ length: 10 }, (_, i) => (
            <LoadingSkeleton key={i} variant="card" />
          ))}
      </div>

      {/* Empty State */}
      {!loading && movies.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <div className="text-gray-400 text-lg mb-4">No movies found</div>
          <p className="text-gray-500">Try adjusting your search terms or browse popular movies</p>
        </motion.div>
      )}

      {/* Load More Trigger */}
      {hasMorePages && !loading && (
        <div ref={ref} className="h-20 flex items-center justify-center">
          {searchLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-gray-400"
            >
              Loading more movies...
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
};

export default MovieGrid;