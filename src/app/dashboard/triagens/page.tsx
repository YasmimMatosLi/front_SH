// src/app/dashboard/triagens/page.tsx
'use client';

import { DataTable } from '@/components/DataTable';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Eye, Activity } from 'lucide-react';
import Link from 'next/link';
import { useTriagens } from '@/hooks/useTriagem';
import { formatDate } from '@/lib/utils';
import { Papeis, Triagem } from '@/types';
import { RequireRole } from '@/components/RequireRole';
import { Skeleton } from '@/components/ui/skeleton';

const getRiscoBadge = (risco: string) => {
    const variants: Record<string, string> = {
        VERMELHO: 'bg-red-600 text-white hover:bg-red-700',
        LARANJA: 'bg-orange-500 text-white hover:bg-orange-600',
        AMARELO: 'bg-yellow-500 text-white hover:bg-yellow-600',
        VERDE: 'bg-green-600 text-white hover:bg-green-700',
        AZUL: 'bg-blue-600 text-white hover:bg-blue-700',
    };
    return (
        <Badge className={`font-semibold px-4 py-1 text-sm ${variants[risco] || 'bg-gray-500 text-white'}`}>
            {risco}
        </Badge>
    );
};

export default function TriagensPage() {
    const { data: triagens, isLoading } = useTriagens();

    const columns = [
        {
            header: 'Paciente',
            accessor: 'paciente_nome' as keyof Triagem,
            cell: (item: Triagem) => (
                <div className="font-medium text-foreground">{item.paciente_nome}</div>
            ),
        },
        {
            header: 'Enfermeiro',
            accessor: 'enfermeiro_nome' as keyof Triagem,
        },
        {
            header: 'Data/Hora',
            accessor: (item: Triagem) => formatDate(item.data_triagem),
        },
        {
            header: 'Classificação de Risco',
            accessor: (item: Triagem) => getRiscoBadge(item.nivel_gravidade),
        },
        {
            header: 'Queixa Principal',
            accessor: (item: Triagem) => (
                <span className="line-clamp-2 max-w-md">{item.queixa_principal}</span>
            ),
        },
        {
            header: 'Ações',
            accessor: (item: Triagem) => (
                <div className="flex items-center gap-1">
                    <Link href={`/dashboard/triagens/${item.id}`}>
                        <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-blue-100">
                            <Eye className="h-4 w-4 text-blue-600" />
                        </Button>
                    </Link>
                    <Link href={`/dashboard/triagens/${item.id}/editar`}>
                        <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-green-100">
                            <Edit className="h-4 w-4 text-green-600" />
                        </Button>
                    </Link>
                </div>
            ),
        },
    ];

    const totalTriagens = triagens?.length || 0;

    return (
        <RequireRole allowedRoles={[Papeis.ADMINISTRADOR_PRINCIPAL, Papeis.ENFERMEIRO, Papeis.MEDICO]}>
            <div className="space-y-10 pb-8">
                <Header
                    title="Triagens"
                    description="Gerencie todas as triagens realizadas no sistema"
                    actionLabel="Nova Triagem"
                    actionHref="/dashboard/triagens/criar"
                />

                {isLoading ? (
                    <div className="space-y-6">
                        <Skeleton className="h-12 w-full rounded-xl" />
                        <Skeleton className="h-96 w-full rounded-xl" />
                    </div>
                ) : (
                    <div className="rounded-2xl border bg-card shadow-xl overflow-hidden">
                        <div className="border-b bg-muted/40 px-6 py-4">
                            <div className="flex items-center gap-3">
                                <Activity className="h-6 w-6 text-orange-600" />
                                <span className="text-lg font-semibold text-foreground">
                                    Total: {totalTriagens} triagem{totalTriagens !== 1 ? 's' : ''} registrada{totalTriagens !== 1 ? 's' : ''}
                                </span>
                            </div>
                        </div>

                        <DataTable
                            data={triagens}
                            columns={columns}
                            isLoading={isLoading}
                        />
                    </div>
                )}
            </div>
        </RequireRole>
    );
}