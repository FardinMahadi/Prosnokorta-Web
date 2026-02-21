import type { Result } from '@/types';

import { toast } from 'sonner';
import { useState, useEffect, useCallback } from 'react';

import { getAllResults } from '@/lib/api/quizzes';

export function useResults() {
    const [results, setResults] = useState<Result[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchResults = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await getAllResults();
            setResults(data || []);
        } catch {
            toast.error("Failed to fetch results.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchResults();
    }, [fetchResults]);

    return {
        results,
        isLoading,
        fetchResults,
    };
}
