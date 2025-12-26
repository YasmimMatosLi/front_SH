// src/app/dashboard/layout.tsx
'use client';

import { Sidebar } from '@/components/Sidebar';
import { useCurrentUser } from '@/hooks/useAuth';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';
import { redirect } from 'next/navigation';

export default function DashboardLayout({ children }: { children: ReactNode }) {
    const { data: user, isLoading } = useCurrentUser();
    const pathname = usePathname();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-50">
                <LoadingSpinner />
            </div>
        );
    }

    if (!user) {
        redirect('/login');
    }

    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar role={user.papel} currentPath={pathname} />
            <main className="flex-1 overflow-y-auto">
                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}