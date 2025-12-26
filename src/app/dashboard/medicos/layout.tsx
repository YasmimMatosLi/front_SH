import type { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
    title: 'Médicos - Hospital IA',
    description: 'Gerencie o cadastro e atuação dos médicos do sistema',
};

export default function MedicosLayout({ children }: { children: ReactNode }) {
    return <>{children}</>;
}
