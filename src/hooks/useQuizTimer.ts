'use client';

import { useState,useEffect, useCallback } from 'react';

export function useQuizTimer(initialMinutes: number, onTimeUp: () => void) {
    const [timeLeft, setTimeLeft] = useState<number | null>(null);

    useEffect(() => {
        if (initialMinutes !== null && initialMinutes !== undefined) {
            setTimeLeft(initialMinutes * 60);
        }
    }, [initialMinutes]);

    const formatTime = useCallback((seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }, []);

    useEffect(() => {
        let timer: NodeJS.Timeout | null = null;

        if (timeLeft === 0) {
            onTimeUp();
        } else if (timeLeft !== null) {
            timer = setInterval(() => {
                setTimeLeft(prev => (prev !== null && prev > 0 ? prev - 1 : prev));
            }, 1000);
        }

        return () => {
            if (timer) clearInterval(timer);
        };
    }, [timeLeft, onTimeUp]);

    return {
        timeLeft,
        formattedTime: timeLeft !== null ? formatTime(timeLeft) : '--:--',
        isCritical: timeLeft !== null && timeLeft < 60
    };
}
