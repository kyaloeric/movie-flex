import React from 'react';
import { motion } from 'framer-motion';

interface LoadingSkeletonProps {
  className?: string;
  variant?: 'card' | 'text' | 'avatar' | 'button';
  count?: number;
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  className = '',
  variant = 'card',
  count = 1,
}) => {
  const skeletonClasses = {
    card: 'h-64 w-full bg-gray-800 rounded-lg',
    text: 'h-4 bg-gray-800 rounded',
    avatar: 'h-12 w-12 bg-gray-800 rounded-full',
    button: 'h-10 w-24 bg-gray-800 rounded-md',
  };

  const Skeleton = () => (
    <motion.div
      className={`${skeletonClasses[variant]} ${className}`}
      animate={{
        opacity: [0.5, 1, 0.5],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  );

  if (count === 1) {
    return <Skeleton />;
  }

  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <Skeleton key={i} />
      ))}
    </>
  );
};

export default LoadingSkeleton;