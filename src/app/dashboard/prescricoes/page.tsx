// src/app/dashboard/prescricoes/page.tsx
'use client';

import {DataTable} from '@/components/DataTable';
import {Header} from '@/components/Header';
import {Button} from '@/components/ui/button';
import {Edit, Eye, FileDown} from 'lucide-react';
import Link from 'next/link';
import {usePrescricoes} from '@/hooks/usePrescricao';
import {formatDate} from '@/lib/utils';
import {Papeis, Prescricao} from '@/types';
import {RequireRole} from "@/components/RequireRole";

export default function PrescricoesPage() {
    const { data: prescricoes, isLoading } = usePrescricoes();

    const columns = [
        {
            header: 'Paciente',
            accessor: 'paciente_nome' as keyof Prescricao,
        },
        {
            header: 'Médico',
            accessor: 'medico_nome' as keyof Prescricao,
        },
        {
            header: 'Data',
            accessor: (item: Prescricao) => formatDate(item.data_criacao),
        },
        {
            header: 'Ações',
            accessor: (item: Prescricao) => (
                <div className="flex gap-2">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href={`/dashboard/prescricoes/${item.id}/pdf`}>
                            <FileDown className="h-4 w-4" />
                        </Link>
                    </Button>
                    <Link href={`/dashboard/prescricoes/${item.id}`}>
                        <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                        </Button>
                    </Link>
                    <Link href={`/dashboard/prescricoes/${item.id}/editar`}>
                        <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                        </Button>
                    </Link>
                </div>
            ),
        },
    ];

    return (
        <RequireRole allowedRoles={[Papeis.ADMINISTRADOR_PRINCIPAL, Papeis.MEDICO]}>
        <div className="space-y-8">
            <Header
                title="Prescrições"
                description="Gerencie todas as prescrições médicas emitidas"
                actionLabel="Nova Prescrição"
                actionHref="/dashboard/prescricoes/criar"
            />

            <DataTable
                data={prescricoes}
                columns={columns}
                isLoading={isLoading}
                caption={`Total: ${prescricoes?.length || 0} prescrições`}
            />
        </div>
        </RequireRole>
    );
}