'use client';


import { useMemo, useState } from 'react';
import { Search, Loader2 } from 'lucide-react';

import Navbar from '@/components/Navbar';
import { Input } from '@/components/ui/input';
import { useResults } from '@/hooks/useResults';
import { ResultsTable } from '@/components/admin/ResultsTable';
import { AnalyticsSummary } from '@/components/admin/AnalyticsSummary';

export default function AdminResultsPage() {
    const { results, isLoading } = useResults();
    const [searchTerm, setSearchTerm] = useState("");

    const filteredResults = useMemo(() => results.filter(r =>
        r.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.quizTitle.toLowerCase().includes(searchTerm.toLowerCase())
    ), [results, searchTerm]);

    const averagePercentage = useMemo(() => {
        if (results.length === 0) return 0;
        const total = results.reduce((acc, r) => acc + (r.score / r.totalMarks), 0);
        return Math.round((total / results.length) * 100);
    }, [results]);

    const activeStudents = useMemo(() => new Set(results.map(r => r.studentName)).size, [results]);

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

                <AnalyticsSummary
                    totalSubmissions={results.length}
                    averagePercentage={averagePercentage}
                    activeStudents={activeStudents}
                />

                <div className="relative mb-6">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by student name or quiz title..."
                        className="pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <ResultsTable results={filteredResults} />
            </main>
        </div>
    );
}
