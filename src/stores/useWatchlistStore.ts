import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Movie, WatchlistItem } from '../types/movie';

interface WatchlistStore {
  watchlist: WatchlistItem[];
  loading: boolean;
  error: string | null;

  addToWatchlist: (movie: Movie) => void;
  removeFromWatchlist: (movieId: number) => void;
  isInWatchlist: (movieId: number) => boolean;
  clearError: () => void;
}

export const useWatchlistStore = create<WatchlistStore>()(
  persist(
    (set, get) => ({
      watchlist: [],
      loading: false,
      error: null,

      addToWatchlist: (movie: Movie) => {
        const watchlistItem: WatchlistItem = {
          ...movie,
          added_at: new Date().toISOString(),
        };
        
        set((state) => ({
          watchlist: [...state.watchlist.filter(item => item.id !== movie.id), watchlistItem],
        }));
      },

      removeFromWatchlist: (movieId: number) => {
        set((state) => ({
          watchlist: state.watchlist.filter(item => item.id !== movieId),
        }));
      },

      isInWatchlist: (movieId: number) => {
        const { watchlist } = get();
        return watchlist.some(item => item.id === movieId);
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'watchlist-storage',
      partialize: (state) => ({
        watchlist: state.watchlist,
      }),
    }
  )
);