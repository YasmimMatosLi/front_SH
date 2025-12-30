import type { Metadata } from 'next';
import {ReactNode} from "react";

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: `Enfermeiro - Hospital IA`,
    };
}

export default function EnfermeiroLayout({ children }: { children: ReactNode }) {
    return <>{children}</>;
}