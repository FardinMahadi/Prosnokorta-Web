'use client';

/* eslint-disable no-use-before-define */

import { useEffect, useState, useCallback } from 'react';
import { adminApi, Subject } from '@/lib/api';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { Plus, BookOpen } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function AdminDashboard() {
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [newSubject, setNewSubject] = useState({ name: '', code: '', description: '' });
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const router = useRouter();

    const fetchSubjects = useCallback(async () => {
        try {
            const res = await adminApi.getAllSubjects();
            setSubjects(res.data);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.message || 'Failed to fetch subjects');
            } else {
                toast.error('An unexpected error occurred');
            }
        }
    }, []);

    useEffect(() => {
        fetchSubjects();
    }, [fetchSubjects]);

    const handleCreateSubject = async () => {
        try {
            await adminApi.createSubject(newSubject);
            toast.success('Subject created successfully');
            setIsDialogOpen(false);
            setNewSubject({ name: '', code: '', description: '' });
            fetchSubjects();
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.message || 'Failed to create subject');
            } else {
                toast.error('An unexpected error occurred');
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                        <p className="text-gray-600">Manage subjects and quizzes</p>
                    </div>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button><Plus size={16} className="mr-2" /> Add Subject</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Create New Subject</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label>Subject Name</Label>
                                    <Input 
                                        value={newSubject.name} 
                                        onChange={e => setNewSubject({...newSubject, name: e.target.value})} 
                                        placeholder="e.g. Mathematics"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Subject Code</Label>
                                    <Input 
                                        value={newSubject.code} 
                                        onChange={e => setNewSubject({...newSubject, code: e.target.value})} 
                                        placeholder="e.g. MATH101"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Description</Label>
                                    <Input 
                                        value={newSubject.description} 
                                        onChange={e => setNewSubject({...newSubject, description: e.target.value})} 
                                        placeholder="Brief description"
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button onClick={handleCreateSubject}>Create Subject</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="grid gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Subjects</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Code</TableHead>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Description</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {subjects.map((subject) => (
                                        <TableRow key={subject.id}>
                                            <TableCell className="font-medium">{subject.code}</TableCell>
                                            <TableCell>{subject.name}</TableCell>
                                            <TableCell>{subject.description}</TableCell>
                                            <TableCell className="text-right">
                                                <Button size="sm" variant="outline" onClick={() => router.push(`/admin/subjects/${subject.id}/quizzes`)}>
                                                    <BookOpen size={16} className="mr-2" />
                                                    View Quizzes
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {subjects.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                                                No subjects found. Create your first subject to get started.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}
