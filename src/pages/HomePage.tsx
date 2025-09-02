import React from 'react';
import { motion } from 'framer-motion';
import { Film, Play } from 'lucide-react';
import Button from '../components/ui/Button';

interface HomePageProps {
  onGetStarted: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ onGetStarted }) => {
  return (
    <div className="h-screen relative overflow-hidden flex flex-col">
      <div className="absolute inset-0">
        <img
          src="https://images.pexels.com/photos/7991241/pexels-photo-7991241.jpeg"
          alt="Movie theater background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/70" />
      </div>

      <header className="relative z-10 flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-2">
          <div className="bg-red-600 p-1.5 rounded">
            <Film className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-lg font-bold text-red-600">MOVIEFLIX</h1>
        </div>
        <Button
          onClick={onGetStarted}
          variant="primary"
          className="bg-red-600 hover:bg-red-700 px-3 py-1 text-sm"
        >
          Sign In
        </Button>
      </header>

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center text-center px-4">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl md:text-4xl font-bold text-white mb-3"
        >
          Discover movies, TV shows, and more
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-base md:text-lg text-gray-300 mb-2"
        >
        Sign in to explore thousands of movies, get personalized 
         <br></br> recommendations, nd create your watchlist.
        </motion.p>

        <Button
          onClick={onGetStarted}
          className="bg-red-600 hover:bg-red-700 px-6 py-2 text-base mt-4"
        >
          <Play className="h-4 w-4 mr-2" />
          Get Started
        </Button>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl w-full">
          <div className="text-center px-2">
            <Film className="h-6 w-6 text-red-600 mx-auto mb-2" />
            <h3 className="text-sm font-semibold text-white">Discover Movies</h3>
            <p className="text-xs text-gray-400">
              Browse popular and top-rated titles
            </p>
          </div>
          <div className="text-center px-2">
            <Play className="h-6 w-6 text-red-600 mx-auto mb-2" />
            <h3 className="text-sm font-semibold text-white">Watchlist</h3>
            <p className="text-xs text-gray-400">
              Save films to watch later
            </p>
          </div>
          <div className="text-center px-2">
            <Film className="h-6 w-6 text-red-600 mx-auto mb-2" />
            <h3 className="text-sm font-semibold text-white">Search</h3>
            <p className="text-xs text-gray-400">
              Find exactly what you need
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;