import api from '../api';
import { Subject, ApiResponse } from '@/types';

export const getSubjects = async () => {
    const response = await api.get<ApiResponse<Subject[]>>('/subjects');
    return response.data.data;
};

export const getEnrolledSubjects = async () => {
    const response = await api.get<ApiResponse<Subject[]>>('/student/subjects');
    return response.data.data;
};

export const createSubject = async (data: Partial<Subject>) => {
    const response = await api.post<ApiResponse<Subject>>('/subjects', data);
    return response.data.data;
};

export const updateSubject = async (id: number, data: Partial<Subject>) => {
    const response = await api.put<ApiResponse<Subject>>(`/subjects/${id}`, data);
    return response.data.data;
};

export const deleteSubject = async (id: number) => {
    await api.delete(`/subjects/${id}`);
};
