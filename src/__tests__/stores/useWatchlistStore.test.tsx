import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useWatchlistStore } from '../../stores/useWatchlistStore';
import type { Movie } from '../../types/movie';

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

describe('useWatchlistStore', () => {
  beforeEach(() => {
    const { result } = renderHook(() => useWatchlistStore());
    act(() => {
      result.current.watchlist.forEach(item => {
        result.current.removeFromWatchlist(item.id);
      });
    });
  });

  it('adds movie to watchlist', () => {
    const { result } = renderHook(() => useWatchlistStore());
    
    act(() => {
      result.current.addToWatchlist(mockMovie);
    });
    
    expect(result.current.watchlist).toHaveLength(1);
    expect(result.current.watchlist[0].id).toBe(mockMovie.id);
    expect(result.current.isInWatchlist(mockMovie.id)).toBe(true);
  });

  it('removes movie from watchlist', () => {
    const { result } = renderHook(() => useWatchlistStore());
    
    act(() => {
      result.current.addToWatchlist(mockMovie);
    });
    
    expect(result.current.watchlist).toHaveLength(1);
    
    act(() => {
      result.current.removeFromWatchlist(mockMovie.id);
    });
    
    expect(result.current.watchlist).toHaveLength(0);
    expect(result.current.isInWatchlist(mockMovie.id)).toBe(false);
  });

  it('prevents duplicate movies in watchlist', () => {
    const { result } = renderHook(() => useWatchlistStore());
    
    act(() => {
      result.current.addToWatchlist(mockMovie);
      result.current.addToWatchlist(mockMovie);
    });
    
    expect(result.current.watchlist).toHaveLength(1);
  });
});