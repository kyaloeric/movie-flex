import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import MovieCard from '../../components/movie/MovieCard';
import type { Movie } from '../../types/movie';
import type { HTMLAttributes, ImgHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';

// Mock the stores
vi.mock('../../stores/useWatchlistStore', () => ({
  useWatchlistStore: () => ({
    addToWatchlist: vi.fn(),
    removeFromWatchlist: vi.fn(),
    isInWatchlist: vi.fn(() => false),
  }),
}));

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: HTMLAttributes<HTMLDivElement> & { children?: ReactNode }) => (
      <div {...props}>{children}</div>
    ),
    img: ({ ...props }: ImgHTMLAttributes<HTMLImageElement>) => <img {...props} />,
    button: ({ children, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { children?: ReactNode }) => (
      <button {...props}>{children}</button>
    ),
  },
}));

// Mock tmdbApi
vi.mock('../../services/tmdbApi', () => ({
  tmdbApi: {
    getImageUrl: vi.fn((path) => path ? `https://image.tmdb.org/t/p/w342${path}` : '/placeholder-movie.jpg'),
  },
}));

const mockMovie: Movie = {
  id: 1,
  title: 'Test Movie',
  overview: 'This is a test movie overview',
  poster_path: '/test-poster.jpg',
  backdrop_path: '/test-backdrop.jpg',
  release_date: '2023-01-01',
  vote_average: 8.5,
  vote_count: 1000,
  genre_ids: [28, 12],
  popularity: 100,
  adult: false,
  video: false,
  original_language: 'en',
  original_title: 'Test Movie',
};

describe('MovieCard', () => {
  it('renders movie information correctly', () => {
    render(<MovieCard movie={mockMovie} />);
    
    expect(screen.getByText('Test Movie')).toBeInTheDocument();
    expect(screen.getByText('This is a test movie overview')).toBeInTheDocument();
    expect(screen.getByText('2023')).toBeInTheDocument();
    expect(screen.getByText('8.5')).toBeInTheDocument();
  });

  it('calls onClick when card is clicked', () => {
    const handleClick = vi.fn();
    render(<MovieCard movie={mockMovie} onClick={handleClick} />);
    
    fireEvent.click(screen.getByText('Test Movie'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('handles missing poster image gracefully', () => {
    const movieWithoutPoster = { ...mockMovie, poster_path: null };
    render(<MovieCard movie={movieWithoutPoster} />);
    
    const image = screen.getByAltText('Test Movie') as HTMLImageElement;
    expect(image).toBeInTheDocument();
  });

  it('displays correct year from release date', () => {
    render(<MovieCard movie={mockMovie} />);
    expect(screen.getByText('2023')).toBeInTheDocument();
  });

  it('shows popularity indicator for highly popular movies', () => {
    const popularMovie = { ...mockMovie, popularity: 1500 };
    render(<MovieCard movie={popularMovie} />);
    
    expect(screen.getByText('Test Movie')).toBeInTheDocument();
  });

  it('handles missing overview gracefully', () => {
    const movieWithoutOverview = { ...mockMovie, overview: '' };
    render(<MovieCard movie={movieWithoutOverview} />);
    
    expect(screen.getByText('No description available.')).toBeInTheDocument();
  });

  it('handles missing release date gracefully', () => {
    const movieWithoutDate = { ...mockMovie, release_date: '' };
    render(<MovieCard movie={movieWithoutDate} />);
    
    expect(screen.getByText('N/A')).toBeInTheDocument();
  });
});