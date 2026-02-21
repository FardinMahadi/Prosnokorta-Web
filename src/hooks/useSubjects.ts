import type { Subject } from '@/types';
import type { SubjectFormValues } from '@/components/admin/SubjectForm';

import { toast } from 'sonner';
import { useState, useEffect, useCallback } from 'react';

import { getSubjects, createSubject, updateSubject, deleteSubject } from '@/lib/api/subjects';

export function useSubjects() {
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchSubjects = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await getSubjects();
            setSubjects(data || []);
        } catch {
            toast.error("Failed to fetch subjects.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSubjects();
    }, [fetchSubjects]);

    const addSubject = async (values: SubjectFormValues) => {
        try {
            await createSubject(values);
            toast.success("Subject created successfully!");
            await fetchSubjects();
            return true;
        } catch {
            toast.error("Failed to create subject.");
            return false;
        }
    };

    const editSubject = async (id: number, values: SubjectFormValues) => {
        try {
            await updateSubject(id, values);
            toast.success("Subject updated successfully!");
            await fetchSubjects();
            return true;
        } catch {
            toast.error("Failed to update subject.");
            return false;
        }
    };

    const removeSubject = async (id: number) => {
        if (!confirm("Are you sure you want to delete this subject?")) return false;
        try {
            await deleteSubject(id);
            toast.success("Subject deleted successfully!");
            await fetchSubjects();
            return true;
        } catch {
            toast.error("Failed to delete subject.");
            return false;
        }
    };

    return {
        subjects,
        isLoading,
        fetchSubjects,
        addSubject,
        editSubject,
        removeSubject,
    };
}
