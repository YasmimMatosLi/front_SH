// src/app/dashboard/consultas/page.tsx
'use client';

import { DataTable } from '@/components/DataTable';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Edit, Eye } from 'lucide-react';
import Link from 'next/link';
import { useConsultas } from '@/hooks/useConsulta';
import { formatDate } from '@/lib/utils';
import { Consulta, Papeis } from '@/types';
import { RequireRole } from '@/components/RequireRole';
import { Skeleton } from '@/components/ui/skeleton';

export default function ConsultasPage() {
    const { data: consultas, isLoading } = useConsultas();

    const columns = [
        {
            header: 'Paciente',
            accessor: 'paciente_nome' as keyof Consulta,
            cell: (item: Consulta) => (
                <div className="font-medium text-foreground">{item.paciente_nome}</div>
            ),
        },
        {
            header: 'Médico',
            accessor: 'medico_nome' as keyof Consulta,
        },
        {
            header: 'Data da Consulta',
            accessor: (item: Consulta) => formatDate(item.data_consulta as string),
        },
        {
            header: 'CID-10',
            accessor: 'cid10' as keyof Consulta,
            cell: (item: Consulta) => (
                <span className="font-mono text-sm">{item.cid10 || '—'}</span>
            ),
        },
        {
            header: 'Observações',
            accessor: (item: Consulta) => (
                <span className="line-clamp-2 max-w-md">{item.observacoes || '—'}</span>
            ),
        },
        {
            header: 'Ações',
            accessor: (item: Consulta) => (
                <div className="flex items-center gap-1">
                    <Link href={`/dashboard/consultas/${item.id}`}>
                        <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-blue-100">
                            <Eye className="h-4 w-4 text-blue-600" />
                        </Button>
                    </Link>
                    <Link href={`/dashboard/consultas/${item.id}/editar`}>
                        <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-green-100">
                            <Edit className="h-4 w-4 text-green-600" />
                        </Button>
                    </Link>
                </div>
            ),
        },
    ];

    const totalConsultas = consultas?.length || 0;

    return (
        <RequireRole allowedRoles={[Papeis.ADMINISTRADOR_PRINCIPAL, Papeis.MEDICO]}>
            <div className="space-y-10 pb-8">
                <Header
                    title="Consultas"
                    description="Gerencie todas as consultas realizadas no sistema"
                    actionLabel="Nova Consulta"
                    actionHref="/dashboard/consultas/criar"
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
                                Total: {totalConsultas} consulta{totalConsultas !== 1 ? 's' : ''} registrada{totalConsultas !== 1 ? 's' : ''}
                            </span>
                        </div>

                        <DataTable
                            data={consultas}
                            columns={columns}
                            isLoading={isLoading}
                        />
                    </div>
                )}
            </div>
        </RequireRole>
    );
}