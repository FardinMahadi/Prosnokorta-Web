'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getEnrolledSubjects } from '@/lib/api/subjects';
import { Subject } from '@/types';
import { toast } from 'sonner';
import { Book, ChevronRight, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function StudentDashboard() {
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                const data = await getEnrolledSubjects();
                setSubjects(data || []);
            } catch (error: any) {
                toast.error("Failed to fetch subjects.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchSubjects();
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
                <header className="mb-8">
                    <h1 className="text-3xl font-bold">My Dashboard</h1>
                    <p className="text-muted-foreground">Select a subject to view available quizzes.</p>
                </header>

                {subjects.length === 0 ? (
                    <div className="text-center py-12 border-2 border-dashed rounded-xl">
                        <Book className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                        <h2 className="text-xl font-semibold">No subjects enrolled</h2>
                        <p className="text-muted-foreground mb-4">You haven&apos;t been enrolled in any subjects yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {subjects.map((subject) => (
                            <Card key={subject.id} className="hover:shadow-md transition-shadow">
                                <CardHeader>
                                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                                        <Book className="h-6 w-6 text-primary" />
                                    </div>
                                    <CardTitle>{subject.name}</CardTitle>
                                    <CardDescription>{subject.code}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground line-clamp-2">
                                        {subject.description || "No description available."}
                                    </p>
                                </CardContent>
                                <CardFooter>
                                    <Button asChild className="w-full">
                                        <Link href={`/student/quizzes/${subject.id}`}>
                                            View Quizzes <ChevronRight className="ml-2 h-4 w-4" />
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
