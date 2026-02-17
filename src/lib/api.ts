import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://quizmaster-backend-t7pf.onrender.com/api/v1';

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export * from './api/auth';
export * from './api/admin';
export * from './api/student';

export default api;
