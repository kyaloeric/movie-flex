import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navigation from './components/movie/Navigation';
import SearchBar from './components/movie/SearchBar';
import MovieGrid from './components/movie/MovieGrid';
import WatchlistPage from './pages/WatchlistPage';
import MovieDetails from './components/movie/MovieDetails';
import AuthModal from './components/auth/AuthModal';
import ErrorBoundary from './components/ErrorBoundary';
import Button from './components/ui/Button';
import { User, LogIn } from 'lucide-react';
import { useAuthStore } from './stores/useAuthStore';
import { useMovieStore } from './stores/useMovieStore';
import type { Movie } from './types/movie';

type ViewType = 'popular' | 'top-rated' | 'now-playing' | 'search' | 'watchlist';

function App() {
  const [currentView, setCurrentView] = useState<ViewType>('popular');
  const [showSearch, setShowSearch] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [, setSelectedMovie] = useState<Movie | null>(null);
  const [showMovieDetails, setShowMovieDetails] = useState(false);

  const { user, loading: authLoading, initializeAuth } = useAuthStore();
  const {
    movies,
    searchResults,
    searchQuery,
    loading,
    searchLoading,
    currentMovie,
    fetchPopularMovies,
    fetchTopRatedMovies,
    fetchNowPlayingMovies,
    fetchMovieDetails,
    clearSearch,
  } = useMovieStore();

  useEffect(() => {
    const unsubscribe = initializeAuth();
    return unsubscribe;
  }, [initializeAuth]);

  useEffect(() => {
    if (!authLoading) {
      fetchPopularMovies();
    }
  }, [authLoading, fetchPopularMovies]);

  useEffect(() => {
    if (!authLoading) {
      switch (currentView) {
        case 'popular':
          fetchPopularMovies();
          break;
        case 'top-rated':
          fetchTopRatedMovies();
          break;
        case 'now-playing':
          fetchNowPlayingMovies();
          break;
        case 'watchlist':
          break;
        case 'search':
          break;
      }
    }
  }, [currentView, authLoading, fetchPopularMovies, fetchTopRatedMovies, fetchNowPlayingMovies]);

  const handleViewChange = (view: ViewType) => {
    setCurrentView(view);
    if (view !== 'search') {
      setShowSearch(false);
      clearSearch();
    }
  };

  const handleSearchToggle = () => {
    const newShowSearch = !showSearch;
    setShowSearch(newShowSearch);
    
    if (newShowSearch) {
      setCurrentView('search');
    } else {
      clearSearch();
      setCurrentView('popular');
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

  const moviesToShow = currentView === 'search' ? searchResults : movies;
  const isLoading = currentView === 'search' ? searchLoading : loading;

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
              onSearchToggle={handleSearchToggle}
              showSearch={showSearch}
            />

            <main className="container mx-auto px-4 py-8">
              <AnimatePresence>
                {showSearch && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="mb-8"
                  >
                    <SearchBar />
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-8"
              >
                <h2 className="text-2xl md:text-3xl font-bold text-white">
                  {currentView === 'search' && searchQuery
                    ? `Search results for "${searchQuery}"`
                    : currentView === 'popular'
                    ? 'Popular Movies'
                    : currentView === 'top-rated'
                    ? 'Top Rated Movies'
                    : currentView === 'now-playing'
                    ? 'Now Playing'
                    : currentView === 'watchlist'
                    ? 'My Watchlist'
                    : 'Movies'}
                </h2>
                <p className="text-gray-400 mt-2">
                  {currentView === 'search' && searchQuery
                    ? `Found ${searchResults.length} results`
                    : currentView === 'popular'
                    ? 'Discover the most popular movies'
                    : currentView === 'top-rated'
                    ? 'The highest rated movies of all time'
                    : currentView === 'now-playing'
                    ? 'Movies currently playing in theaters'
                    : currentView === 'watchlist'
                    ? 'Movies you want to watch'
                    : 'Browse movies'}
                </p>
              </motion.div>


              {/* Content based on current view */}
              {currentView === 'watchlist' ? (
                <WatchlistPage onMovieClick={handleMovieClick} />
              ) : (
                <MovieGrid
                  movies={moviesToShow}
                  loading={isLoading}
                  onMovieClick={handleMovieClick}
                />
              )}


            </main>

            <MovieDetails
              isOpen={showMovieDetails}
              onClose={handleCloseMovieDetails}
              movie={currentMovie}
              loading={loading && showMovieDetails}
            />
          </>
        ) : (
          <div className="min-h-screen flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center max-w-md"
            >
              <div className="mb-8">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="inline-flex items-center space-x-2 mb-6"
                >
                  <div className="bg-red-600 p-3 rounded-xl">
                    <User className="h-8 w-8 text-white" />
                  </div>
                  <h1 className="text-3xl font-bold text-white">MovieFlix</h1>
                </motion.div>
                
                <h2 className="text-xl text-gray-300 mb-4">
                  Discover Amazing Movies
                </h2>
                <p className="text-gray-400 mb-8">
                  Sign in to explore thousands of movies, get personalized recommendations, 
                  and create your watchlist.
                </p>
              </div>

              <Button
                onClick={() => setShowAuthModal(true)}
                size="lg"
                className="w-full"
              >
                <LogIn className="h-5 w-5 mr-2" />
                Sign In to Get Started
              </Button>
            </motion.div>
          </div>
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