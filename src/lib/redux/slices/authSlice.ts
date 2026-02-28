import type { User } from '@/types';
import type { PayloadAction } from '@reduxjs/toolkit';

import Cookies from 'js-cookie';
import { createSlice } from '@reduxjs/toolkit';

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
}

const initialState: AuthState = {
    user: null,
    token: null,
    isAuthenticated: false,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (
            state,
            action: PayloadAction<{ user: User; token: string }>
        ) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.isAuthenticated = true;
            localStorage.setItem('token', action.payload.token);
            Cookies.set('token', action.payload.token, { expires: 7 });
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            localStorage.removeItem('token');
            Cookies.remove('token');
        },
        setUser: (state, action: PayloadAction<User>) => {
            state.user = action.payload;
            state.isAuthenticated = true;
        },
        initializeToken: (state) => {
            if (typeof window !== 'undefined') {
                state.token = Cookies.get('token') || null;
            }
        },
    },
});

export const { setCredentials, logout, setUser, initializeToken } = authSlice.actions;
export default authSlice.reducer;
