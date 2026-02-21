import type { Subject } from '@/types';

import { Edit2, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

interface SubjectCardProps {
    subject: Subject;
    onEdit: (subject: Subject) => void;
    onDelete: (id: number) => void;
}

export function SubjectCard({ subject, onEdit, onDelete }: SubjectCardProps) {
    return (
        <Card>
            <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle>{subject.name}</CardTitle>
                        <CardDescription>{subject.code}</CardDescription>
                    </div>
                    <div className="flex space-x-1">
                        <Button variant="ghost" size="icon" onClick={() => onEdit(subject)}>
                            <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive"
                            onClick={() => onDelete(subject.id)}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-3">
                    {subject.description || "No description provided."}
                </p>
            </CardContent>
        </Card>
    );
}
