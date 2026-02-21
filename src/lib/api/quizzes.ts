import type { Quiz, Result, ApiResponse, QuizSubmission, Question } from '@/types';

import api from '../api';

export const getQuizzesBySubject = async (subjectId: number) => {
    const response = await api.get<ApiResponse<Quiz[]>>(`/quizzes/subject/${subjectId}`);
    return response.data.data;
};

export const getQuizById = async (id: number) => {
    const response = await api.get<ApiResponse<Quiz>>(`/quizzes/${id}`);
    return response.data.data;
};

export const submitQuiz = async (submission: QuizSubmission) => {
    const response = await api.post<ApiResponse<Result>>('/quizzes/submit', submission);
    return response.data.data;
};

export const getQuizzes = async () => {
    const response = await api.get<ApiResponse<Quiz[]>>('/quizzes');
    return response.data.data;
};

export const createQuiz = async (data: Partial<Quiz>) => {
    const response = await api.post<ApiResponse<Quiz>>('/quizzes', data);
    return response.data.data;
};

export const updateQuiz = async (id: number, data: Partial<Quiz>) => {
    const response = await api.put<ApiResponse<Quiz>>(`/quizzes/${id}`, data);
    return response.data.data;
};

export const deleteQuiz = async (id: number) => {
    await api.delete(`/quizzes/${id}`);
};

export const addQuestion = async (quizId: number, data: Partial<Question>) => {
    const response = await api.post<ApiResponse<Question>>(`/quizzes/${quizId}/questions`, data);
    return response.data.data;
};

export const deleteQuestion = async (quizId: number, questionId: number) => {
    await api.delete(`/quizzes/${quizId}/questions/${questionId}`);
};

export const getStudentResults = async () => {
    const response = await api.get<ApiResponse<Result[]>>('/student/results');
    return response.data.data;
};

export const getAllResults = async () => {
    const response = await api.get<ApiResponse<Result[]>>('/admin/results');
    return response.data.data;
};

export const getResultsByQuiz = async (quizId: number) => {
    const response = await api.get<ApiResponse<Result[]>>(`/admin/results/quiz/${quizId}`);
    return response.data.data;
};
