import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import WatchlistButton from '../../components/movie/WatchlistButton';
import type { Movie } from '../../types/movie';

const mockAddToWatchlist = vi.fn();
const mockRemoveFromWatchlist = vi.fn();
const mockIsInWatchlist = vi.fn();

vi.mock('../../stores/useWatchlistStore', () => ({
  useWatchlistStore: () => ({
    addToWatchlist: mockAddToWatchlist,
    removeFromWatchlist: mockRemoveFromWatchlist,
    isInWatchlist: mockIsInWatchlist,
  }),
}));

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  },
}));

const mockMovie: Movie = {
  id: 1,
  title: 'Test Movie',
  overview: 'Test overview',
  poster_path: '/test.jpg',
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

describe('WatchlistButton', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows "Add to Watchlist" when movie is not in watchlist', () => {
    mockIsInWatchlist.mockReturnValue(false);
    
    render(<WatchlistButton movie={mockMovie} />);
    
    expect(screen.getByText('Add to Watchlist')).toBeInTheDocument();
  });

  it('shows "In Watchlist" when movie is in watchlist', () => {
    mockIsInWatchlist.mockReturnValue(true);
    
    render(<WatchlistButton movie={mockMovie} />);
    
    expect(screen.getByText('In Watchlist')).toBeInTheDocument();
  });

  it('adds movie to watchlist when clicked and not in watchlist', () => {
    mockIsInWatchlist.mockReturnValue(false);
    
    render(<WatchlistButton movie={mockMovie} />);
    
    fireEvent.click(screen.getByText('Add to Watchlist'));
    
    expect(mockAddToWatchlist).toHaveBeenCalledWith(mockMovie);
  });

  it('removes movie from watchlist when clicked and in watchlist', () => {
    mockIsInWatchlist.mockReturnValue(true);
    
    render(<WatchlistButton movie={mockMovie} />);
    
    fireEvent.click(screen.getByText('In Watchlist'));
    
    expect(mockRemoveFromWatchlist).toHaveBeenCalledWith(mockMovie.id);
  });

  it('prevents event propagation when clicked', () => {
    mockIsInWatchlist.mockReturnValue(false);
    const parentClickHandler = vi.fn();
    
    render(
      <div onClick={parentClickHandler}>
        <WatchlistButton movie={mockMovie} />
      </div>
    );
    
    fireEvent.click(screen.getByText('Add to Watchlist'));
    
    expect(mockAddToWatchlist).toHaveBeenCalled();
    expect(parentClickHandler).not.toHaveBeenCalled();
  });

  it('renders with different sizes', () => {
    mockIsInWatchlist.mockReturnValue(false);
    
    render(<WatchlistButton movie={mockMovie} size="sm" />);
    
    expect(screen.getByText('Add to Watchlist')).toBeInTheDocument();
  });

  it('renders with different variants', () => {
    mockIsInWatchlist.mockReturnValue(false);
    
    render(<WatchlistButton movie={mockMovie} variant="primary" />);
    
    expect(screen.getByText('Add to Watchlist')).toBeInTheDocument();
  });
});