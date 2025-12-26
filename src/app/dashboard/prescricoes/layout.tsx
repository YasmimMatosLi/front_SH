import type { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
    title: 'Prescrições - Hospital IA',
    description: 'Gerencie prescrições médicas e tratamentos',
};

export default function PrescricoesLayout({ children }: { children: ReactNode }) {
    return <>{children}</>;
}
