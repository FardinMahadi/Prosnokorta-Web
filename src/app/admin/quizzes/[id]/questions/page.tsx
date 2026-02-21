'use client';

import type { Quiz } from '@/types';

import * as z from 'zod';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react'; // Added useCallback
import { Plus, Trash2, Loader2, ArrowLeft, HelpCircle } from 'lucide-react';

import Navbar from '@/components/Navbar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { getQuizById, addQuestion, deleteQuestion } from '@/lib/api/quizzes';
import { Card, CardTitle, CardHeader, CardContent } from '@/components/ui/card';
import {
    Form,
    FormItem,
    FormField,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form";
import {
    Dialog,
    DialogTitle,
    DialogFooter,
    DialogHeader,
    DialogContent,
    DialogTrigger,
    DialogDescription,
} from "@/components/ui/dialog";

const questionSchema = z.object({
    text: z.string().min(5, { message: "Question text must be at least 5 characters." }),
    option1: z.string().min(1, { message: "Option 1 is required." }),
    option2: z.string().min(1, { message: "Option 2 is required." }),
    option3: z.string().min(1, { message: "Option 3 is required." }),
    option4: z.string().min(1, { message: "Option 4 is required." }),
    correctAnswer: z.string().min(1, { message: "Please select the correct option." }),
    marks: z.number().min(1, { message: "Marks must be at least 1." }),
});

export default function AdminQuestionsPage() {
    const { id } = useParams();
    const router = useRouter();
    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const form = useForm<z.infer<typeof questionSchema>>({
        resolver: zodResolver(questionSchema),
        defaultValues: {
            text: "",
            option1: "",
            option2: "",
            option3: "",
            option4: "",
            correctAnswer: "",
            marks: 1,
        },
    });

    // Wrapped in useCallback to prevent unnecessary re-renders and fix lint warnings
    const fetchQuiz = useCallback(async () => {
        try {
            const data = await getQuizById(Number(id));
            setQuiz(data);
        } catch {
            toast.error("Failed to fetch quiz details.");
            router.push('/admin/quizzes');
        } finally {
            setIsLoading(false);
        }
    }, [id, router]);

    useEffect(() => {
        if (id) fetchQuiz();
    }, [id, fetchQuiz]);

    const onSubmit = async (values: z.infer<typeof questionSchema>) => {
        const payload = {
            text: values.text,
            options: [values.option1, values.option2, values.option3, values.option4],
            correctAnswer: values.correctAnswer,
            marks: values.marks
        };

        try {
            await addQuestion(Number(id), payload);
            toast.success("Question added successfully!");
            setIsDialogOpen(false);
            fetchQuiz();
            form.reset();
        } catch {
            toast.error("Failed to add question.");
        }
    };

    const onDelete = async (questionId: number) => {
        if (!confirm("Are you sure you want to delete this question?")) return;
        try {
            await deleteQuestion(Number(id), questionId);
            toast.success("Question deleted successfully!");
            fetchQuiz();
        } catch {
            toast.error("Failed to delete question.");
        }
    };

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

    if (!quiz) return null;

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow container mx-auto px-4 py-8">
                <Button variant="ghost" className="mb-6" onClick={() => router.push('/admin/quizzes')}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Quizzes
                </Button>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold">{quiz.title} - Questions</h1>
                        <p className="text-muted-foreground">Manage questions for this quiz.</p>
                    </div>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="rounded-full">
                                <Plus className="mr-2 h-4 w-4" /> Add New Question
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px]">
                            <DialogHeader>
                                <DialogTitle>Add New Question</DialogTitle>
                                <DialogDescription>
                                    Enter the question text and options. Mark the correct one.
                                </DialogDescription>
                            </DialogHeader>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                                    <FormField
                                        control={form.control}
                                        name="text"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Question Text</FormLabel>
                                                <FormControl>
                                                    <Textarea placeholder="What is the capital of..." {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <div className="grid grid-cols-1 gap-3">
                                        {[1, 2, 3, 4].map((num) => (
                                            <div key={num} className="flex items-center space-x-2">
                                                <FormField
                                                    control={form.control}
                                                    name={`option${num}` as "option1" | "option2" | "option3" | "option4"}
                                                    render={({ field }) => (
                                                        <FormItem className="flex-grow">
                                                            <div className="flex items-center gap-2">
                                                                <FormControl>
                                                                    <Input placeholder={`Option ${num}`} {...field} />
                                                                </FormControl>
                                                                <Checkbox
                                                                    checked={form.watch('correctAnswer') === field.value && field.value !== ""}
                                                                    onCheckedChange={() => form.setValue('correctAnswer', field.value)}
                                                                />
                                                            </div>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                    <FormField
                                        control={form.control}
                                        name="marks"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Marks</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        {...field}
                                                        onChange={(e) => field.onChange(Number(e.target.value))}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <DialogFooter>
                                        <Button type="submit" className="w-full">
                                            Add Question
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </Form>
                        </DialogContent>
                    </Dialog>
                </div>

                {quiz.questions?.length === 0 ? (
                    <div className="text-center py-12 border-2 border-dashed rounded-xl">
                        <HelpCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                        <h2 className="text-xl font-semibold">No questions yet</h2>
                        <p className="text-muted-foreground">Start by adding your first question to this quiz.</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {quiz.questions?.map((question, index) => (
                            <Card key={question.id}>
                                <CardHeader className="pb-3">
                                    <div className="flex justify-between items-start">
                                        <CardTitle className="text-lg">
                                            <span className="text-primary mr-2">Q{index + 1}.</span>
                                            {question.text}
                                        </CardTitle>
                                        <Button variant="ghost" size="icon" className="text-destructive" onClick={() => onDelete(question.id)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {question.options.map((option, optIndex) => (
                                            <div
                                                key={optIndex}
                                                className={`p-3 rounded-lg border ${option === question.correctAnswer ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-900/30' : 'bg-muted/30'}`}
                                            >
                                                <span className="text-sm">{option}</span>
                                                {option === question.correctAnswer && (
                                                    <span className="ml-2 text-[10px] font-bold text-green-600 dark:text-green-400 uppercase">Correct</span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-4 flex justify-end">
                                        <span className="text-xs font-medium px-2 py-1 bg-primary/10 text-primary rounded">
                                            Marks: {question.marks}
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}