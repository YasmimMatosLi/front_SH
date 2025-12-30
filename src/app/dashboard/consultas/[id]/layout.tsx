import type { Metadata } from 'next';
import {ReactNode} from "react";

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: `Consulta - Hospital IA`,
    };
}

export default function ConsultaLayout({ children }: { children: ReactNode }) {
    return <>{children}</>;
}