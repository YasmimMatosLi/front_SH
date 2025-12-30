import type { Metadata } from 'next';
import {ReactNode} from "react";

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: `Paciente - Hospital IA`,
    };
}

export default function PacienteLayout({ children }: { children: ReactNode }) {
    return <>{children}</>;
}