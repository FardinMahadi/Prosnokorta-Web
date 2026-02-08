'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { authApi } from '@/lib/api';
import { toast } from 'sonner';
import { LogOut, User } from 'lucide-react';

export default function Navbar() {
    const router = useRouter();
    const user = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || '{}') : null;

    const handleLogout = async () => {
        try {
            await authApi.logout();
            localStorage.removeItem('user');
            toast.success('Logged out successfully');
            router.push('/login');
        } catch (error) {
            localStorage.removeItem('user');
            router.push('/login');
        }
    };

    if (!user?.name) return null;

    return (
        <nav className="border-b bg-white">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                <div className="flex items-center gap-6">
                    <div className="font-bold text-xl cursor-pointer" onClick={() => router.push(user.role === 'ADMIN' ? '/admin/dashboard' : '/student/dashboard')}>
                        QuizMaster
                    </div>
                    <div className="flex gap-4">
                        {user.role === 'ADMIN' ? (
                            <>
                                <Button variant="link" onClick={() => router.push('/admin/dashboard')}>Subjects</Button>
                                <Button variant="link" onClick={() => router.push('/admin/results')}>Results</Button>
                            </>
                        ) : (
                            <>
                                <Button variant="link" onClick={() => router.push('/student/dashboard')}>Quizzes</Button>
                                <Button variant="link" onClick={() => router.push('/student/results')}>My Results</Button>
                            </>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <User size={16} />
                        <span>{user.name} ({user.role})</span>
                    </div>
                    <Button variant="ghost" size="sm" onClick={handleLogout}>
                        <LogOut size={16} className="mr-2" />
                        Logout
                    </Button>
                </div>
            </div>
        </nav>
    );
}
