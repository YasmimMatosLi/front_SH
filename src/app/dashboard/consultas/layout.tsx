import type { Metadata } from 'next';
import {ReactNode} from "react";

export const metadata: Metadata = {
    title: 'Consultas - Hospital IA',
    description: 'Gerencie todas as consultas do sistema',
};

export default function ConsultasLayout({ children }: { children: ReactNode }) {
    return <>{children}</>;
}