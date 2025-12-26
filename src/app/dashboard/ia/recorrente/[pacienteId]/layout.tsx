// src/app/dashboard/ia/recorrente/[pacienteId]/layout.tsx
import type { Metadata } from 'next';
import {ReactNode} from "react";

type Props = {
    params: { pacienteId: string };
};

export async function generateMetadata(
    { params }: Props,
): Promise<Metadata> {
    return {
        title: `Análise Recorrente - Paciente ${params.pacienteId}`,
        description: 'Análise de recorrência do paciente',
    };
}

export default function RecorrenteLayout({ children }: { children: ReactNode }) {
    return <>{children}</>;
}