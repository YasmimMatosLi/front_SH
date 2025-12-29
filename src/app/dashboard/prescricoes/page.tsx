// src/app/dashboard/prescricoes/page.tsx
'use client';

import { DataTable } from '@/components/DataTable';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Edit, Eye, FileDown } from 'lucide-react';
import Link from 'next/link';
import { usePrescricoes } from '@/hooks/usePrescricao';
import { formatDate } from '@/lib/utils';
import { Papeis, Prescricao } from '@/types';
import { RequireRole } from '@/components/RequireRole';
import { Skeleton } from '@/components/ui/skeleton';

export default function PrescricoesPage() {
    const { data: prescricoes, isLoading } = usePrescricoes();

    const columns = [
        {
            header: 'Paciente',
            accessor: 'paciente_nome' as keyof Prescricao,
            cell: (item: Prescricao) => (
                <div className="font-medium text-foreground">{item.paciente_nome}</div>
            ),
        },
        {
            header: 'Médico',
            accessor: 'medico_nome' as keyof Prescricao,
        },
        {
            header: 'Data de Criação',
            accessor: (item: Prescricao) => formatDate(item.data_criacao),
        },
        {
            header: 'Ações',
            accessor: (item: Prescricao) => (
                <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" asChild className="h-9 w-9 hover:bg-purple-100">
                        <Link href={`/dashboard/prescricoes/${item.id}/pdf`}>
                            <FileDown className="h-4 w-4 text-purple-600" />
                        </Link>
                    </Button>
                    <Link href={`/dashboard/prescricoes/${item.id}`}>
                        <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-blue-100">
                            <Eye className="h-4 w-4 text-blue-600" />
                        </Button>
                    </Link>
                    <Link href={`/dashboard/prescricoes/${item.id}/editar`}>
                        <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-green-100">
                            <Edit className="h-4 w-4 text-green-600" />
                        </Button>
                    </Link>
                </div>
            ),
        },
    ];

    const totalPrescricoes = prescricoes?.length || 0;

    return (
        <RequireRole allowedRoles={[Papeis.ADMINISTRADOR_PRINCIPAL, Papeis.MEDICO]}>
            <div className="space-y-10 pb-8">
                <Header
                    title="Prescrições"
                    description="Gerencie todas as prescrições médicas emitidas"
                    actionLabel="Nova Prescrição"
                    actionHref="/dashboard/prescricoes/criar"
                />

                {isLoading ? (
                    <div className="space-y-6">
                        <Skeleton className="h-12 w-full rounded-xl" />
                        <Skeleton className="h-96 w-full rounded-xl" />
                    </div>
                ) : (
                    <div className="rounded-2xl border bg-card shadow-xl overflow-hidden">
                        {/* Caption simples com contagem */}
                        <div className="border-b bg-muted/40 px-6 py-4">
                            <span className="text-lg font-semibold text-foreground">
                                Total: {totalPrescricoes} prescrição{totalPrescricoes !== 1 ? 's' : ''} emitida{totalPrescricoes !== 1 ? 's' : ''}
                            </span>
                        </div>

                        <DataTable
                            data={prescricoes}
                            columns={columns}
                            isLoading={isLoading}
                        />
                    </div>
                )}
            </div>
        </RequireRole>
    );
}