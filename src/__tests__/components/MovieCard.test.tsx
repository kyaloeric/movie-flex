import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import MovieCard from '../../components/MovieCard';
import { type Movie } from '../../types/movie';

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

  it('handles missing poster path gracefully', () => {
    const movieWithoutPoster = { ...mockMovie, poster_path: null };
    render(<MovieCard movie={movieWithoutPoster} />);
    
    const img = screen.getByAltText('Test Movie') as HTMLImageElement;
    expect(img.src).toContain('placeholder-movie.jpg');
  });

  it('calls onClick when card is clicked', () => {
    const handleClick = vi.fn();
    render(<MovieCard movie={mockMovie} onClick={handleClick} />);
    
    const card = screen.getByText('Test Movie').closest('div');
    fireEvent.click(card!);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('displays popularity indicator for popular movies', () => {
    const popularMovie = { ...mockMovie, popularity: 1500 };
    render(<MovieCard movie={popularMovie} />);
    
    expect(document.querySelector('[data-lucide="trending-up"]')).toBeInTheDocument();
  });

  it('handles missing overview gracefully', () => {
    const movieWithoutOverview = { ...mockMovie, overview: '' };
    render(<MovieCard movie={movieWithoutOverview} />);
    
    expect(screen.getByText('No description available.')).toBeInTheDocument();
  });
});