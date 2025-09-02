import { create } from 'zustand';
import type { Movie, MovieDetails, Genre, SearchFilters } from '../types/movie';
import { tmdbApi } from '../services/tmdbApi';

interface MovieStore {
  movies: Movie[];
  discoverMovies: Movie[];
  currentMovie: MovieDetails | null;
  genres: Genre[];
  searchResults: Movie[];
  searchQuery: string;
  searchFilters: SearchFilters;
  loading: boolean;
  searchLoading: boolean;
  error: string | null;
  currentPage: number;
  searchPage: number;
  totalPages: number;
  searchTotalPages: number;
  hasMorePages: boolean;
  hasMoreSearchPages: boolean;
  
  fetchDiscoverMovies: (page?: number, append?: boolean) => Promise<void>;
  fetchPopularMovies: (page?: number, append?: boolean) => Promise<void>;
  fetchTopRatedMovies: (page?: number, append?: boolean) => Promise<void>;
  fetchNowPlayingMovies: (page?: number, append?: boolean) => Promise<void>;
  fetchMovieDetails: (movieId: number) => Promise<void>;
  searchMovies: (query: string, page?: number, append?: boolean) => Promise<void>;
  fetchGenres: () => Promise<void>;
  setSearchFilters: (filters: Partial<SearchFilters>) => void;
  clearSearch: () => void;
  clearError: () => void;
  loadMoreMovies: () => Promise<void>;
  loadMoreSearchResults: () => Promise<void>;
}

export const useMovieStore = create<MovieStore>((set, get) => ({
  movies: [],
  discoverMovies: [],
  currentMovie: null,
  genres: [],
  searchResults: [],
  searchQuery: '',
  searchFilters: { query: '' },
  loading: false,
  searchLoading: false,
  error: null,
  currentPage: 1,
  searchPage: 1,
  totalPages: 1,
  searchTotalPages: 1,
  hasMorePages: true,
  hasMoreSearchPages: true,

  fetchDiscoverMovies: async (page = 1, append = false) => {
    set({ loading: true, error: null });
    try {
      const response = await tmdbApi.discoverMovies(page);
      set((state) => ({
        discoverMovies: append ? [...state.discoverMovies, ...response.results] : response.results,
        currentPage: response.page,
        totalPages: Math.min(response.total_pages, 500), 
        hasMorePages: response.page < Math.min(response.total_pages, 500),
        loading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  fetchPopularMovies: async (page = 1, append = false) => {
    set({ loading: true, error: null });
    try {
      const response = await tmdbApi.getPopularMovies(page);
      set((state) => ({
        movies: append ? [...state.movies, ...response.results] : response.results,
        currentPage: response.page,
        totalPages: Math.min(response.total_pages, 500),
        hasMorePages: response.page < Math.min(response.total_pages, 500),
        loading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  fetchTopRatedMovies: async (page = 1, append = false) => {
    set({ loading: true, error: null });
    try {
      const response = await tmdbApi.getTopRatedMovies(page);
      set((state) => ({
        movies: append ? [...state.movies, ...response.results] : response.results,
        currentPage: response.page,
        totalPages: Math.min(response.total_pages, 500),
        hasMorePages: response.page < Math.min(response.total_pages, 500),
        loading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  fetchNowPlayingMovies: async (page = 1, append = false) => {
    set({ loading: true, error: null });
    try {
      const response = await tmdbApi.getNowPlayingMovies(page);
      set((state) => ({
        movies: append ? [...state.movies, ...response.results] : response.results,
        currentPage: response.page,
        totalPages: Math.min(response.total_pages, 500),
        hasMorePages: response.page < Math.min(response.total_pages, 500),
        loading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  fetchMovieDetails: async (movieId: number) => {
    set({ loading: true, error: null });
    try {
      const [details, credits] = await Promise.all([
        tmdbApi.getMovieDetails(movieId),
        tmdbApi.getMovieCredits(movieId),
      ]);
      
      set({ 
        currentMovie: { ...details, credits } as any, 
        loading: false 
      });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  searchMovies: async (query: string, page = 1, append = false) => {
    if (!query.trim()) {
      set({ 
        searchResults: [], 
        searchQuery: '', 
        searchLoading: false,
        searchPage: 1,
        searchTotalPages: 1,
        hasMoreSearchPages: false
      });
      return;
    }

    set({ searchLoading: true, error: null, searchQuery: query });
    try {
      const response = await tmdbApi.searchMovies(query, page);
      set((state) => ({
        searchResults: append ? [...state.searchResults, ...response.results] : response.results,
        searchPage: response.page,
        searchTotalPages: Math.min(response.total_pages, 500),
        hasMoreSearchPages: response.page < Math.min(response.total_pages, 500),
        searchLoading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, searchLoading: false });
    }
  },

  fetchGenres: async () => {
    try {
      const response = await tmdbApi.getGenres();
      set({ genres: response.genres });
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },

  setSearchFilters: (filters: Partial<SearchFilters>) => {
    set((state) => ({
      searchFilters: { ...state.searchFilters, ...filters },
    }));
  },

  clearSearch: () => {
    set({
      searchResults: [],
      searchQuery: '',
      searchPage: 1,
      searchTotalPages: 1,
      hasMoreSearchPages: false,
      searchFilters: { query: '' },
    });
  },

  clearError: () => {
    set({ error: null });
  },

  loadMoreMovies: async () => {
    const { currentPage, hasMorePages } = get();
    if (!hasMorePages) return;

    const nextPage = currentPage + 1;
    await get().fetchDiscoverMovies(nextPage, true);
  },

  loadMoreSearchResults: async () => {
    const { searchPage, hasMoreSearchPages, searchQuery } = get();
    if (!hasMoreSearchPages || !searchQuery) return;

    const nextPage = searchPage + 1;
    await get().searchMovies(searchQuery, nextPage, true);
  },
}));