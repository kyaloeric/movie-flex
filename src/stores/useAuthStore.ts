import { create } from 'zustand';
import type { AuthState } from '../types/auth';
import { AuthService } from '../services/firebase';

interface AuthStore extends AuthState {
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName?: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  initializeAuth: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  loading: true,
  error: null,

  signIn: async (email: string, password: string) => {
    set({ loading: true, error: null });
    try {
      const user = await AuthService.signIn(email, password);
      set({ user, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  signUp: async (email: string, password: string, displayName?: string) => {
    set({ loading: true, error: null });
    try {
      const user = await AuthService.signUp(email, password, displayName);
      set({ user, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  signInWithGoogle: async () => {
    set({ loading: true, error: null });
    try {
      const user = await AuthService.signInWithGoogle();
      set({ user, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  signOut: async () => {
    set({ loading: true });
    try {
      await AuthService.signOut();
      set({ user: null, loading: false, error: null });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  initializeAuth: () => {
    const unsubscribe = AuthService.onAuthStateChange((user) => {
      set({ user, loading: false });
    });
    
    // Return cleanup function
    return unsubscribe;
  },

  clearError: () => {
    set({ error: null });
  },
}));