// src/app/dashboard/prontuarios/page.tsx
'use client';

import { DataTable } from '@/components/DataTable';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { FileDown, Edit, Eye } from 'lucide-react';
import Link from 'next/link';
import { useProntuarios } from '@/hooks/useProntuario';
import { formatDate } from '@/lib/utils';
import { Papeis, Prontuario } from '@/types';
import { RequireRole } from '@/components/RequireRole';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProntuariosPage() {
    const { data: prontuarios, isLoading } = useProntuarios();

    const columns = [
        {
            header: 'Paciente',
            accessor: 'paciente_nome' as keyof Prontuario,
            cell: (item: Prontuario) => (
                <div className="font-medium text-foreground">{item.paciente_nome}</div>
            ),
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
            cell: (item: Prontuario) => (
                <span className="font-mono text-sm">{item.cid10 || '—'}</span>
            ),
        },
        {
            header: 'Ações',
            accessor: (item: Prontuario) => (
                <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" asChild className="h-9 w-9 hover:bg-purple-100">
                        <Link href={`/dashboard/prontuarios/${item.id}/pdf`}>
                            <FileDown className="h-4 w-4 text-purple-600" />
                        </Link>
                    </Button>
                    <Link href={`/dashboard/prontuarios/${item.id}`}>
                        <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-blue-100">
                            <Eye className="h-4 w-4 text-blue-600" />
                        </Button>
                    </Link>
                    <Link href={`/dashboard/prontuarios/${item.id}/editar`}>
                        <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-green-100">
                            <Edit className="h-4 w-4 text-green-600" />
                        </Button>
                    </Link>
                </div>
            ),
        },
    ];

    const totalProntuarios = prontuarios?.length || 0;

    return (
        <RequireRole allowedRoles={[Papeis.ADMINISTRADOR_PRINCIPAL, Papeis.MEDICO, Papeis.ENFERMEIRO]}>
            <div className="space-y-10 pb-8">
                <Header
                    title="Prontuários Clínicos"
                    description="Histórico completo de atendimentos e evoluções dos pacientes"
                    actionLabel="Novo Prontuário"
                    actionHref="/dashboard/prontuarios/criar"
                />

                {isLoading ? (
                    <div className="space-y-6">
                        <Skeleton className="h-12 w-full rounded-xl" />
                        <Skeleton className="h-96 w-full rounded-xl" />
                    </div>
                ) : (
                    <div className="rounded-2xl border bg-card shadow-xl overflow-hidden">
                        <div className="border-b bg-muted/40 px-6 py-4">
                            <span className="text-lg font-semibold text-foreground">
                                Total: {totalProntuarios} prontuário{totalProntuarios !== 1 ? 's' : ''} registrado{totalProntuarios !== 1 ? 's' : ''}
                            </span>
                        </div>

                        <DataTable
                            data={prontuarios}
                            columns={columns}
                            isLoading={isLoading}
                        />
                    </div>
                )}
            </div>
        </RequireRole>
    );
}