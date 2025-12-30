import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: `Médico - Hospital IA`,
        description: `Gerencie os dados dos médicos`,
    };
}

export default function MedicoLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}