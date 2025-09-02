import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAuthStore } from '../../stores/useAuthStore';

// Mock Firebase Auth Service
vi.mock('../../services/firebase', () => {
  const mockSignIn = vi.fn();
  const mockSignUp = vi.fn();
  const mockSignInWithGoogle = vi.fn();
  const mockSignOut = vi.fn();
  const mockOnAuthStateChange = vi.fn();
  const mockGetCurrentUser = vi.fn();

  return {
    AuthService: {
      signIn: mockSignIn,
      signUp: mockSignUp,
      signInWithGoogle: mockSignInWithGoogle,
      signOut: mockSignOut,
      onAuthStateChange: mockOnAuthStateChange,
      getCurrentUser: mockGetCurrentUser,
    },
  };
});

describe('useAuthStore', () => {
  const mockUser = {
    id: 'test-user-id',
    email: 'test@example.com',
    displayName: 'Test User',
    photoURL: null,
    emailVerified: true,
  };

  beforeEach(async () => {
    vi.clearAllMocks();
    
    // Get the mocked AuthService
    const { AuthService } = await import('../../services/firebase');
    
    // Setup default mock implementations
    vi.mocked(AuthService.signIn).mockResolvedValue(mockUser);
    vi.mocked(AuthService.signUp).mockResolvedValue(mockUser);
    vi.mocked(AuthService.signInWithGoogle).mockResolvedValue(mockUser);
    vi.mocked(AuthService.signOut).mockResolvedValue(undefined);
    vi.mocked(AuthService.onAuthStateChange).mockImplementation((callback) => {
      setTimeout(() => callback(null), 0);
      return vi.fn(); // Return unsubscribe function
    });
    vi.mocked(AuthService.getCurrentUser).mockReturnValue(null);
  });

  it('initializes with correct default state', () => {
    const { result } = renderHook(() => useAuthStore());
    
    expect(result.current.user).toBeNull();
    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBeNull();
  });

  it('signs in user successfully', async () => {
    const { result } = renderHook(() => useAuthStore());
    
    await act(async () => {
      await result.current.signIn('test@example.com', 'password');
    });
    
    const { AuthService } = await import('../../services/firebase');
    expect(AuthService.signIn).toHaveBeenCalledWith('test@example.com', 'password');
    expect(result.current.user).toEqual(mockUser);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('signs up user successfully', async () => {
    const { result } = renderHook(() => useAuthStore());
    
    await act(async () => {
      await result.current.signUp('test@example.com', 'password', 'Test User');
    });
    
    const { AuthService } = await import('../../services/firebase');
    expect(AuthService.signUp).toHaveBeenCalledWith('test@example.com', 'password', 'Test User');
    expect(result.current.user).toEqual(mockUser);
    expect(result.current.loading).toBe(false);
  });

  it('signs in with Google successfully', async () => {
    const { result } = renderHook(() => useAuthStore());
    
    await act(async () => {
      await result.current.signInWithGoogle();
    });
    
    const { AuthService } = await import('../../services/firebase');
    expect(AuthService.signInWithGoogle).toHaveBeenCalled();
    expect(result.current.user).toEqual(mockUser);
    expect(result.current.loading).toBe(false);
  });

  it('signs out user successfully', async () => {
    const { result } = renderHook(() => useAuthStore());
    
    // First sign in
    await act(async () => {
      await result.current.signIn('test@example.com', 'password');
    });
    
    // Then sign out
    await act(async () => {
      await result.current.signOut();
    });
    
    const { AuthService } = await import('../../services/firebase');
    expect(AuthService.signOut).toHaveBeenCalled();
    expect(result.current.user).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  it('handles sign in error', async () => {
    const { AuthService } = await import('../../services/firebase');
    const errorMessage = 'Invalid credentials';
    vi.mocked(AuthService.signIn).mockRejectedValueOnce(new Error(errorMessage));
    
    const { result } = renderHook(() => useAuthStore());
    
    await act(async () => {
      await result.current.signIn('test@example.com', 'wrongpassword');
    });
    
    expect(result.current.user).toBeNull();
    expect(result.current.error).toBe(errorMessage);
    expect(result.current.loading).toBe(false);
  });

  it('clears error when clearError is called', async () => {
    const { AuthService } = await import('../../services/firebase');
    const { result } = renderHook(() => useAuthStore());
    
    // Set an error first
    vi.mocked(AuthService.signIn).mockRejectedValueOnce(new Error('Test error'));
    await act(async () => {
      await result.current.signIn('test@example.com', 'wrongpassword');
    });
    
    expect(result.current.error).toBe('Test error');
    
    // Clear the error
    act(() => {
      result.current.clearError();
    });
    
    expect(result.current.error).toBeNull();
  });

  it('initializes auth state', () => {
    const { result } = renderHook(() => useAuthStore());
    
    act(() => {
      result.current.initializeAuth();
    });
    
   
    expect(typeof result.current.initializeAuth).toBe('function');
  });
});