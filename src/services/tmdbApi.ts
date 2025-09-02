import axios, { type AxiosResponse } from 'axios';
import { TMDB_CONFIG } from '../config/constants';
import type { Movie, MovieDetails, Credits, ApiResponse, Genre } from '../types/movie';

class TMDBService {
  private api;
  private cache = new Map<string, { data: any; timestamp: number }>();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  constructor() {
    this.api = axios.create({
      baseURL: TMDB_CONFIG.BASE_URL,
      params: {
        api_key: TMDB_CONFIG.API_KEY,
      },
    });

    // Add response interceptors for error handling
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('TMDB API Error:', error.response?.data || error.message);
        throw error;
      }
    );
  }

  private getCacheKey(endpoint: string, params?: any): string {
    return `${endpoint}_${JSON.stringify(params || {})}`;
  }

  private getFromCache<T>(key: string): T | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data;
    }
    this.cache.delete(key);
    return null;
  }

  private setCache<T>(key: string, data: T): void {
    // Limit cache size
    if (this.cache.size >= 50) {
      const oldestKey = this.cache.keys().next().value;
      oldestKey && this.cache.delete(oldestKey);
    }
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  private async request<T>(endpoint: string, params?: any): Promise<T> {
    const cacheKey = this.getCacheKey(endpoint, params);
    const cached = this.getFromCache<T>(cacheKey);
    
    if (cached) {
      return cached;
    }

    const response: AxiosResponse<T> = await this.api.get(endpoint, { params });
    this.setCache(cacheKey, response.data);
    return response.data;
  }

  // Popular movies
  async getPopularMovies(page = 1): Promise<ApiResponse<Movie>> {
    return this.request('/movie/popular', { page });
  }

  // Top rated movies
  async getTopRatedMovies(page = 1): Promise<ApiResponse<Movie>> {
    return this.request('/movie/top_rated', { page });
  }

  // Now playing movies
  async getNowPlayingMovies(page = 1): Promise<ApiResponse<Movie>> {
    return this.request('/movie/now_playing', { page });
  }

  // Upcoming movies
  async getUpcomingMovies(page = 1): Promise<ApiResponse<Movie>> {
    return this.request('/movie/upcoming', { page });
  }

  // Movie details
  async getMovieDetails(movieId: number): Promise<MovieDetails> {
    return this.request(`/movie/${movieId}`);
  }

  // Movie credits
  async getMovieCredits(movieId: number): Promise<Credits> {
    return this.request(`/movie/${movieId}/credits`);
  }

  // Search movies
  async searchMovies(
    query: string, 
    page = 1, 
    options?: { year?: number; include_adult?: boolean }
  ): Promise<ApiResponse<Movie>> {
    return this.request('/search/movie', {
      query,
      page,
      ...options,
    });
  }

  // Get movie genres
  async getGenres(): Promise<{ genres: Genre[] }> {
    return this.request('/genre/movie/list');
  }

  // Discover movies with filters
  async discoverMovies(page = 1): Promise<ApiResponse<Movie>> {
    return this.request('/discover/movie', {
      include_adult: false,
      include_video: false,
      language: 'en-US',
      page,
      sort_by: 'vote_count.desc'
    });
  }

  // Similar movies
  async getSimilarMovies(movieId: number, page = 1): Promise<ApiResponse<Movie>> {
    return this.request(`/movie/${movieId}/similar`, { page });
  }

  // Movie recommendations
  async getRecommendations(movieId: number, page = 1): Promise<ApiResponse<Movie>> {
    return this.request(`/movie/${movieId}/recommendations`, { page });
  }

  // Utility methods for image URLs
  getImageUrl(path: string | null, size: 'small' | 'medium' | 'large' | 'xlarge' = 'medium'): string {
    if (!path) return '/placeholder-movie.jpg';
    return `${TMDB_CONFIG.IMAGE_BASE_URL}/${TMDB_CONFIG.POSTER_SIZES[size]}${path}`;
  }

  getBackdropUrl(path: string | null, size: 'small' | 'medium' | 'large' | 'original' = 'large'): string {
    if (!path) return '/placeholder-backdrop.jpg';
    return `${TMDB_CONFIG.IMAGE_BASE_URL}/${TMDB_CONFIG.BACKDROP_SIZES[size]}${path}`;
  }
}

export const tmdbApi = new TMDBService();
export default tmdbApi;