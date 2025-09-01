import React from 'react';
import { motion } from 'framer-motion';
import { Film, Search, User, LogOut, TrendingUp, Star, Bookmark } from 'lucide-react';
import Button from '../ui/Button';
import { useAuthStore } from '../../stores/useAuthStore';

interface NavigationProps {
  currentView: 'popular' | 'top-rated' | 'now-playing' | 'search' | 'watchlist';
  onViewChange: (view: 'popular' | 'top-rated' | 'now-playing' | 'search' | 'watchlist') => void;
  onSearchToggle: () => void;
  showSearch: boolean;
}

const Navigation: React.FC<NavigationProps> = ({
  currentView,
  onViewChange,
  onSearchToggle,
  showSearch,
}) => {
  const { user, signOut } = useAuthStore();

  const navItems = [
    { id: 'popular' as const, label: 'Popular', icon: TrendingUp },
    { id: 'top-rated' as const, label: 'Top Rated', icon: Star },
    { id: 'now-playing' as const, label: 'Now Playing', icon: Film },
    { id: 'watchlist' as const, label: 'Watchlist', icon: Bookmark },
  ];

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-40 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-2"
          >
            <div className="bg-red-600 p-2 rounded-lg">
              <Film className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-white">MovieFlix</h1>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Button
                key={item.id}
                variant={currentView === item.id ? 'primary' : 'ghost'}
                onClick={() => onViewChange(item.id)}
                className="flex items-center space-x-2"
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Button>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              onClick={onSearchToggle}
              className={`${showSearch ? 'text-red-400' : ''}`}
            >
              <Search className="h-4 w-4" />
            </Button>

            {user && (
              <div className="flex items-center space-x-2">
                <div className="hidden sm:flex items-center space-x-2 px-3 py-1 bg-gray-800 rounded-full">
                  <User className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-300 max-w-24 truncate">
                    {user.displayName || user.email}
                  </span>
                </div>
                <Button variant="ghost" onClick={signOut} className="p-2">
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden mt-4 flex items-center space-x-1 overflow-x-auto">
          {navItems.map((item) => (
            <Button
              key={item.id}
              variant={currentView === item.id ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => onViewChange(item.id)}
              className="flex items-center space-x-2 whitespace-nowrap"
            >
              <item.icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Button>
          ))}
        </div>
      </div>
    </motion.header>
  );
};

export default Navigation;