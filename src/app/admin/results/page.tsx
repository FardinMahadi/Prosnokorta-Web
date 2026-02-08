'use client';

import { useEffect, useState } from 'react';
import { adminApi, Result } from '@/lib/api';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import axios from 'axios';

export default function AdminResultsPage() {
    const [results, setResults] = useState<Result[]>([]);

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const res = await adminApi.getAllResults();
                setResults(res.data);
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    toast.error(error.response?.data?.message || 'Failed to fetch all results');
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
                    <h1 className="text-3xl font-bold">Quiz Results</h1>
                    <p className="text-gray-600">Monitor student performance across all quizzes</p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>All Student Attempts</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Student Name</TableHead>
                                    <TableHead>Quiz Title</TableHead>
                                    <TableHead>Score</TableHead>
                                    <TableHead>Percentage</TableHead>
                                    <TableHead>Date</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {results.map((result) => {
                                    const percentage = (result.score / result.totalMarks) * 100;
                                    return (
                                        <TableRow key={result.id}>
                                            <TableCell className="font-medium">{result.studentName}</TableCell>
                                            <TableCell>{result.quizTitle}</TableCell>
                                            <TableCell>{result.score} / {result.totalMarks}</TableCell>
                                            <TableCell>{percentage.toFixed(1)}%</TableCell>
                                            <TableCell>{new Date(result.submittedAt).toLocaleDateString()}</TableCell>
                                        </TableRow>
                                    );
                                })}
                                {results.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                                            No quiz submissions found.
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
