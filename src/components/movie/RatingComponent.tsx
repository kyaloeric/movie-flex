import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

interface RatingComponentProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  className?: string;
}

const RatingComponent: React.FC<RatingComponentProps> = ({
  rating,
  maxRating = 10,
  size = 'md',
  showValue = true,
  className = '',
}) => {
  const normalizedRating = Math.min(Math.max(rating, 0), maxRating);
  const percentage = (normalizedRating / maxRating) * 100;
  
  const sizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 8) return 'text-green-400';
    if (rating >= 6) return 'text-yellow-400';
    if (rating >= 4) return 'text-orange-400';
    return 'text-red-400';
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className="flex items-center space-x-1">
        <Star className={`${sizes[size]} text-yellow-400 fill-current`} />
        {showValue && (
          <span className={`text-sm font-medium ${getRatingColor(normalizedRating)}`}>
            {normalizedRating.toFixed(1)}
          </span>
        )}
      </div>
      
      <div className="flex-1 bg-gray-700 rounded-full h-2 max-w-20">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className={`h-full rounded-full ${
            normalizedRating >= 8 ? 'bg-green-400' :
            normalizedRating >= 6 ? 'bg-yellow-400' :
            normalizedRating >= 4 ? 'bg-orange-400' : 'bg-red-400'
          }`}
        />
      </div>
    </div>
  );
};

export default RatingComponent;