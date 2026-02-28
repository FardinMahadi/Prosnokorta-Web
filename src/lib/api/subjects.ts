import type { Subject, ApiResponse } from '@/types';

import api from '../api';

export const getSubjects = async () => {
    const response = await api.get<ApiResponse<Subject[]>>('/admin/subjects');
    return response.data.data;
};

export const getEnrolledSubjects = async () => {
    const response = await api.get<ApiResponse<Subject[]>>('/student/subjects');
    return response.data.data;
};

export const createSubject = async (data: Partial<Subject>) => {
    const response = await api.post<ApiResponse<Subject>>('/admin/subjects', data);
    return response.data.data;
};

export const updateSubject = async (id: number, data: Partial<Subject>) => {
    const response = await api.put<ApiResponse<Subject>>(`/admin/subjects/${id}`, data);
    return response.data.data;
};

export const deleteSubject = async (id: number) => {
    await api.delete(`/admin/subjects/${id}`);
};
