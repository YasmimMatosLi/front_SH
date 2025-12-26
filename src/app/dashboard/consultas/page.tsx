// src/app/dashboard/consultas/page.tsx
'use client';

import { DataTable } from '@/components/DataTable';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Edit, Eye } from 'lucide-react';
import Link from 'next/link';
import { useConsultas } from '@/hooks/useConsulta';
import { formatDate } from '@/lib/utils';
import {Consulta, Papeis} from '@/types';
import {RequireRole} from "@/components/RequireRole";

export default function ConsultasPage() {
    const { data: consultas, isLoading } = useConsultas();

    const columns = [
        {
            header: 'Paciente',
            accessor: 'paciente_nome' as keyof Consulta,
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
        },
        {
            header: 'Observações',
            accessor: (item: Consulta) => (
                <span className="line-clamp-2">{item.observacoes}</span>
            ),
        },
        {
            header: 'Ações',
            accessor: (item: Consulta) => (
                <div className="flex gap-2">
                    <Link href={`/dashboard/consultas/${item.id}`}>
                        <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                        </Button>
                    </Link>
                    <Link href={`/dashboard/consultas/${item.id}/editar`}>
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
                title="Consultas"
                description="Gerencie todas as consultas realizadas no sistema"
                actionLabel="Nova Consulta"
                actionHref="/dashboard/consultas/criar"
            />

            <DataTable
                data={consultas}
                columns={columns}
                isLoading={isLoading}
                caption={`Total: ${consultas?.length || 0} consultas`}
            />
        </div>
        </RequireRole>
    );
}