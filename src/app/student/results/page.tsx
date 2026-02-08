'use client';

import { useEffect, useState } from 'react';
import { studentApi, Result } from '@/lib/api';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import axios from 'axios';

// Badge is not installed yet, I'll use a simple div if badge fails or install it.
// Actually, I'll just use a styled div for now to avoid another install step if not strictly needed.

export default function StudentResultsPage() {
    const [results, setResults] = useState<Result[]>([]);

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const user = JSON.parse(localStorage.getItem('user') || '{}');
                const res = await studentApi.getMyResults(user.id);
                setResults(res.data);
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    toast.error(error.response?.data?.message || 'Failed to fetch results');
                } else {
                    toast.error('An unexpected error occurred');
                }
            }
        };
        fetchResults();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold">My Results</h1>
                    <p className="text-gray-600">Track your performance across all quizzes</p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Attempt History</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Quiz Title</TableHead>
                                    <TableHead>Score</TableHead>
                                    <TableHead>Percentage</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead className="text-right">Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {results.map((result) => {
                                    const percentage = (result.score / result.totalMarks) * 100;
                                    return (
                                        <TableRow key={result.id}>
                                            <TableCell className="font-medium">{result.quizTitle}</TableCell>
                                            <TableCell>{result.score} / {result.totalMarks}</TableCell>
                                            <TableCell>{percentage.toFixed(1)}%</TableCell>
                                            <TableCell>{new Date(result.submittedAt).toLocaleDateString()}</TableCell>
                                            <TableCell className="text-right">
                                                <div className={`inline-flex px-2 py-1 rounded text-xs font-semibold ${percentage >= 40 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                    {percentage >= 40 ? 'PASSED' : 'FAILED'}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                                {results.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                                            You haven&apos;t taken any quizzes yet.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
