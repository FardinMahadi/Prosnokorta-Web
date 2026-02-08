'use client';

import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import { useEffect, useState, useCallback } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useParams, useRouter } from 'next/navigation';
import { studentApi, Quiz, QuizSubmission } from '@/lib/api';
import { Timer, Send, ChevronLeft, ChevronRight } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import axios from 'axios';

export default function QuizPage() {
    const { quizId } = useParams();
    const router = useRouter();
    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [timeLeft, setTimeLeft] = useState<number | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = useCallback(async () => {
        if (isSubmitting) return;
        setIsSubmitting(true);
        try {
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            const submission: QuizSubmission = {
                quizId: Number(quizId),
                answers: Object.entries(answers).map(([qId, val]) => ({
                    questionId: Number(qId),
                    selectedAnswer: val
                }))
            };
            const res = await studentApi.submitQuiz(Number(quizId), user.id, submission);
            toast.success(`Quiz submitted! Scored: ${res.data.score}/${res.data.totalMarks}`);
            router.push('/student/dashboard');
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.message || 'Failed to submit quiz');
            } else {
                toast.error('An unexpected error occurred');
            }
        } finally {
            setIsSubmitting(false);
        }
    }, [isSubmitting, quizId, answers, router]);

    const fetchQuiz = useCallback(async () => {
        try {
            const res = await studentApi.startQuiz(Number(quizId));
            setQuiz(res.data);
            setTimeLeft(res.data.durationMinutes * 60);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.message || 'Failed to start quiz');
            } else {
                toast.error('An unexpected error occurred');
            }
            router.push('/student/dashboard');
        }
    }, [quizId, router]);

    useEffect(() => {
        fetchQuiz();
    }, [fetchQuiz]);

    useEffect(() => {
        if (timeLeft === 0) {
            handleSubmit();
        }
        if (!timeLeft) return;

        const timer = setInterval(() => {
            setTimeLeft(prev => (prev !== null ? prev - 1 : null));
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft, handleSubmit]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleAnswerChange = (qId: number, value: string) => {
        setAnswers(prev => ({ ...prev, [qId]: value }));
    };

    if (!quiz) return <div className="flex items-center justify-center min-h-screen">Loading quiz...</div>;

    const currentQuestion = quiz.questions?.[currentQuestionIdx];

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="container mx-auto px-4 py-8">
                <div className="max-w-3xl mx-auto">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h1 className="text-2xl font-bold">{quiz.title}</h1>
                            <p className="text-gray-600">Question {currentQuestionIdx + 1} of {quiz.questions?.length}</p>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg font-mono text-xl shadow-sm">
                            <Timer className={timeLeft && timeLeft < 60 ? 'text-red-500 animate-pulse' : ''} />
                            {timeLeft !== null ? formatTime(timeLeft) : '--:--'}
                        </div>
                    </div>

                    {currentQuestion && (
                        <Card className="mb-6">
                            <CardHeader>
                                <CardTitle className="text-lg leading-relaxed">
                                    {currentQuestion.text}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <RadioGroup 
                                    value={answers[currentQuestion.id] || ''} 
                                    onValueChange={(val) => handleAnswerChange(currentQuestion.id, val)}
                                    className="space-y-4"
                                >
                                    {currentQuestion.options.map((opt) => (
                                        <div key={opt} className={`flex items-center space-x-3 p-4 border rounded-lg transition-colors hover:bg-gray-50 ${answers[currentQuestion.id] === opt ? 'border-primary bg-primary/5' : ''}`}>
                                            <RadioGroupItem value={opt} id={`opt-${opt}`} />
                                            <Label htmlFor={`opt-${opt}`} className="flex-1 cursor-pointer text-base">
                                                {opt}
                                            </Label>
                                        </div>
                                    ))}
                                </RadioGroup>
                            </CardContent>
                            <CardFooter className="flex justify-between border-t bg-gray-50/50 pt-6">
                                <Button 
                                    variant="outline" 
                                    disabled={currentQuestionIdx === 0}
                                    onClick={() => setCurrentQuestionIdx(prev => prev - 1)}
                                >
                                    <ChevronLeft size={16} className="mr-2" /> Previous
                                </Button>
                                {currentQuestionIdx < (quiz.questions?.length || 0) - 1 ? (
                                    <Button onClick={() => setCurrentQuestionIdx(prev => prev + 1)}>
                                        Next <ChevronRight size={16} className="ml-2" />
                                    </Button>
                                ) : (
                                    <Button variant="default" className="bg-green-600 hover:bg-green-700" onClick={handleSubmit} disabled={isSubmitting}>
                                        <Send size={16} className="mr-2" />
                                        {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
                                    </Button>
                                )}
                            </CardFooter>
                        </Card>
                    )}
                    
                    <div className="grid grid-cols-10 gap-2">
                        {quiz.questions?.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentQuestionIdx(idx)}
                                className={`w-8 h-8 rounded-full text-xs font-semibold flex items-center justify-center transition-colors
                                    ${currentQuestionIdx === idx ? 'bg-primary text-white shadow-md' : 
                                      answers[quiz.questions![idx].id] ? 'bg-green-100 text-green-700 border-green-200 border' : 'bg-white border text-gray-400'}`}
                            >
                                {idx + 1}
                            </button>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}
