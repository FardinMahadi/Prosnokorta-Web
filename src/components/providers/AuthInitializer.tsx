'use client';

import type { RootState } from '@/lib/redux/store';

import Cookies from 'js-cookie';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getCurrentUser } from '@/lib/api/auth';
import { setUser, logout, initializeToken } from '@/lib/redux/slices/authSlice';

export default function AuthInitializer({
    children,
}: {
    children: React.ReactNode;
}) {
    const dispatch = useDispatch();
    const { user } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        const initializeAuth = async () => {
            dispatch(initializeToken());
            const token = Cookies.get('token');

            if (token && !user) {
                try {
                    const userData = await getCurrentUser();
                    dispatch(setUser(userData));
                } catch (error) {
                    console.error('Failed to fetch user profile:', error);
                    dispatch(logout());
                }
            }
        };

        initializeAuth();
    }, [dispatch, user]);

    // We can show a loading state if needed, but for now we just render children
    // to avoid layout shifts once the user info is populated in the Navbar.
    return <>{children}</>;
}
