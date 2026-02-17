'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Hero } from '@/components/landing/Hero';
import { useAppSelector } from '@/lib/redux/hooks';
import { CallToAction } from '@/components/landing/CTA';
import { Features } from '@/components/landing/Features';

export default function LandingPage() {
    const router = useRouter();
    const { user, isAuthenticated, isLoading } = useAppSelector((state) => state.auth);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
            </div>
        );
    }    

    return (
        <div className="bg-gray-50 min-h-screen selection:bg-primary/10">
            <Hero />
            <Features />
            <CallToAction />
            <footer className="py-16 border-t bg-white">
                <div className="container px-4 mx-auto">
                    <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold">P</div>
                            <span className="text-xl font-bold tracking-tight">Prosnokorta</span>
                        </div>
                        <p className="text-gray-500 text-sm">© {new Date().getFullYear()} Prosnokorta. All rights reserved.</p>
                        <div className="flex gap-6 text-sm text-gray-500 font-medium">
                            <Link href="/login" className="hover:text-primary transition-colors">Privacy</Link>
                            <Link href="/login" className="hover:text-primary transition-colors">Terms</Link>
                            <Link href="/login" className="hover:text-primary transition-colors">Contact</Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
