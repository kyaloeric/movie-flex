import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import axios from 'axios';
import { tmdbApi } from '../../services/tmdbApi';

vi.mock('axios');
const mockedAxios = vi.mocked(axios);

describe('TMDBService', () => {
  const mockCreate = vi.fn();
  const mockGet = vi.fn();

  beforeEach(() => {
    mockCreate.mockReturnValue({
      get: mockGet,
      interceptors: {
        response: {
          use: vi.fn(),
        },
      },
    });
    mockedAxios.create = mockCreate;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('creates axios instance with correct config', () => {
    expect(mockCreate).toHaveBeenCalledWith({
      baseURL: 'https://api.themoviedb.org/3',
      params: {
        api_key: '4f5f43495afcc67e9553f6c684a82f84',
      },
    });
  });

  it('fetches popular movies', async () => {
    const mockResponse = {
      data: {
        page: 1,
        results: [{ id: 1, title: 'Test Movie' }],
        total_pages: 10,
        total_results: 200,
      },
    };

    mockGet.mockResolvedValueOnce(mockResponse);

    const result = await tmdbApi.getPopularMovies();
    
    expect(mockGet).toHaveBeenCalledWith('/movie/popular', { params: { page: 1 } });
    expect(result).toEqual(mockResponse.data);
  });

  it('searches movies with query', async () => {
    const mockResponse = {
      data: {
        page: 1,
        results: [{ id: 1, title: 'Search Result' }],
        total_pages: 5,
        total_results: 100,
      },
    };

    mockGet.mockResolvedValueOnce(mockResponse);

    const result = await tmdbApi.searchMovies('test query');
    
    expect(mockGet).toHaveBeenCalledWith('/search/movie', {
      params: { query: 'test query', page: 1 },
    });
    expect(result).toEqual(mockResponse.data);
  });

  it('generates correct image URL', () => {
    const posterPath = '/test-poster.jpg';
    const imageUrl = tmdbApi.getImageUrl(posterPath, 'medium');
    
    expect(imageUrl).toBe('https://image.tmdb.org/t/p/w342/test-poster.jpg');
  });

  it('returns placeholder for null poster path', () => {
    const imageUrl = tmdbApi.getImageUrl(null, 'medium');
    
    expect(imageUrl).toBe('/placeholder-movie.jpg');
  });

  it('generates correct backdrop URL', () => {
    const backdropPath = '/test-backdrop.jpg';
    const backdropUrl = tmdbApi.getBackdropUrl(backdropPath, 'large');
    
    expect(backdropUrl).toBe('https://image.tmdb.org/t/p/w1280/test-backdrop.jpg');
  });
});