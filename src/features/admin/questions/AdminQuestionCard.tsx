'use client';

import type { Question } from '@/types';

import { Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface AdminQuestionCardProps {
    question: Question;
    index: number;
    onDelete: (id: number) => void;
}

export function AdminQuestionCard({ question, index, onDelete }: AdminQuestionCardProps) {
    return (
        <Card>
            <CardContent className="pt-6">
                <div className="flex justify-between items-start font-semibold mb-4">
                    <div className="flex-1 mr-4">
                        <span className="text-gray-400 mr-2">Q{index + 1}.</span>
                        {question.text}
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-primary whitespace-nowrap">{question.marks} Marks</span>
                        <div className="flex gap-1">
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                                <Edit size={14} />
                            </Button>
                            <Button 
                                size="icon" 
                                variant="ghost" 
                                onClick={() => onDelete(question.id)} 
                                className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                                <Trash2 size={14} />
                            </Button>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {question.options.map((opt) => (
                        <div 
                            key={opt} 
                            className={`p-3 rounded-md border text-sm sm:text-base ${
                                opt === question.correctAnswer 
                                    ? 'bg-green-50 border-green-200 text-green-700 font-medium' 
                                    : 'bg-gray-50'
                            }`}
                        >
                            <span className="mr-2 opacity-50">•</span>
                            {opt} 
                            {opt === question.correctAnswer && (
                                <span className="ml-1 text-[10px] font-bold uppercase tracking-wider">(Correct)</span>
                            )}
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
