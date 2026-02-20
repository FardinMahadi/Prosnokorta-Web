import api from '../api';
import { LoginRequest, RegisterRequest, User, ApiResponse } from '@/types';

export const login = async (data: LoginRequest) => {
    const response = await api.post<ApiResponse<{ user: User; token: string }>>(
        '/auth/login',
        data
    );
    return response.data.data;
};

export const register = async (data: RegisterRequest) => {
    const response = await api.post<ApiResponse<User>>('/auth/register', data);
    return response.data.data;
};

export const getCurrentUser = async () => {
    const response = await api.get<ApiResponse<User>>('/auth/me');
    return response.data.data;
};

export const logout = async () => {
    // Optionally call backend logout if needed
    // await api.post('/auth/logout');
};
