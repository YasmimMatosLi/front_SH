// src/components/ClientPathname.tsx
'use client';

import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

interface ClientPathnameProps {
    children: (pathname: string) => ReactNode;
}

export function ClientPathname({ children }: ClientPathnameProps) {
    const pathname = usePathname();
    return <>{children(pathname)}</>;
}