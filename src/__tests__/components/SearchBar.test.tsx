import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import SearchBar from '../../components/SearchBar';
import { useMovieStore } from '../../stores/useMovieStore';

// Mock the store
vi.mock('../../stores/useMovieStore');

const mockUseMovieStore = vi.mocked(useMovieStore);

describe('SearchBar', () => {
  const mockSearchMovies = vi.fn();
  const mockClearSearch = vi.fn();

  beforeEach(() => {
    mockUseMovieStore.mockReturnValue({
      searchMovies: mockSearchMovies,
      clearSearch: mockClearSearch,
      searchQuery: '',
      movies: [],
      currentMovie: null,
      genres: [],
      searchResults: [],
      searchFilters: { query: '' },
      loading: false,
      searchLoading: false,
      error: null,
      currentPage: 1,
      totalPages: 1,
      hasMorePages: false,
      fetchPopularMovies: vi.fn(),
      fetchTopRatedMovies: vi.fn(),
      fetchNowPlayingMovies: vi.fn(),
      fetchMovieDetails: vi.fn(),
      fetchGenres: vi.fn(),
      setSearchFilters: vi.fn(),
      clearError: vi.fn(),
      loadMoreMovies: vi.fn(),
    } as any);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders search input correctly', () => {
    render(<SearchBar />);
    
    const input = screen.getByPlaceholderText('Search for movies...');
    expect(input).toBeInTheDocument();
  });

  it('triggers search after debounce delay', async () => {
    render(<SearchBar />);
    
    const input = screen.getByPlaceholderText('Search for movies...');
    fireEvent.change(input, { target: { value: 'test movie' } });
    
    await waitFor(() => {
      expect(mockSearchMovies).toHaveBeenCalledWith('test movie');
    }, { timeout: 1000 });
  });

  it('clears search when input is emptied', async () => {
    render(<SearchBar />);
    
    const input = screen.getByPlaceholderText('Search for movies...');
    fireEvent.change(input, { target: { value: 'test' } });
    fireEvent.change(input, { target: { value: '' } });
    
    await waitFor(() => {
      expect(mockClearSearch).toHaveBeenCalled();
    });
  });

  it('shows clear button when there is text', () => {
    render(<SearchBar />);
    
    const input = screen.getByPlaceholderText('Search for movies...');
    fireEvent.change(input, { target: { value: 'test' } });
    
    // Clear button should appear
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('clears input when clear button is clicked', () => {
    render(<SearchBar />);
    
    const input = screen.getByPlaceholderText('Search for movies...') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'test' } });
    
    const clearButton = screen.getByRole('button');
    fireEvent.click(clearButton);
    
    expect(input.value).toBe('');
    expect(mockClearSearch).toHaveBeenCalled();
  });
});