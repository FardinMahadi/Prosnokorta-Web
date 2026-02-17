'use client';

import { useState,useEffect, useCallback } from 'react';

export function useQuizTimer(initialMinutes: number, onTimeUp: () => void) {
    const [timeLeft, setTimeLeft] = useState<number | null>(null);
    const [hasStarted, setHasStarted] = useState(false);

    useEffect(() => {
        if (initialMinutes !== null && initialMinutes !== undefined && initialMinutes > 0) {
            setTimeLeft(initialMinutes * 60);
            setHasStarted(true);
        } else if (initialMinutes === 0) {
            setTimeLeft(0);
            // Don't set hasStarted to true if it's 0 to prevent immediate submission
        }
    }, [initialMinutes]);

    const formatTime = useCallback((seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }, []);

    useEffect(() => {
        let timer: NodeJS.Timeout | null = null;

        if (timeLeft === 0 && hasStarted) {
            onTimeUp();
        } else if (timeLeft !== null && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev === null || prev <= 0) return prev;
                    return prev - 1;
                });
            }, 1000);
        }

        return () => {
            if (timer) clearInterval(timer);
        };
    }, [timeLeft, onTimeUp, hasStarted]);

    return {
        timeLeft,
        formattedTime: timeLeft !== null ? formatTime(timeLeft) : '--:--',
        isCritical: timeLeft !== null && timeLeft < 60
    };
}
