import type { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
    title: 'Prontuários - Hospital IA',
    description: 'Acompanhe e gerencie os prontuários clínicos dos pacientes',
};

export default function ProntuariosLayout({ children }: { children: ReactNode }) {
    return <>{children}</>;
}
