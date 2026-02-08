'use client';

/* eslint-disable no-use-before-define */

import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import axios from 'axios';
import { useEffect, useState, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { adminApi, Question } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { useParams, useRouter } from 'next/navigation';
import { Plus, ChevronLeft } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';

export default function AdminQuestionsPage() {
    const { quizId } = useParams();
    const router = useRouter();
    const [questions, setQuestions] = useState<Question[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [newQuestion, setNewQuestion] = useState({ 
        text: '', 
        options: ['', '', '', ''], 
        correctAnswer: '', 
        marks: 5,
        quizId: Number(quizId)
    });

    const fetchQuestions = useCallback(async () => {
        try {
            const res = await adminApi.getQuestionsByQuiz(Number(quizId));
            setQuestions(res.data);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.message || 'Failed to fetch questions');
            } else {
                toast.error('An unexpected error occurred');
            }
        }
    }, [quizId]);

    useEffect(() => {
        fetchQuestions();
    }, [fetchQuestions]);

    const handleAddQuestion = async () => {
        if (!newQuestion.correctAnswer || newQuestion.options.some(o => !o)) {
            toast.error('Please fill all options and select a correct answer');
            return;
        }
        try {
            await adminApi.addQuestion(Number(quizId), newQuestion);
            toast.success('Question added successfully');
            setIsDialogOpen(false);
            setNewQuestion({ 
                text: '', 
                options: ['', '', '', ''], 
                correctAnswer: '', 
                marks: 5,
                quizId: Number(quizId)
            });
            fetchQuestions();
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.message || 'Failed to add question');
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
                    <Button variant="ghost" size="icon" onClick={() => router.back()}>
                        <ChevronLeft />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold">Manage Questions</h1>
                        <p className="text-gray-600">Add or remove questions from this quiz</p>
                    </div>
                    <div className="ml-auto">
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                                <Button><Plus size={16} className="mr-2" /> Add Question</Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                    <DialogTitle>Add New Question</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                        <Label>Question Text</Label>
                                        <Input 
                                            value={newQuestion.text} 
                                            onChange={e => setNewQuestion({...newQuestion, text: e.target.value})} 
                                            placeholder="Enter question text"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        {newQuestion.options.map((opt, idx) => (
                                            <div key={idx} className="space-y-2">
                                                <Label>Option {idx + 1}</Label>
                                                <Input 
                                                    value={opt} 
                                                    onChange={e => {
                                                        const newOpts = [...newQuestion.options];
                                                        newOpts[idx] = e.target.value;
                                                        setNewQuestion({...newQuestion, options: newOpts});
                                                    }} 
                                                    placeholder={`Option ${idx + 1}`}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Correct Answer</Label>
                                            <select 
                                                className="w-full border rounded-md p-2 h-10"
                                                value={newQuestion.correctAnswer}
                                                onChange={e => setNewQuestion({...newQuestion, correctAnswer: e.target.value})}
                                            >
                                                <option value="">Select Correct Option</option>
                                                {newQuestion.options.filter(o => o).map(o => (
                                                    <option key={o} value={o}>{o}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Marks</Label>
                                            <Input 
                                                type="number"
                                                value={newQuestion.marks} 
                                                onChange={e => setNewQuestion({...newQuestion, marks: Number(e.target.value)})} 
                                            />
                                        </div>
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button onClick={handleAddQuestion}>Add Question</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                <div className="space-y-6">
                    {questions.map((q, idx) => (
                        <Card key={q.id}>
                            <CardContent className="pt-6">
                                <div className="flex justify-between font-semibold mb-4">
                                    <span>Q{idx + 1}: {q.text}</span>
                                    <span className="text-primary">{q.marks} Marks</span>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    {q.options.map((opt) => (
                                        <div key={opt} className={`p-3 rounded-md border ${opt === q.correctAnswer ? 'bg-green-50 border-green-200 text-green-700' : 'bg-gray-50'}`}>
                                            {opt} {opt === q.correctAnswer && '(Correct)'}
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                    {questions.length === 0 && (
                        <Card>
                            <CardContent className="py-12 text-center text-gray-500">
                                No questions added yet.
                            </CardContent>
                        </Card>
                    )}
                </div>
            </main>
        </div>
    );
}
