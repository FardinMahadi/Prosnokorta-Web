'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getAllResults } from '@/lib/api/quizzes';
import { Result } from '@/types';
import { toast } from 'sonner';
import { Calendar, Search, User as UserIcon, BarChart3, Loader2, FileCheck } from 'lucide-react';
import Link from 'next/link';

export default function AdminResultsPage() {
    const [results, setResults] = useState<Result[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchResults();
    }, []);

    const fetchResults = async () => {
        try {
            const data = await getAllResults();
            setResults(data || []);
        } catch (error) {
            toast.error("Failed to fetch results.");
        } finally {
            setIsLoading(false);
        }
    };

    const filteredResults = results.filter(r => 
        r.studentName.toLowerCase().includes(searchTerm.toLowerCase()) || 
        r.quizTitle.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const averagePercentage = results.length > 0 
        ? Math.round(results.reduce((acc, r) => acc + (r.score / r.totalMarks), 0) / results.length * 100)
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

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow container mx-auto px-4 py-8">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold">System Analytics & Results</h1>
                    <p className="text-muted-foreground">Monitor student performance across all quizzes.</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
                            <FileCheck className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{results.length}</div>
                            <p className="text-xs text-muted-foreground">Across all subjects</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                            <BarChart3 className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{averagePercentage}%</div>
                            <p className="text-xs text-muted-foreground">System-wide average</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Active Students</CardTitle>
                            <UserIcon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {new Set(results.map(r => r.studentName)).size}
                            </div>
                            <p className="text-xs text-muted-foreground">Unique participants</p>
                        </CardContent>
                    </Card>
                </div>

                <div className="relative mb-6">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                        placeholder="Search by student name or quiz title..." 
                        className="pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-muted/50 border-b">
                                <tr>
                                    <th className="px-6 py-4 text-sm font-semibold">Student</th>
                                    <th className="px-6 py-4 text-sm font-semibold">Quiz</th>
                                    <th className="px-6 py-4 text-sm font-semibold">Score</th>
                                    <th className="px-6 py-4 text-sm font-semibold">Percentage</th>
                                    <th className="px-6 py-4 text-sm font-semibold">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {filteredResults.map((result) => (
                                    <tr key={result.id} className="hover:bg-muted/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-medium">{result.studentName}</div>
                                        </td>
                                        <td className="px-6 py-4">{result.quizTitle}</td>
                                        <td className="px-6 py-4 font-mono font-medium">
                                            {result.score} / {result.totalMarks}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                                (result.score / result.totalMarks) >= 0.8 ? 'bg-green-100 text-green-700' :
                                                (result.score / result.totalMarks) >= 0.5 ? 'bg-yellow-100 text-yellow-700' :
                                                'bg-red-100 text-red-700'
                                            }`}>
                                                {Math.round((result.score / result.totalMarks) * 100)}%
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
                    {filteredResults.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-muted-foreground">No results found matching your criteria.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
