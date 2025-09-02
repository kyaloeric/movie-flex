import React from 'react';
import { motion } from 'framer-motion';
import { Film, Play } from 'lucide-react';
import Button from '../components/ui/Button';

interface HomePageProps {
  onGetStarted: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg"
          alt="Movie theater background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/30" />
      </div>

      <header className="relative z-10 flex items-center justify-between p-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center space-x-3"
        >
          <div className="bg-red-600 p-2 rounded-lg">
            <Film className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-red-600">MOVIEFLIX</h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Button
            onClick={onGetStarted}
            variant="primary"
            className="bg-red-600 hover:bg-red-700"
          >
            Sign In
          </Button>
        </motion.div>
      </header>

      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-100px)] p-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center max-w-4xl"
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
          >
            Unlimited movies, TV shows, and more
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-300 mb-4"
          >
            Watch anywhere. Cancel anytime.
          </motion.p>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-lg text-gray-400 mb-8"
          >
            Ready to watch? Enter your email to create or restart your membership.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-lg mx-auto"
          >
            <Button
              onClick={onGetStarted}
              size="lg"
              className="bg-red-600 hover:bg-red-700 text-lg px-8 py-3 w-full sm:w-auto"
            >
              <Play className="h-5 w-5 mr-2" />
              Get Started
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-left"
          >
            <div className="text-center">
              <div className="bg-red-600/20 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Film className="h-8 w-8 text-red-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Discover Movies</h3>
              <p className="text-gray-400">Browse popular, top-rated, and now playing movies</p>
            </div>
            
            <div className="text-center">
              <div className="bg-red-600/20 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Play className="h-8 w-8 text-red-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Personal Watchlist</h3>
              <p className="text-gray-400">Save movies to watch later and never miss a great film</p>
            </div>
            
            <div className="text-center">
              <div className="bg-red-600/20 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Film className="h-8 w-8 text-red-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Search & Filter</h3>
              <p className="text-gray-400">Find exactly what you're looking for with powerful search</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default HomePage;