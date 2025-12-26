import type { Metadata } from 'next';
import {ReactNode} from "react";

type Props = {
    params: { id: string };
};

export async function generateMetadata(
    { params }: Props,
): Promise<Metadata> {
    return {
        title: `Paciente #${params.id} - Hospital IA`,
    };
}

export default function PacienteLayout({ children }: { children: ReactNode }) {
    return <>{children}</>;
}