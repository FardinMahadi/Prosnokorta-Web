'use client';

import type { Quiz, Result } from '@/types';

import { toast } from 'sonner';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Users, Award, Loader2, FileText, ArrowLeft, TrendingUp } from 'lucide-react';

import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { getQuizById, getResultsByQuiz } from '@/lib/api/quizzes';
import { Card, CardTitle, CardHeader, CardContent } from '@/components/ui/card';

export default function QuizResultsPage() {
    const { id } = useParams();
    const router = useRouter();
    const [results, setResults] = useState<Result[]>([]);
    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [resultsData, quizData] = await Promise.all([
                    getResultsByQuiz(Number(id)),
                    getQuizById(Number(id))
                ]);
                setResults(resultsData || []);
                setQuiz(quizData);
            } catch {
                toast.error("Failed to fetch quiz results.");
            } finally {
                setIsLoading(false);
            }
        };

        if (id) fetchData();
    }, [id]);

    const averageScore = results.length > 0
        ? (results.reduce((acc, r) => acc + r.score, 0) / results.length).toFixed(1)
        : 0;

    const highestScore = results.length > 0
        ? Math.max(...results.map(r => r.score))
        : 0;

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
            <main className="flex-grow container mx-auto px-4 py-8">
                <Button variant="ghost" className="mb-6" onClick={() => router.push('/admin/quizzes')}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Quizzes
                </Button>

                <header className="mb-8">
                    <h1 className="text-3xl font-bold">{quiz.title} - Results</h1>
                    <p className="text-muted-foreground">Admin overview for this specific quiz.</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Card className="bg-background">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Submissions</CardTitle>
                            <Users className="h-4 w-4 text-primary" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{results.length}</div>
                        </CardContent>
                    </Card>
                    <Card className="bg-background">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                            <TrendingUp className="h-4 w-4 text-primary" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{averageScore} / {quiz.totalMarks}</div>
                        </CardContent>
                    </Card>
                    <Card className="bg-background">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Highest Score</CardTitle>
                            <Award className="h-4 w-4 text-primary" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{highestScore} / {quiz.totalMarks}</div>
                        </CardContent>
                    </Card>
                </div>

                {results.length === 0 ? (
                    <div className="text-center py-12 bg-background border-2 border-dashed rounded-xl">
                        <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                        <h2 className="text-xl font-semibold">No submissions yet</h2>
                        <p className="text-muted-foreground">Students haven&apos;t taken this quiz yet.</p>
                    </div>
                ) : (
                    <div className="bg-background rounded-xl border shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-muted/50 border-b">
                                    <tr>
                                        <th className="px-6 py-4 text-sm font-semibold">Student Name</th>
                                        <th className="px-6 py-4 text-sm font-semibold">Score</th>
                                        <th className="px-6 py-4 text-sm font-semibold">Percentage</th>
                                        <th className="px-6 py-4 text-sm font-semibold">Date Submitted</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {results.map((result) => (
                                        <tr key={result.id} className="hover:bg-muted/30 transition-colors">
                                            <td className="px-6 py-4 font-medium">{result.studentName}</td>
                                            <td className="px-6 py-4 font-mono font-medium">
                                                {result.score} / {quiz.totalMarks}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                                    (result.score / quiz.totalMarks) >= 0.8 ? 'bg-green-100 text-green-700' :
                                                    (result.score / quiz.totalMarks) >= 0.5 ? 'bg-yellow-100 text-yellow-700' :
                                                    'bg-red-100 text-red-700'
                                                }`}>
                                                    {Math.round((result.score / quiz.totalMarks) * 100)}%
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-muted-foreground">
                                                {new Date(result.submittedAt).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
