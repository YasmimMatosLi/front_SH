// src/components/ClientOnly.tsx
'use client';

import { ReactNode } from 'react';

export function ClientOnly({ children }: { children: ReactNode }) {
    return <>{children}</>;
}