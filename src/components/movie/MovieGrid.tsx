import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import MovieCard from './MovieCard';
import LoadingSkeleton from '../ui/LoadingSkeleton';
import Pagination from '../ui/Pagination';
import type { Movie } from '../../types/movie';
import { useMovieStore } from '../../stores/useMovieStore';

interface MovieGridProps {
  movies: Movie[];
  loading?: boolean;
  onMovieClick?: (movie: Movie) => void;
  currentView?: string;
  currentPage?: number;
  totalPages?: number;
}

const MovieGrid: React.FC<MovieGridProps> = ({ 
  movies, 
  loading = false, 
  onMovieClick,
  currentView = 'all',
  currentPage = 1,
  totalPages = 1,
}) => {
  const { 
    fetchDiscoverMovies,
    fetchPopularMovies, 
    fetchTopRatedMovies,
    fetchNowPlayingMovies,
    searchMovies,
    searchQuery,
  } = useMovieStore();

  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (!loading) {
      setHasSearched(true);
    }
  }, [loading]);

  const handlePageChange = (page: number) => {
    if (currentView === 'search' && searchQuery) {
      searchMovies(searchQuery, page);
    } else if (currentView === 'all') {
      fetchDiscoverMovies(page);
    } else if (currentView === 'popular') {
      fetchPopularMovies(page);
    } else if (currentView === 'top-rated') {
      fetchTopRatedMovies(page);
    } else if (currentView === 'now-playing') {
      fetchNowPlayingMovies(page);
    } else {
      fetchPopularMovies(page);
    }
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
        {movies.map((movie, index) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            index={index}
            onClick={() => onMovieClick?.(movie)}
          />
        ))}

        {loading &&
          Array.from({ length: 10 }, (_, i) => (
            <LoadingSkeleton key={i} variant="card" />
          ))}
      </div>

      {!loading && hasSearched && movies.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="text-center py-12"
        >
          <div className="text-gray-400 text-lg mb-4">No movies found</div>
          <p className="text-gray-500">
            Try adjusting your search terms or browse popular movies
          </p>
        </motion.div>
      )}

      {!loading && hasSearched && movies.length > 0 && totalPages > 1 && (
        <div className="mt-6">
          <Pagination
            currentPage={currentPage || 1}
            totalPages={totalPages || 1}
            onPageChange={handlePageChange}
            loading={loading}
          />
        </div>
      )}
    </div>
  );
};

export default MovieGrid;
