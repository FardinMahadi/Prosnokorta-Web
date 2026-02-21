'use client';

import type { Subject } from '@/types';
import type { SubjectFormValues } from '@/components/admin/SubjectForm';

import { useMemo, useState } from 'react';
import { Book, Search, Loader2 } from 'lucide-react';

import Navbar from '@/components/Navbar';
import { Input } from '@/components/ui/input';
import { useSubjects } from '@/hooks/useSubjects';
import { SubjectCard } from '@/components/admin/SubjectCard';
import { SubjectDialog } from '@/components/admin/SubjectDialog';

export default function AdminSubjectsPage() {
    const { subjects, isLoading, addSubject, editSubject, removeSubject } = useSubjects();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

    const handleFormSubmit = async (values: SubjectFormValues) => {
        let success = false;
        if (editingSubject) {
            success = await editSubject(editingSubject.id, values);
        } else {
            success = await addSubject(values);
        }

        if (success) {
            setIsDialogOpen(false);
            setEditingSubject(null);
        }
    };

    const handleEdit = (subject: Subject) => {
        setEditingSubject(subject);
        setIsDialogOpen(true);
    };

    const filteredSubjects = useMemo(() => subjects.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.code.toLowerCase().includes(searchTerm.toLowerCase())
    ), [subjects, searchTerm]);

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
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold">Subject Management</h1>
                        <p className="text-muted-foreground">Manage the subjects available in the system.</p>
                    </div>
                    <SubjectDialog
                        editingSubject={editingSubject}
                        open={isDialogOpen}
                        onOpenChange={(open: boolean) => {
                            setIsDialogOpen(open);
                            if (!open) {
                                setEditingSubject(null);
                            }
                        }}
                        onSubmit={handleFormSubmit}
                    />
                </div>

                <div className="relative mb-6">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search subjects by name or code..."
                        className="pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {filteredSubjects.length === 0 ? (
                    <div className="text-center py-12 border-2 border-dashed rounded-xl">
                        <Book className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                        <h2 className="text-xl font-semibold">No subjects found</h2>
                        <p className="text-muted-foreground">Try a different search term or add a new subject.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredSubjects.map((subject) => (
                            <SubjectCard
                                key={subject.id}
                                subject={subject}
                                onEdit={handleEdit}
                                onDelete={removeSubject}
                            />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
