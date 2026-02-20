'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getSubjects, createSubject, updateSubject, deleteSubject } from '@/lib/api/subjects';
import { Subject } from '@/types';
import { toast } from 'sonner';
import { Loader2, Plus, Edit2, Trash2, Search, Book } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const subjectSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters." }),
    code: z.string().min(2, { message: "Code must be at least 2 characters." }),
    description: z.string().optional(),
});

export default function AdminSubjectsPage() {
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

    const form = useForm<z.infer<typeof subjectSchema>>({
        resolver: zodResolver(subjectSchema),
        defaultValues: {
            name: "",
            code: "",
            description: "",
        },
    });

    useEffect(() => {
        fetchSubjects();
    }, []);

    const fetchSubjects = async () => {
        try {
            const data = await getSubjects();
            setSubjects(data || []);
        } catch (error) {
            toast.error("Failed to fetch subjects.");
        } finally {
            setIsLoading(false);
        }
    };

    const onSubmit = async (values: z.infer<typeof subjectSchema>) => {
        try {
            if (editingSubject) {
                await updateSubject(editingSubject.id, values);
                toast.success("Subject updated successfully!");
            } else {
                await createSubject(values);
                toast.success("Subject created successfully!");
            }
            setIsDialogOpen(false);
            fetchSubjects();
            form.reset();
        } catch (error) {
            toast.error("Operation failed.");
        }
    };

    const onEdit = (subject: Subject) => {
        setEditingSubject(subject);
        form.reset({
            name: subject.name,
            code: subject.code,
            description: subject.description || "",
        });
        setIsDialogOpen(true);
    };

    const onDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this subject?")) return;
        try {
            await deleteSubject(id);
            toast.success("Subject deleted successfully!");
            fetchSubjects();
        } catch (error) {
            toast.error("Failed to delete subject.");
        }
    };

    const filteredSubjects = subjects.filter(s => 
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        s.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                    <Dialog open={isDialogOpen} onOpenChange={(open) => {
                        setIsDialogOpen(open);
                        if (!open) {
                            setEditingSubject(null);
                            form.reset({ name: "", code: "", description: "" });
                        }
                    }}>
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
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Subject Name</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="e.g. Computer Science" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="code"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Subject Code</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="e.g. CS101" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="description"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Description (Optional)</FormLabel>
                                                <FormControl>
                                                    <Textarea placeholder="Brief description of the subject..." {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <DialogFooter>
                                        <Button type="submit" className="w-full">
                                            {editingSubject ? "Update Subject" : "Create Subject"}
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </Form>
                        </DialogContent>
                    </Dialog>
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
                            <Card key={subject.id}>
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
                                            <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => onDelete(subject.id)}>
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
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
