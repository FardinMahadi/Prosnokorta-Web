import type { User } from '@/types';
import type { PayloadAction } from '@reduxjs/toolkit';

import { createSlice } from '@reduxjs/toolkit';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    initializeAuth: (state) => {
      if (typeof window === 'undefined') return;
      const saved = localStorage.getItem('user');
      if (saved) {
        try {
          const user = JSON.parse(saved);
          state.user = user;
          state.isAuthenticated = true;
          // Ensure cookie is in sync for middleware
          document.cookie = `user=${saved}; path=/; max-age=${7 * 24 * 60 * 60}`;
        } catch {
          localStorage.removeItem('user');
          document.cookie = 'user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        }
      }
    },
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
      if (action.payload) {
        localStorage.setItem('user', JSON.stringify(action.payload));
        // Add cookie for middleware access (expires in 7 days)
        document.cookie = `user=${JSON.stringify(action.payload)}; path=/; max-age=${7 * 24 * 60 * 60}`;
      } else {
        localStorage.removeItem('user');
        document.cookie = 'user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      }
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem('user');
      document.cookie = 'user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const { initializeAuth, setUser, logout, setLoading } = authSlice.actions;
export default authSlice.reducer;
