'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
    const router = useRouter();

    useEffect(() => {
        const userJson = localStorage.getItem('user');
        if (userJson) {
            const user = JSON.parse(userJson);
            if (user.role === 'ADMIN') {
                router.push('/admin/dashboard');
            } else {
                router.push('/student/dashboard');
            }
        } else {
            router.push('/login');
        }
    }, [router]);

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="animate-pulse text-xl font-semibold">Loading...</div>
        </div>
    );
}
