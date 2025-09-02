import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Navigation from './components/movie/Navigation';
import HomePage from './pages/HomePage';
import MoviesPage from './pages/MoviesPage';
import MovieDetails from './components/movie/MovieDetails';
import AuthModal from './components/auth/AuthModal';
import ErrorBoundary from './components/ErrorBoundary';
import { useAuthStore } from './stores/useAuthStore';
import { useMovieStore } from './stores/useMovieStore';
import type { Movie } from './types/movie';

type ViewType = 'all' | 'popular' | 'top-rated' | 'now-playing' | 'search' | 'watchlist';

function App() {
  const [currentView, setCurrentView] = useState<ViewType>('all');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [, setSelectedMovie] = useState<Movie | null>(null);
  const [showMovieDetails, setShowMovieDetails] = useState(false);

  const { user, loading: authLoading, initializeAuth } = useAuthStore();
  const {
    currentMovie,
    loading,
    fetchDiscoverMovies,
    fetchPopularMovies,
    fetchTopRatedMovies,
    fetchNowPlayingMovies,
    fetchMovieDetails,
    clearSearch,
  } = useMovieStore();

  // Initialize authentication
  useEffect(() => {
    const unsubscribe = initializeAuth();
    return unsubscribe;
  }, [initializeAuth]);

  // Load initial movies
  useEffect(() => {
    if (!authLoading) {
    }
  }, [authLoading, fetchPopularMovies]);

  // Handle view changes
  useEffect(() => {
    if (!authLoading) {
      switch (currentView) {
        case 'all':
          fetchDiscoverMovies();
          break;
        case 'popular':
          fetchPopularMovies(1);
          break;
        case 'top-rated':
          fetchTopRatedMovies(1);
          break;
        case 'now-playing':
          fetchNowPlayingMovies(1);
          break;
        case 'watchlist':
        case 'search':
          break;
      }
    }
  }, [currentView, authLoading, fetchDiscoverMovies, fetchPopularMovies, fetchTopRatedMovies, fetchNowPlayingMovies]);

  const handleViewChange = (view: ViewType) => {
    setCurrentView(view);
    if (view !== 'search') {
      clearSearch();
    }
  };

  const handleMovieClick = async (movie: Movie) => {
    setSelectedMovie(movie);
    setShowMovieDetails(true);
    await fetchMovieDetails(movie.id);
  };

  const handleCloseMovieDetails = () => {
    setShowMovieDetails(false);
    setSelectedMovie(null);
  };

  const handleGetStarted = () => {
    setShowAuthModal(true);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-950">
        {user ? (
          <>
            <Navigation
              currentView={currentView}
              onViewChange={handleViewChange}
            />
            <MoviesPage
              currentView={currentView}
              onMovieClick={handleMovieClick}
              onViewChange={handleViewChange}
            />
            <MovieDetails
              isOpen={showMovieDetails}
              onClose={handleCloseMovieDetails}
              movie={currentMovie}
              loading={loading && showMovieDetails}
            />
          </>
        ) : (
          <HomePage onGetStarted={handleGetStarted} />
        )}

        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
        />
      </div>
    </ErrorBoundary>
  );
}

export default App;