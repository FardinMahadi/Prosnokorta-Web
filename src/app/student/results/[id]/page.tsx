'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getStudentResults } from '@/lib/api/quizzes';
import { Result } from '@/types';
import { toast } from 'sonner';
import { CheckCircle2, XCircle, Loader2, Award, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ResultDetailPage() {
    const { id } = useParams();
    const [result, setResult] = useState<Result | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchResult = async () => {
            try {
                const allResults = await getStudentResults();
                const currentResult = allResults.find(r => r.id === Number(id));
                setResult(currentResult || null);
            } catch (error: any) {
                toast.error("Failed to fetch result details.");
            } finally {
                setIsLoading(false);
            }
        };

        if (id) fetchResult();
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

    if (!result) {
        return (
            <div className="min-h-screen flex flex-col">
                <Navbar />
                <div className="flex-grow flex flex-col items-center justify-center space-y-4">
                    <p className="text-xl">Result not found.</p>
                    <Button asChild><Link href="/student/results">Back to Results</Link></Button>
                </div>
            </div>
        );
    }

    const percentage = Math.round((result.score / result.totalMarks) * 100);

    return (
        <div className="min-h-screen flex flex-col bg-muted/30">
            <Navbar />
            <main className="flex-grow container mx-auto max-w-4xl px-4 py-8">
                <Button variant="ghost" className="mb-6" asChild>
                    <Link href="/student/results">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Results
                    </Link>
                </Button>

                <Card className="mb-8 overflow-hidden border-t-4 border-primary">
                    <CardHeader className="bg-background">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-3xl font-bold">{result.quizTitle}</CardTitle>
                                <CardDescription className="text-lg">Quiz Performance Summary</CardDescription>
                            </div>
                            <Award className="h-12 w-12 text-primary" />
                        </div>
                    </CardHeader>
                    <CardContent className="bg-background grid grid-cols-1 md:grid-cols-3 gap-6 py-8 border-y">
                        <div className="text-center">
                            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Score</p>
                            <p className="text-4xl font-extrabold text-primary">{result.score} / {result.totalMarks}</p>
                        </div>
                        <div className="text-center">
                            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Percentage</p>
                            <p className="text-4xl font-extrabold text-primary">{percentage}%</p>
                        </div>
                        <div className="text-center">
                            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Date</p>
                            <p className="text-2xl font-bold mt-2">{new Date(result.submittedAt).toLocaleDateString()}</p>
                        </div>
                    </CardContent>
                </Card>

                <h2 className="text-2xl font-bold mb-6 flex items-center">
                    Detailed Breakdown
                </h2>

                <div className="space-y-6">
                    {result.answers?.map((answer, index) => (
                        <Card key={index} className={`border-l-4 ${answer.isCorrect ? 'border-l-green-500' : 'border-l-red-500'}`}>
                            <CardHeader className="pb-3">
                                <div className="flex items-start justify-between gap-4">
                                    <h3 className="text-lg font-semibold leading-tight">
                                        <span className="text-muted-foreground mr-2 font-mono">Q{index + 1}.</span>
                                        {answer.questionText}
                                    </h3>
                                    {answer.isCorrect ? (
                                        <CheckCircle2 className="h-6 w-6 text-green-500 shrink-0" />
                                    ) : (
                                        <XCircle className="h-6 w-6 text-red-500 shrink-0" />
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="p-3 rounded-lg bg-muted/50">
                                        <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Your Answer</p>
                                        <p className={`font-medium ${answer.isCorrect ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                            {answer.selectedOption || "Not Answered"}
                                        </p>
                                    </div>
                                    {!answer.isCorrect && (
                                        <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900/30">
                                            <p className="text-xs font-semibold text-green-600 dark:text-green-400 uppercase mb-1">Correct Answer</p>
                                            <p className="font-medium text-green-700 dark:text-green-300">
                                                {answer.correctOption}
                                            </p>
                                        </div>
                                    )}
                                </div>
                                <div className="text-right">
                                    <span className="text-sm px-2 py-1 bg-muted rounded font-medium">
                                        Marks: {answer.marksEarned}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </main>
        </div>
    );
}
