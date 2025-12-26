import type { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
    title: 'Pacientes - Hospital IA',
    description: 'Gerencie os dados e histórico dos pacientes',
};

export default function PacientesLayout({ children }: { children: ReactNode }) {
    return <>{children}</>;
}
