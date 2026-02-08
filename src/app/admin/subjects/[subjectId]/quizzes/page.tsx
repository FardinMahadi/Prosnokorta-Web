'use client';

/* eslint-disable no-use-before-define */

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { adminApi, Quiz } from '@/lib/api';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { Plus, ListTodo, ChevronLeft } from 'lucide-react';
import Navbar from '@/components/Navbar';
import axios from 'axios';

export default function AdminQuizzesPage() {
    const { subjectId } = useParams();
    const router = useRouter();
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [newQuiz, setNewQuiz] = useState({ 
        title: '', 
        description: '', 
        durationMinutes: 30, 
        totalMarks: 100,
        subjectId: Number(subjectId)
    });

    const fetchQuizzes = useCallback(async () => {
        try {
            const res = await adminApi.getQuizzesBySubject(Number(subjectId));
            setQuizzes(res.data);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.message || 'Failed to fetch quizzes');
            } else {
                toast.error('An unexpected error occurred');
            }
        }
    }, [subjectId]);

    useEffect(() => {
        fetchQuizzes();
    }, [fetchQuizzes]);

    const handleCreateQuiz = async () => {
        try {
            await adminApi.createQuiz(newQuiz);
            toast.success('Quiz created successfully');
            setIsDialogOpen(false);
            setNewQuiz({ ...newQuiz, title: '', description: '' });
            fetchQuizzes();
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.message || 'Failed to create quiz');
            } else {
                toast.error('An unexpected error occurred');
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="container mx-auto px-4 py-8">
                <div className="flex items-center gap-4 mb-8">
                    <Button variant="ghost" size="icon" onClick={() => router.push('/admin/dashboard')}>
                        <ChevronLeft />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold">Manage Quizzes</h1>
                        <p className="text-gray-600">Create and manage quizzes for this subject</p>
                    </div>
                    <div className="ml-auto">
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                                <Button><Plus size={16} className="mr-2" /> Add Quiz</Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Create New Quiz</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                        <Label>Quiz Title</Label>
                                        <Input 
                                            value={newQuiz.title} 
                                            onChange={e => setNewQuiz({...newQuiz, title: e.target.value})} 
                                            placeholder="e.g. Midterm Exam"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Description</Label>
                                        <Input 
                                            value={newQuiz.description} 
                                            onChange={e => setNewQuiz({...newQuiz, description: e.target.value})} 
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Duration (Min)</Label>
                                            <Input 
                                                type="number"
                                                value={newQuiz.durationMinutes} 
                                                onChange={e => setNewQuiz({...newQuiz, durationMinutes: Number(e.target.value)})} 
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Total Marks</Label>
                                            <Input 
                                                type="number"
                                                value={newQuiz.totalMarks} 
                                                onChange={e => setNewQuiz({...newQuiz, totalMarks: Number(e.target.value)})} 
                                            />
                                        </div>
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button onClick={handleCreateQuiz}>Create Quiz</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Available Quizzes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Duration</TableHead>
                                    <TableHead>Total Marks</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {quizzes.map((quiz) => (
                                    <TableRow key={quiz.id}>
                                        <TableCell className="font-medium">{quiz.title}</TableCell>
                                        <TableCell>{quiz.durationMinutes} mins</TableCell>
                                        <TableCell>{quiz.totalMarks}</TableCell>
                                        <TableCell className="text-right">
                                            <Button size="sm" variant="outline" onClick={() => router.push(`/admin/quizzes/${quiz.id}/questions`)}>
                                                <ListTodo size={16} className="mr-2" />
                                                Manage Questions
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {quizzes.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                                            No quizzes found. Create your first quiz.
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
