import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Film, User, LogOut, TrendingUp, Star, Bookmark, Menu, X, Compass } from 'lucide-react';
import SearchBar from '../movie/SearchBar';
import Button from '../ui/Button';
import { useAuthStore } from '../../stores/useAuthStore';

interface NavigationProps {
  currentView: 'all' | 'popular' | 'top-rated' | 'now-playing' | 'search' | 'watchlist';
  onViewChange: (view: 'all' | 'popular' | 'top-rated' | 'now-playing' | 'search' | 'watchlist') => void;
}

const Navigation: React.FC<NavigationProps> = ({
  currentView,
  onViewChange,
}) => {
  const { user, signOut } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'all' as const, label: 'Discover', icon: Compass },
    { id: 'popular' as const, label: 'Popular', icon: TrendingUp },
    { id: 'top-rated' as const, label: 'Top Rated', icon: Star },
    { id: 'now-playing' as const, label: 'Now Playing', icon: Film },
    { id: 'watchlist' as const, label: 'Watchlist', icon: Bookmark },
  ];

  const handleNavClick = (viewId: typeof navItems[0]['id']) => {
    onViewChange(viewId);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-40 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800"
      >
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-between">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-2"
            >
              <div className="bg-red-600 p-1 rounded-lg">
                <Film className="h-4 w-4 text-white" />
              </div>
              <h1 className="text-base font-bold text-white">MovieFlix</h1>
            </motion.div>

            <div className="hidden md:block flex-1 max-w-2xl mx-8">
              <SearchBar 
                onSearchStart={() => onViewChange('search')} 
                onReturnToDiscover={() => onViewChange('all')}
              />
            </div>

            <nav className="hidden md:flex items-center space-x-1 mr-4">
              {navItems.map((item) => (
                <Button
                  key={item.id}
                  variant={currentView === item.id ? 'primary' : 'ghost'}
                  onClick={() => onViewChange(item.id)}
                  size="sm"
                  className="flex items-center space-x-1 px-2 py-1"
                >
                  <item.icon className="h-3 w-3" />
                  <span className="text-xs">{item.label}</span>
                </Button>
              ))}
            </nav>

            <div className="flex items-center space-x-2">
              {user && (
                <div className="flex items-center space-x-2">
                  <div className="hidden sm:flex items-center space-x-1 px-2 py-1 bg-gray-800 rounded-full">
                    <User className="h-3 w-3 text-gray-400" />
                    <span className="text-xs text-gray-300 max-w-20 truncate">
                      {user.displayName || user.email}
                    </span>
                  </div>
                  <Button variant="ghost" onClick={signOut} size="sm" className="p-1">
                    <LogOut className="h-3 w-3" />
                  </Button>
                </div>
              )}
              
              {/* Mobile Menu Toggle */}
              <div className="md:hidden">
                <Button
                  variant="ghost"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  size="sm"
                  className="p-1"
                >
                  {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </div>

          <div className="md:hidden mt-2">
            <SearchBar 
              onSearchStart={() => onViewChange('search')} 
              onReturnToDiscover={() => onViewChange('all')}
            />
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed left-0 top-0 h-full w-64 bg-gray-900 border-r border-gray-800 z-50 md:hidden"
            >
              <div className="p-4">
                <div className="flex items-center space-x-2 mb-6">
                  <div className="bg-red-600 p-1 rounded-lg">
                    <Film className="h-5 w-5 text-white" />
                  </div>
                  <h1 className="text-base font-bold text-white">MovieFlix</h1>
                </div>

                <nav className="space-y-1">
                  {navItems.map((item) => (
                    <Button
                      key={item.id}
                      variant={currentView === item.id ? 'primary' : 'ghost'}
                      onClick={() => handleNavClick(item.id)}
                      className="w-full justify-start flex items-center space-x-3 p-2 text-sm"
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Button>
                  ))}
                </nav>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navigation;