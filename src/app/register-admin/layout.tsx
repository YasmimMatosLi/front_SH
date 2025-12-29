import type { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
    title: 'Criar Administrador - Hospital IA',
    description: 'Crie o primeiro administrador do sistema',
};

export default function AdminLayout({ children }: { children: ReactNode }) {
    return <>{children}</>;
}
