'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getQuizzes, createQuiz, updateQuiz, deleteQuiz } from '@/lib/api/quizzes';
import { getSubjects } from '@/lib/api/subjects';
import { Quiz, Subject } from '@/types';
import { toast } from 'sonner';
import { Loader2, Plus, Edit2, Trash2, Search, FileText, Clock, BarChart } from 'lucide-react';
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';

const quizSchema = z.object({
    title: z.string().min(2, { message: "Title must be at least 2 characters." }),
    description: z.string().min(5, { message: "Description must be at least 5 characters." }),
    subjectId: z.string().min(1, { message: "Please select a subject." }),
    durationMinutes: z.coerce.number().min(1, { message: "Duration must be at least 1 minute." }),
    totalMarks: z.coerce.number().min(1, { message: "Total marks must be at least 1." }),
});

export default function AdminQuizzesPage() {
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

    const form = useForm<z.infer<typeof quizSchema>>({
        resolver: zodResolver(quizSchema),
        defaultValues: {
            title: "",
            description: "",
            subjectId: "",
            durationMinutes: 30,
            totalMarks: 100,
        },
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [quizzesData, subjectsData] = await Promise.all([
                getQuizzes(),
                getSubjects()
            ]);
            setQuizzes(quizzesData || []);
            setSubjects(subjectsData || []);
        } catch (error) {
            toast.error("Failed to fetch data.");
        } finally {
            setIsLoading(false);
        }
    };

    const onSubmit = async (values: z.infer<typeof quizSchema>) => {
        try {
            const payload = {
                ...values,
                subjectId: Number(values.subjectId)
            };

            if (editingQuiz) {
                await updateQuiz(editingQuiz.id, payload);
                toast.success("Quiz updated successfully!");
            } else {
                await createQuiz(payload);
                toast.success("Quiz created successfully!");
            }
            setIsDialogOpen(false);
            fetchData();
            form.reset();
        } catch (error) {
            toast.error("Operation failed.");
        }
    };

    const onDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this quiz?")) return;
        try {
            await deleteQuiz(id);
            toast.success("Quiz deleted successfully!");
            fetchData();
        } catch (error) {
            toast.error("Failed to delete quiz.");
        }
    };

    const onEdit = (quiz: Quiz) => {
        setEditingQuiz(quiz);
        form.reset({
            title: quiz.title,
            description: quiz.description,
            subjectId: quiz.subjectId.toString(),
            durationMinutes: quiz.durationMinutes,
            totalMarks: quiz.totalMarks,
        });
        setIsDialogOpen(true);
    };

    const filteredQuizzes = quizzes.filter(q => 
        q.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        q.subjectName?.toLowerCase().includes(searchTerm.toLowerCase())
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
                        <h1 className="text-3xl font-bold">Quiz Management</h1>
                        <p className="text-muted-foreground">Create and manage your quizzes and questions.</p>
                    </div>
                    <Dialog open={isDialogOpen} onOpenChange={(open) => {
                        setIsDialogOpen(open);
                        if (!open) {
                            setEditingQuiz(null);
                            form.reset();
                        }
                    }}>
                        <DialogTrigger asChild>
                            <Button className="rounded-full">
                                <Plus className="mr-2 h-4 w-4" /> Create New Quiz
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>{editingQuiz ? "Edit Quiz" : "Create Quiz"}</DialogTitle>
                                <DialogDescription>
                                    Fill in the details below to {editingQuiz ? "update" : "create"} a quiz.
                                </DialogDescription>
                            </DialogHeader>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                                    <FormField
                                        control={form.control}
                                        name="title"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Quiz Title</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="e.g. Midterm Exam" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="subjectId"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Subject</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select a subject" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {subjects.map(subject => (
                                                            <SelectItem key={subject.id} value={subject.id.toString()}>
                                                                {subject.name} ({subject.code})
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <div className="grid grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="durationMinutes"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Duration (Min)</FormLabel>
                                                    <FormControl>
                                                        <Input type="number" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="totalMarks"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Total Marks</FormLabel>
                                                    <FormControl>
                                                        <Input type="number" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <FormField
                                        control={form.control}
                                        name="description"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Description</FormLabel>
                                                <FormControl>
                                                    <Textarea placeholder="Brief description of the quiz..." {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <DialogFooter>
                                        <Button type="submit" className="w-full">
                                            {editingQuiz ? "Update Quiz" : "Create Quiz"}
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
                        placeholder="Search quizzes by title or subject..." 
                        className="pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {filteredQuizzes.length === 0 ? (
                    <div className="text-center py-12 border-2 border-dashed rounded-xl">
                        <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                        <h2 className="text-xl font-semibold">No quizzes found</h2>
                        <p className="text-muted-foreground">Create a new quiz to get started.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredQuizzes.map((quiz) => (
                            <Card key={quiz.id} className="flex flex-col">
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <div className="bg-primary/10 text-primary text-xs font-bold px-2 py-1 rounded">
                                            {quiz.subjectName}
                                        </div>
                                        <div className="flex space-x-1">
                                            <Button variant="ghost" size="icon" onClick={() => onEdit(quiz)}>
                                                <Edit2 className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => onDelete(quiz.id)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                    <CardTitle className="mt-2">{quiz.title}</CardTitle>
                                    <CardDescription className="line-clamp-2">{quiz.description}</CardDescription>
                                </CardHeader>
                                <CardContent className="flex-grow space-y-2">
                                    <div className="flex items-center text-sm text-muted-foreground">
                                        <Clock className="mr-2 h-4 w-4" />
                                        <span>{quiz.durationMinutes} mins</span>
                                    </div>
                                    <div className="flex items-center text-sm text-muted-foreground">
                                        <BarChart className="mr-2 h-4 w-4" />
                                        <span>{quiz.totalMarks} marks</span>
                                    </div>
                                </CardContent>
                                <CardFooter className="gap-2">
                                    <Button variant="outline" size="sm" className="flex-grow" asChild>
                                        <Link href={`/admin/quizzes/${quiz.id}/questions`}>
                                            Questions
                                        </Link>
                                    </Button>
                                    <Button variant="outline" size="sm" className="flex-grow" asChild>
                                        <Link href={`/admin/results/${quiz.id}`}>
                                            Results
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
