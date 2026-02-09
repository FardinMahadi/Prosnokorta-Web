'use client';

import axios from 'axios';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';
import { adminApi } from '@/lib/api';
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTitle, DialogFooter, DialogHeader, DialogContent, DialogTrigger } from '@/components/ui/dialog';

interface AddQuestionDialogProps {
    quizId: number;
    onSuccess: () => void;
}

export function AddQuestionDialog({ quizId, onSuccess }: AddQuestionDialogProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [newQuestion, setNewQuestion] = useState({ 
        text: '', 
        options: ['', '', '', ''], 
        correctAnswer: '', 
        marks: 5,
        quizId
    });

    useEffect(() => {
        setNewQuestion(prev => ({ ...prev, quizId }));
    }, [quizId]);

    const handleAddQuestion = async () => {
        if (!newQuestion.text || !newQuestion.correctAnswer || newQuestion.options.some(o => !o)) {
            toast.error('Please fill all fields and select a correct answer');
            return;
        }
        try {
            await adminApi.addQuestion(quizId, newQuestion);
            toast.success('Question added successfully');
            setIsDialogOpen(false);
            setNewQuestion({ 
                text: '', 
                options: ['', '', '', ''], 
                correctAnswer: '', 
                marks: 5,
                quizId
            });
            onSuccess();
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.message || 'Failed to add question');
            } else {
                toast.error('An unexpected error occurred');
            }
        }
    };

    return (
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
    );
}
