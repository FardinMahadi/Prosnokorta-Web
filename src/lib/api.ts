import type { ApiResponse } from '@/types';

import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

// Response interceptor to unwrap data
api.interceptors.response.use(
    (response) => {
        const data = response.data as ApiResponse<unknown>;
        if (data.success) {
            return response;
        }

        // Log API error from successful response with success: false
        console.error('[API Error Success Context]:', {
            url: response.config.url,
            method: response.config.method,
            message: data.message,
            data: data.data
        });

        return Promise.reject(new Error(data.message || 'API Error'));
    },
    (error) => {
        // Log Axios/Network error
        console.error('[API Error Network Context]:', {
            url: error.config?.url,
            method: error.config?.method,
            status: error.response?.status,
            statusText: error.response?.statusText,
            message: error.message,
            responseData: error.response?.data
        });

        if (error.response?.status === 401) {
            if (typeof window !== 'undefined') {
                localStorage.removeItem('token');
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
