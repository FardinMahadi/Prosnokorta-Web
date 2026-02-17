import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://quizmaster-backend-t7pf.onrender.com/api/v1';

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Response interceptor to unwrap ApiResponse
api.interceptors.response.use(
    (response) => {
        // If the response follows the ApiResponse format, unwrap the data
        if (response.data && typeof response.data === 'object' && 'data' in response.data && 'success' in response.data) {
            return {
                ...response,
                data: response.data.data
            };
        }
        return response;
    },
    (error) => Promise.reject(error)
);

export * from './api/auth';
export * from './api/admin';
export * from './api/student';

export default api;
