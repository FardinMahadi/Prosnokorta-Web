'use client';

import type { Quiz } from '@/types';

import Link from 'next/link';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Play, Clock, Loader2, FileText } from 'lucide-react';

import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { getQuizzesBySubject } from '@/lib/api/quizzes';
import { Card, CardTitle, CardFooter, CardHeader, CardContent, CardDescription } from '@/components/ui/card';

export default function QuizListPage() {
    const { id } = useParams();
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                const data = await getQuizzesBySubject(Number(id));
                setQuizzes(data || []);
            } catch {
                toast.error("Failed to fetch quizzes.");
            } finally {
                setIsLoading(false);
            }
        };

        if (id) fetchQuizzes();
    }, [id]);

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

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow container mx-auto px-4 py-8">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold">Available Quizzes</h1>
                    <p className="text-muted-foreground">Choose a quiz to start.</p>
                </header>

                {quizzes.length === 0 ? (
                    <div className="text-center py-12 border-2 border-dashed rounded-xl">
                        <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                        <h2 className="text-xl font-semibold">No quizzes found</h2>
                        <p className="text-muted-foreground">There are no active quizzes for this subject at the moment.</p>
                        <Button asChild variant="outline" className="mt-4">
                            <Link href="/student/dashboard">Back to Dashboard</Link>
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {quizzes.map((quiz) => (
                            <Card key={quiz.id}>
                                <CardHeader>
                                    <CardTitle>{quiz.title}</CardTitle>
                                    <CardDescription>{quiz.description}</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center text-sm text-muted-foreground">
                                        <Clock className="mr-2 h-4 w-4" />
                                        <span>Duration: {quiz.durationMinutes} minutes</span>
                                    </div>
                                    <div className="flex items-center text-sm text-muted-foreground">
                                        <FileText className="mr-2 h-4 w-4" />
                                        <span>Total Marks: {quiz.totalMarks}</span>
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button asChild className="w-full">
                                        <Link href={`/student/quiz/${quiz.id}`}>
                                            Start Quiz <Play className="ml-2 h-4 w-4 fill-current" />
                                        </Link>
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
