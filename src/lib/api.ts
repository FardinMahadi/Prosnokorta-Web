import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Types based on Backend DTOs
export interface User {
    id: number;
    name: string;
    email: string;
    role: 'ADMIN' | 'STUDENT';
}

export interface Subject {
    id: number;
    name: string;
    code: string;
    description: string;
}

export interface Question {
    id: number;
    text: string;
    options: string[];
    correctAnswer?: string;
    marks: number;
    quizId: number;
}

export interface Quiz {
    id: number;
    title: string;
    description: string;
    totalMarks: number;
    durationMinutes: number;
    isActive: boolean;
    subjectId: number;
    subjectName?: string;
    questions?: Question[];
}

export interface Result {
    id: number;
    studentName: string;
    quizTitle: string;
    score: number;
    totalMarks: number;
    submittedAt: string;
}

export interface QuizSubmission {
    quizId: number;
    answers: {
        questionId: number;
        selectedAnswer: string;
    }[];
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
}

// API Endpoints
export const authApi = {
    login: (data: LoginRequest) => api.post<User>('/auth/login', data),
    register: (data: RegisterRequest) => api.post<User>('/auth/register', data),
    logout: () => api.post('/auth/logout'),
};

export const adminApi = {
    createSubject: (data: Partial<Subject>) => api.post<Subject>('/admin/subjects', data),
    getAllSubjects: () => api.get<Subject[]>('/admin/subjects'),
    createQuiz: (data: Partial<Quiz>) => api.post<Quiz>('/admin/quizzes', data),
    getQuizzesBySubject: (subjectId: number) => api.get<Quiz[]>(`/admin/quizzes/${subjectId}`),
    addQuestion: (quizId: number, data: Partial<Question>) => api.post<Question>(`/admin/quizzes/${quizId}/questions`, data),
    getQuestionsByQuiz: (quizId: number) => api.get<Question[]>(`/admin/quizzes/${quizId}/questions`),
    getAllResults: () => api.get<Result[]>('/admin/results'),
    getResultsByQuiz: (quizId: number) => api.get<Result[]>(`/admin/results/quiz/${quizId}`),
};

export const studentApi = {
    getAllSubjects: () => api.get<Subject[]>('/student/subjects'),
    getAvailableQuizzes: (subjectId: number) => api.get<Quiz[]>(`/student/quizzes/${subjectId}`),
    startQuiz: (quizId: number) => api.get<Quiz>(`/student/quiz/${quizId}`),
    submitQuiz: (quizId: number, studentId: number, submission: QuizSubmission) => 
        api.post(`/student/quiz/${quizId}/submit`, submission, { params: { studentId } }),
    getMyResults: (studentId: number) => api.get<Result[]>('/student/results', { params: { studentId } }),
    getResultDetails: (resultId: number) => api.get<Result>(`/student/results/${resultId}`),
};

export default api;
