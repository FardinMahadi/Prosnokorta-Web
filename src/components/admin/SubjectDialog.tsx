import type { Subject } from '@/types';
import type { SubjectFormValues } from './SubjectForm';

import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogTitle,
    DialogHeader,
    DialogContent,
    DialogTrigger,
    DialogDescription,
} from "@/components/ui/dialog";

import { SubjectForm } from './SubjectForm';

interface SubjectDialogProps {
    editingSubject: Subject | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (values: SubjectFormValues) => Promise<void>;
}

export function SubjectDialog({ editingSubject, open, onOpenChange, onSubmit }: SubjectDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                <Button className="rounded-full">
                    <Plus className="mr-2 h-4 w-4" /> Add New Subject
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{editingSubject ? "Edit Subject" : "Create Subject"}</DialogTitle>
                    <DialogDescription>
                        Fill in the details below to {editingSubject ? "update" : "create"} a subject.
                    </DialogDescription>
                </DialogHeader>
                <SubjectForm
                    key={editingSubject ? `edit-${editingSubject.id}` : 'new'}
                    editingSubject={editingSubject}
                    onSubmit={onSubmit}
                />
            </DialogContent>
        </Dialog>
    );
}
