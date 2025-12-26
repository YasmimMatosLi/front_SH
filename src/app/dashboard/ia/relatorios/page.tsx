// src/app/dashboard/ia/relatorios/page.tsx
'use client';

import { DataTable } from '@/components/DataTable';
import { Header } from '@/components/Header';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';
import { useRelatoriosIA } from '@/hooks/useIA';
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {Papeis, RelatorioIA} from "@/types";
import {RequireRole} from "@/components/RequireRole";

const getTipoBadge = (tipo: string) => {
    const colors: Record<string, string> = {
        surto_j: 'bg-red-500',
        triagem_unidade: 'bg-green-500',
        recorrente: 'bg-blue-500',
    };
    return <Badge className={`${colors[tipo] || 'bg-gray-500'} text-white`}>{tipo.replace('_', ' ')}</Badge>;
};

export default function RelatoriosIAPage() {
    const { data: relatorios, isLoading } = useRelatoriosIA();

    const columns = [
        {
            header: 'Tipo',
            accessor: (item: RelatorioIA) => getTipoBadge(item.tipo),
        },
        {
            header: 'Gerado em',
            accessor: (item: RelatorioIA) => formatDate(item.criado_em),
        },
        {
            header: 'Ações',
            accessor: (item: RelatorioIA) => (
                <Button variant="outline" size="sm" asChild>
                    <Link href={`/dashboard/ia/relatorios/${item.id}`}>Ver Detalhes</Link>
                </Button>
            ),
        },
    ];

    return (
        <RequireRole allowedRoles={[Papeis.ADMINISTRADOR_PRINCIPAL, Papeis.MEDICO, Papeis.ENFERMEIRO]}>
        <div className="space-y-8">
            <Header title="Relatórios IA" description="Histórico completo de análises geradas" />

            <DataTable
                data={relatorios}
                columns={columns}
                isLoading={isLoading}
                caption={`Total: ${relatorios?.length || 0} relatórios`}
            />
        </div>
        </RequireRole>
    );
}