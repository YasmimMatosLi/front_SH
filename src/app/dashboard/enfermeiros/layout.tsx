import type { Metadata } from 'next';
import {ReactNode} from "react";

export const metadata: Metadata = {
    title: 'Enfermeiros - Hospital IA',
    description: 'Gerencie todos os enfermeiros do sistema',
};

export default function EnfermeirosLayout({ children }: { children: ReactNode }) {
    return <>{children}</>;
}