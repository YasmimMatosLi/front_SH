import type { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
    title: 'Triagens - Hospital IA',
    description: 'Gerencie triagens e classificações de risco',
};

export default function TriagensLayout({ children }: { children: ReactNode }) {
    return <>{children}</>;
}
