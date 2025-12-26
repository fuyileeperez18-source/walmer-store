import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User as AppUser } from '@/types';
import { authService, userService } from '@/lib/services';

interface AuthState {
  user: AppUser | null;
  profile: AppUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  // Actions
  setUser: (user: AppUser | null) => void;
  setProfile: (profile: AppUser | null) => void;
  setLoading: (loading: boolean) => void;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (updates: Partial<AppUser>) => Promise<void>;
  fetchProfile: () => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      profile: null,
      isLoading: true,
      isAuthenticated: false,

      setUser: (user) => {
        set({ user, isAuthenticated: !!user });
      },

      setProfile: (profile) => {
        set({ profile });
      },

      setLoading: (loading) => {
        set({ isLoading: loading });
      },

      signIn: async (email, password) => {
        set({ isLoading: true });
        try {
          const { user } = await authService.signIn(email, password);
          set({ user, profile: user, isAuthenticated: true });
        } finally {
          set({ isLoading: false });
        }
      },

      signUp: async (email, password, fullName) => {
        set({ isLoading: true });
        try {
          const { user } = await authService.signUp(email, password, fullName);
          set({ user, profile: user, isAuthenticated: !!user });
        } finally {
          set({ isLoading: false });
        }
      },

      signOut: async () => {
        set({ isLoading: true });
        try {
          await authService.signOut();
          set({ user: null, profile: null, isAuthenticated: false });
        } finally {
          set({ isLoading: false });
        }
      },

      signInWithGoogle: async () => {
        set({ isLoading: true });
        try {
          await authService.signInWithGoogle();
        } finally {
          set({ isLoading: false });
        }
      },

      resetPassword: async (email) => {
        await authService.resetPassword(email);
      },

      updateProfile: async (updates) => {
        const { profile } = get();
        if (!profile) return;

        const updatedProfile = await userService.updateProfile(profile.id, updates);
        set({ profile: updatedProfile, user: updatedProfile });
      },

      fetchProfile: async () => {
        const { user } = get();
        if (!user) return;

        try {
          const profile = await userService.getProfile(user.id);
          set({ profile });
        } catch (error) {
          console.error('Error fetching profile:', error);
        }
      },

      initialize: async () => {
        set({ isLoading: true });
        try {
          const user = await authService.getSession();
          if (user) {
            set({ user, profile: user, isAuthenticated: true });
          } else {
            set({ user: null, profile: null, isAuthenticated: false });
          }
        } catch (error) {
          console.error('Error initializing auth:', error);
          set({ user: null, profile: null, isAuthenticated: false });
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: 'walmer-auth',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
