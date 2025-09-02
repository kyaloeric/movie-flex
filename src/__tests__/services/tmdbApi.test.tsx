import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockAxiosInstance = {
  get: vi.fn(),
  interceptors: {
    response: {
      use: vi.fn(),
    },
  },
};

const mockAxiosCreate = vi.fn(() => mockAxiosInstance);

vi.doMock('axios', () => ({
  default: {
    create: mockAxiosCreate,
  },
}));

vi.doMock('../../config/constants', () => ({
  TMDB_CONFIG: {
    BASE_URL: 'https://api.themoviedb.org/3',
    IMAGE_BASE_URL: 'https://image.tmdb.org/t/p',
    API_KEY: 'test-api-key',
    POSTER_SIZES: {
      small: 'w185',
      medium: 'w342',
      large: 'w500',
      xlarge: 'w780'
    },
    BACKDROP_SIZES: {
      small: 'w300',
      medium: 'w780',
      large: 'w1280',
      original: 'original'
    }
  },
}));

describe('TMDBService', () => {
  let tmdbApi: any;

  beforeEach(async () => {
    vi.clearAllMocks();
    vi.resetModules();
    
    const module = await import('../../services/tmdbApi');
    tmdbApi = module.tmdbApi;
  });

  it('creates axios instance with correct base URL', () => {
    expect(mockAxiosCreate).toHaveBeenCalledWith({
      baseURL: 'https://api.themoviedb.org/3',
      params: {
        api_key: 'test-api-key',
      },
    });
  });

  it('generates correct image URLs', () => {
    const posterPath = '/test-poster.jpg';
    const imageUrl = tmdbApi.getImageUrl(posterPath, 'medium');
    
    expect(imageUrl).toBe('https://image.tmdb.org/t/p/w342/test-poster.jpg');
  });

  it('handles null poster paths', () => {
    const imageUrl = tmdbApi.getImageUrl(null, 'medium');
    expect(imageUrl).toBe('/placeholder-movie.jpg');
  });

  it('generates correct backdrop URLs', () => {
    const backdropPath = '/test-backdrop.jpg';
    const backdropUrl = tmdbApi.getBackdropUrl(backdropPath, 'large');
    
    expect(backdropUrl).toBe('https://image.tmdb.org/t/p/w1280/test-backdrop.jpg');
  });

  it('handles null backdrop paths', () => {
    const backdropUrl = tmdbApi.getBackdropUrl(null, 'large');
    expect(backdropUrl).toBe('/placeholder-backdrop.jpg');
  });

  it('uses default size when not specified', () => {
    const posterPath = '/test-poster.jpg';
    const imageUrl = tmdbApi.getImageUrl(posterPath);
    
    expect(imageUrl).toBe('https://image.tmdb.org/t/p/w342/test-poster.jpg');
  });
});