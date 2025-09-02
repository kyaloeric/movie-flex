import React from 'react';
import { motion } from 'framer-motion';
import MovieGrid from '../components/movie/MovieGrid';
import WatchlistPage from './WatchlistPage';
import DiscoverPage from './DiscoverPage';
import { useMovieStore } from '../stores/useMovieStore';
import type { Movie } from '../types/movie';

type ViewType = 'all' | 'popular' | 'top-rated' | 'now-playing' | 'search' | 'watchlist';

interface MoviesPageProps {
  currentView: ViewType;
  onMovieClick: (movie: Movie) => void;
  onViewChange: (view: ViewType) => void;
}

const MoviesPage: React.FC<MoviesPageProps> = ({ currentView, onMovieClick }) => {
  const {
    movies,
    discoverMovies,
    searchResults,
    searchQuery,
    loading,
    searchLoading,
    currentPage,
    searchPage,
    totalPages,
    searchTotalPages,
  } = useMovieStore();

  const moviesToShow = currentView === 'search' 
    ? searchResults 
    : currentView === 'all' 
    ? discoverMovies 
    : movies;
  const isLoading = currentView === 'search' ? searchLoading : loading;
  const currentPageNum = currentView === 'search' ? searchPage : currentPage;
  const totalPagesNum = currentView === 'search' ? searchTotalPages : totalPages;

  return (
    <main className="container mx-auto px-4 py-6">
      {currentView === 'watchlist' ? (
        <WatchlistPage onMovieClick={onMovieClick} />
      ) : currentView === 'all' ? (
        <DiscoverPage onMovieClick={onMovieClick} />
      ) : (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6"
          >
            <h2 className="text-xl md:text-2xl font-bold text-white">
              {currentView === 'search' && searchQuery
                ? `Search results for "${searchQuery}"`
                : currentView === 'popular'
                ? 'Popular Movies'
                : currentView === 'top-rated'
                ? 'Top Rated Movies'
                : currentView === 'now-playing'
                ? 'Now Playing'
                : 'Movies'}
            </h2>
            <p className="text-gray-400 mt-1 text-sm">
              {currentView === 'search' && searchQuery
                ? `Found ${searchResults.length} results`
                : currentView === 'popular'
                ? 'Discover the most popular movies'
                : currentView === 'top-rated'
                ? 'The highest rated movies of all time'
                : currentView === 'now-playing'
                ? 'Movies currently playing in theaters'
                : 'Browse movies'}
            </p>
          </motion.div>

          <MovieGrid
            movies={moviesToShow}
            loading={isLoading}
            onMovieClick={onMovieClick}
            currentView={currentView}
            currentPage={currentPageNum}
            totalPages={totalPagesNum}
          />
        </>
      )}
    </main>
  );
};

export default MoviesPage;