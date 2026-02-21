import type { Quiz, Subject } from '@/types';
import type { PayloadAction } from '@reduxjs/toolkit';

import { createSlice } from '@reduxjs/toolkit';

interface QuizState {
    subjects: Subject[];
    quizzes: Quiz[];
    currentQuiz: Quiz | null;
    loading: boolean;
    error: string | null;
}

const initialState: QuizState = {
    subjects: [],
    quizzes: [],
    currentQuiz: null,
    loading: false,
    error: null,
};

const quizSlice = createSlice({
    name: 'quiz',
    initialState,
    reducers: {
        setSubjects: (state, action: PayloadAction<Subject[]>) => {
            state.subjects = action.payload;
        },
        setQuizzes: (state, action: PayloadAction<Quiz[]>) => {
            state.quizzes = action.payload;
        },
        setCurrentQuiz: (state, action: PayloadAction<Quiz | null>) => {
            state.currentQuiz = action.payload;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
    },
});

export const { setSubjects, setQuizzes, setCurrentQuiz, setLoading, setError } =
    quizSlice.actions;
export default quizSlice.reducer;
