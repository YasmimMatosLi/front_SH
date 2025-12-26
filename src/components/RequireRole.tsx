'use client';

import { useCurrentUser } from '@/hooks/useAuth';
import { Papeis } from '@/types';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ReactNode } from 'react';
import { redirect } from 'next/navigation';

interface RequireRoleProps {
    children: ReactNode;
    allowedRoles: Papeis[];
}

export function RequireRole({ children, allowedRoles }: RequireRoleProps) {
    const { data: user, isLoading } = useCurrentUser();

    if (isLoading) return <LoadingSpinner />;

    if (!user || !allowedRoles.includes(user.papel)) {
        redirect('/dashboard');
    }

    return <>{children}</>;
}