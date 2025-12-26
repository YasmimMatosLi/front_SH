import type { Metadata } from 'next';
import {ReactNode} from "react";

export const metadata: Metadata = {
    title: 'Relatórios IA - Hospital IA',
    description: 'Histórico de relatórios gerados pela inteligência artificial',
};

export default function realtoriosIALayout({ children }: { children: ReactNode }) {
    return <>{children}</>;
}