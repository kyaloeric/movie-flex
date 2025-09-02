import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useMovieStore } from '../../stores/useMovieStore';
import { tmdbApi } from '../../services/tmdbApi';
import type { Movie, ApiResponse } from '../../types/movie';

vi.mock('../../services/tmdbApi');
const mockedTmdbApi = vi.mocked(tmdbApi);

describe('useMovieStore', () => {
  beforeEach(() => {
    useMovieStore.setState({
      movies: [],
      currentMovie: null,
      genres: [],
      searchResults: [],
      searchQuery: '',
      searchFilters: { query: '' },
      loading: false,
      searchLoading: false,
      error: null,
      currentPage: 1,
      totalPages: 1,
      hasMorePages: true,
    });

    vi.clearAllMocks();
  });

  it('initializes with correct default state', () => {
    const { result } = renderHook(() => useMovieStore());

    expect(result.current.movies).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.currentPage).toBe(1);
  });

  it('fetches popular movies successfully', async () => {
    const mockResponse: ApiResponse<Movie> = {
      page: 1,
      results: [{ id: 1, title: 'Popular Movie', overview: '', poster_path: null, backdrop_path: null, release_date: '', vote_average: 0, vote_count: 0, genre_ids: [], popularity: 0, adult: false, video: false, original_language: '', original_title: '' }],
      total_pages: 10,
      total_results: 200,
    };

    mockedTmdbApi.getPopularMovies.mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => useMovieStore());

    await act(async () => {
      await result.current.fetchPopularMovies();
    });

    expect(result.current.movies).toEqual(mockResponse.results);
    expect(result.current.currentPage).toBe(1);
    expect(result.current.totalPages).toBe(10);
    expect(result.current.hasMorePages).toBe(true);
    expect(result.current.loading).toBe(false);
  });

  it('handles API errors correctly', async () => {
    const mockError = new Error('API Error');
    mockedTmdbApi.getPopularMovies.mockRejectedValueOnce(mockError);

    const { result } = renderHook(() => useMovieStore());

    await act(async () => {
      await result.current.fetchPopularMovies();
    });

    expect(result.current.error).toBe('API Error');
    expect(result.current.loading).toBe(false);
  });

  it('searches movies successfully', async () => {
    const mockResponse: ApiResponse<Movie> = {
      page: 1,
      results: [{ id: 2, title: 'Search Result', overview: '', poster_path: null, backdrop_path: null, release_date: '', vote_average: 0, vote_count: 0, genre_ids: [], popularity: 0, adult: false, video: false, original_language: '', original_title: '' }],
      total_pages: 5,
      total_results: 100,
    };

    mockedTmdbApi.searchMovies.mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => useMovieStore());

    await act(async () => {
      await result.current.searchMovies('test query');
    });

    expect(result.current.searchResults).toEqual(mockResponse.results);
    expect(result.current.searchQuery).toBe('test query');
    expect(result.current.searchLoading).toBe(false);
  });

  it('clears search results', async () => {
    const { result } = renderHook(() => useMovieStore());

    await act(async () => {
      useMovieStore.setState({
        searchResults: [{ id: 1, title: '', overview: '', poster_path: null, backdrop_path: null, release_date: '', vote_average: 0, vote_count: 0, genre_ids: [], popularity: 0, adult: false, video: false, original_language: '', original_title: '' }],
        searchQuery: 'test',
      });
    });

    await act(async () => {
      result.current.clearSearch();
    });

    expect(result.current.searchResults).toEqual([]);
    expect(result.current.searchQuery).toBe('');
    expect(result.current.searchFilters.query).toBe('');
  });

  it('clears error state', async () => {
    const { result } = renderHook(() => useMovieStore());

    await act(async () => {
      useMovieStore.setState({ error: 'Test error' });
    });

    await act(async () => {
      result.current.clearError();
    });

    expect(result.current.error).toBe(null);
  });
});