import type { Subject } from '@/types';

import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { DialogFooter } from '@/components/ui/dialog';
import {
    Form,
    FormItem,
    FormField,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form";

const subjectSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters." }),
    code: z.string().min(2, { message: "Code must be at least 2 characters." }),
    description: z.string().optional(),
});

export type SubjectFormValues = z.infer<typeof subjectSchema>;

interface SubjectFormProps {
    editingSubject?: Subject | null;
    onSubmit: (values: SubjectFormValues) => Promise<void>;
}

export function SubjectForm({ editingSubject, onSubmit }: SubjectFormProps) {
    const form = useForm<SubjectFormValues>({
        resolver: zodResolver(subjectSchema),
        defaultValues: {
            name: editingSubject?.name || "",
            code: editingSubject?.code || "",
            description: editingSubject?.description || "",
        },
    });

    return (
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
    );
}
