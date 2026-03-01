'use client';

import type { RootState } from '@/lib/redux/store';
import type { Quiz, QuizSubmission } from '@/types';

import { toast } from 'sonner';
import { useSelector } from 'react-redux';
import { Send, Clock, Loader2 } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';

import Navbar from '@/components/Navbar';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { submitQuiz, getQuizById } from '@/lib/api/quizzes';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardTitle, CardHeader, CardContent } from '@/components/ui/card';

export default function QuizTakingPage() {
    const { id } = useParams();
    const router = useRouter();
    const { user } = useSelector((state: RootState) => state.auth);
    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [timeLeft, setTimeLeft] = useState<number>(0);

    const handleSubmit = useCallback(async (autoSubmit = false) => {
        if (!quiz || isSubmitting || !user) return;

        setIsSubmitting(true);
        const submission: QuizSubmission = {
            quizId: quiz.id,
            answers: quiz.questions?.map((q) => ({
                questionId: q.id,
                selectedAnswer: answers[q.id] || '',
            })) || [],
        };

        try {
            const result = await submitQuiz(submission, user.id);
            toast.success(autoSubmit ? "Time up! Quiz submitted automatically." : "Quiz submitted successfully!");
            router.push(`/student/results/${result.id}`);
        } catch {
            toast.error("Failed to submit quiz.");
            setIsSubmitting(false);
        }
    }, [quiz, answers, isSubmitting, router, user]);

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const data = await getQuizById(Number(id));
                setQuiz(data);
                if (data) setTimeLeft(data.durationMinutes * 60);
            } catch {
                toast.error("Failed to fetch quiz details.");
                router.push('/student/dashboard');
            } finally {
                setIsLoading(false);
            }
        };

        if (id) fetchQuiz();
    }, [id, router]);

    useEffect(() => {
        if (timeLeft <= 0 && !isLoading && quiz) {
            handleSubmit(true);
            return () => { };
        }

        const timer = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft, isLoading, quiz, handleSubmit]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col">
                <Navbar />
                <div className="flex-grow flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            </div>
        );
    }

    if (!quiz) return null;

    return (
        <div className="min-h-screen flex flex-col bg-muted/30">
            <Navbar />
            <div className="sticky top-16 z-40 bg-background border-b py-4 shadow-sm">
                <div className="container mx-auto px-4 flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold">{quiz.title}</h1>
                        <p className="text-sm text-muted-foreground">{quiz.questions?.length} Questions</p>
                    </div>
                    <div className={`flex items-center space-x-2 font-mono text-xl font-bold ${timeLeft < 60 ? 'text-destructive animate-pulse' : 'text-primary'}`}>
                        <Clock className="h-5 w-5" />
                        <span>{formatTime(timeLeft)}</span>
                    </div>
                </div>
            </div>

            <main className="flex-grow container mx-auto max-w-3xl px-4 py-8">
                <div className="space-y-8">
                    {quiz.questions?.map((question, index) => (
                        <Card key={question.id}>
                            <CardHeader>
                                <CardTitle className="text-lg">
                                    <span className="text-primary mr-2">Q{index + 1}.</span>
                                    {question.text}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <RadioGroup
                                    onValueChange={(value) => setAnswers(prev => ({ ...prev, [question.id]: value }))}
                                    value={answers[question.id] || ""}
                                    className="space-y-3"
                                    disabled={isSubmitting}
                                >
                                    {question.options.map((option, optIndex) => (
                                        <div key={optIndex} className="flex items-center space-x-3 rounded-lg border p-3 hover:bg-muted/50 transition-colors cursor-pointer">
                                            <RadioGroupItem value={option} id={`q${question.id}-o${optIndex}`} />
                                            <Label htmlFor={`q${question.id}-o${optIndex}`} className="flex-grow cursor-pointer font-normal">
                                                {option}
                                            </Label>
                                        </div>
                                    ))}
                                </RadioGroup>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="mt-12 flex justify-center pb-12">
                    <Button
                        size="lg"
                        className="w-full max-w-md"
                        onClick={() => handleSubmit(false)}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        ) : (
                            <Send className="mr-2 h-5 w-5" />
                        )}
                        Submit Quiz
                    </Button>
                </div>
            </main>
        </div>
    );
}
