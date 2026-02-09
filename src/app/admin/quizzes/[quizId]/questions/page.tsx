'use client';

import type { Question } from '@/types';

import axios from 'axios';
import { toast } from 'sonner';
import { adminApi } from '@/lib/api';
import Navbar from '@/components/Navbar';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { useState, useEffect, useCallback } from 'react';
import { AddQuestionDialog } from '@/features/admin/questions/AddQuestionDialog';
import { AdminQuestionCard } from '@/features/admin/questions/AdminQuestionCard';

export default function AdminQuestionsPage() {
    const { quizId } = useParams();
    const router = useRouter();
    const [questions, setQuestions] = useState<Question[]>([]);

    const fetchQuestions = useCallback(async () => {
        try {
            const res = await adminApi.getQuestionsByQuiz(Number(quizId));
            setQuestions(res.data);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.message || 'Failed to fetch questions');
            } else {
                toast.error('An unexpected error occurred');
            }
        }
    }, [quizId]);

    useEffect(() => {
        fetchQuestions();
    }, [fetchQuestions]);

    const handleDeleteQuestion = async (id: number) => {
        if (!confirm('Are you sure you want to delete this question?')) return;
        try {
            await adminApi.deleteQuestion(id);
            toast.success('Question deleted successfully');
            fetchQuestions();
        } catch {
            toast.error('Failed to delete question');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="container mx-auto px-4 py-8">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={() => router.back()}>
                            <ChevronLeft />
                        </Button>
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Manage Questions</h1>
                            <p className="text-gray-600">Add or remove questions from this quiz</p>
                        </div>
                    </div>
                    <div className="ml-auto">
                        <AddQuestionDialog quizId={Number(quizId)} onSuccess={fetchQuestions} />
                    </div>
                </div>

                <div className="space-y-6">
                    {questions.map((q, idx) => (
                        <AdminQuestionCard 
                            key={q.id} 
                            question={q} 
                            index={idx} 
                            onDelete={handleDeleteQuestion} 
                        />
                    ))}
                    {questions.length === 0 && (
                        <Card>
                            <CardContent className="py-12 text-center text-gray-500">
                                No questions added yet.
                            </CardContent>
                        </Card>
                    )}
                </div>
            </main>
        </div>
    );
}
