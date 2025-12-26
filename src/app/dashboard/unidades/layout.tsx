import type { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
    title: 'Unidades - Hospital IA',
    description: 'Gerencie unidades hospitalares e clínicas',
};

export default function UnidadesLayout({ children }: { children: ReactNode }) {
    return <>{children}</>;
}
