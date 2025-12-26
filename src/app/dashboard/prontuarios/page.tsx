// src/app/dashboard/prontuarios/page.tsx
'use client';

import { DataTable } from '@/components/DataTable';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { FileDown, Edit, Eye } from 'lucide-react';
import Link from 'next/link';
import { useProntuarios } from '@/hooks/useProntuario';
import { formatDate } from '@/lib/utils';
import {Papeis, Prontuario} from '@/types';
import { RequireRole } from "@/components/RequireRole";

export default function ProntuariosPage() {
    const { data: prontuarios, isLoading } = useProntuarios();

    const columns = [
        {
            header: 'Paciente',
            accessor: 'paciente_nome' as keyof Prontuario,
        },
        {
            header: 'Profissional',
            accessor: 'profissional_nome' as keyof Prontuario,
        },
        {
            header: 'Data',
            accessor: (item: Prontuario) => formatDate(item.data),
        },
        {
            header: 'CID-10',
            accessor: 'cid10' as keyof Prontuario,
        },
        {
            header: 'Ações',
            accessor: (item: Prontuario) => (
                <div className="flex gap-2">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href={`/dashboard/prontuarios/${item.id}/pdf`}>
                            <FileDown className="h-4 w-4" />
                        </Link>
                    </Button>
                    <Link href={`/dashboard/prontuarios/${item.id}`}>
                        <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                        </Button>
                    </Link>
                    <Link href={`/dashboard/prontuarios/${item.id}/editar`}>
                        <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                        </Button>
                    </Link>
                </div>
            ),
        },
    ];

    return (
        <RequireRole allowedRoles={[Papeis.ADMINISTRADOR_PRINCIPAL, Papeis.MEDICO, Papeis.ENFERMEIRO]}>
        <div className="space-y-8">
            <Header
                title="Prontuários Clínicos"
                description="Histórico completo de atendimentos e evoluções dos pacientes"
                actionLabel="Novo Prontuário"
                actionHref="/dashboard/prontuarios/criar"
            />

            <DataTable
                data={prontuarios}
                columns={columns}
                isLoading={isLoading}
                caption={`Total: ${prontuarios?.length || 0} registros`}
            />
        </div>
        </RequireRole>
    );
}