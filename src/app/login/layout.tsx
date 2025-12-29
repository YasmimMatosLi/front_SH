import type { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
    title: 'Login - Hospital IA',
    description: 'Acesse o sistema inteligente de gestão hospitalar',
};

export default function LoginLayout({ children }: { children: ReactNode }) {
    return <>{children}</>;
}
