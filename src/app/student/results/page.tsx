'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getStudentResults } from '@/lib/api/quizzes';
import { Result } from '@/types';
import { toast } from 'sonner';
import { Calendar, ChevronRight, FileCheck, Loader2, Trophy } from 'lucide-react';
import Link from 'next/link';

export default function StudentResultsPage() {
    const [results, setResults] = useState<Result[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const data = await getStudentResults();
                setResults(data || []);
            } catch (error: any) {
                toast.error("Failed to fetch results.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchResults();
    }, []);

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
                <header className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">My Results</h1>
                        <p className="text-muted-foreground">Review your past quiz performances.</p>
                    </div>
                </header>

                {results.length === 0 ? (
                    <div className="text-center py-12 border-2 border-dashed rounded-xl">
                        <Trophy className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                        <h2 className="text-xl font-semibold">No results yet</h2>
                        <p className="text-muted-foreground mb-4">You haven&apos;t completed any quizzes yet.</p>
                        <Button asChild>
                            <Link href="/student/dashboard">Start Knowledge Check</Link>
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {results.map((result) => (
                            <Card key={result.id} className="hover:bg-muted/30 transition-colors">
                                <Link href={`/student/results/${result.id}`}>
                                    <div className="flex items-center justify-between p-6">
                                        <div className="flex items-center space-x-4">
                                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                                <FileCheck className="h-5 w-5 text-primary" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold">{result.quizTitle}</h3>
                                                <div className="flex items-center text-sm text-muted-foreground mt-1">
                                                    <Calendar className="mr-1 h-3 w-3" />
                                                    {new Date(result.submittedAt).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-6">
                                            <div className="text-right">
                                                <p className="text-lg font-bold text-primary">
                                                    {result.score} / {result.totalMarks}
                                                </p>
                                                <p className="text-xs text-muted-foreground">Score</p>
                                            </div>
                                            <ChevronRight className="h-5 w-5 text-muted-foreground" />
                                        </div>
                                    </div>
                                </Link>
                            </Card>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
