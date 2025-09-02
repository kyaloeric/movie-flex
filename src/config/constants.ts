export const TMDB_CONFIG = {
  BASE_URL: 'https://api.themoviedb.org/3',
  IMAGE_BASE_URL: 'https://image.tmdb.org/t/p',
  API_KEY: import.meta.env.VITE_TMDB_API_KEY,
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
};

export const CACHE_CONFIG = {
  EXPIRY_TIME: 5 * 60 * 1000,
  MAX_CACHE_SIZE: 100
};

export const PAGINATION_CONFIG = {
  ITEMS_PER_PAGE: 20,
  ITEMS_PER_ROW_MOBILE: 2,
  ITEMS_PER_ROW_TABLET: 3,
  ITEMS_PER_ROW_DESKTOP: 5
};