// src/app/dashboard/triagens/page.tsx
'use client';

import {DataTable} from '@/components/DataTable';
import {Header} from '@/components/Header';
import {Button} from '@/components/ui/button';
import {Badge} from '@/components/ui/badge';
import {Edit, Eye} from 'lucide-react';
import Link from 'next/link';
import {useTriagens} from '@/hooks/useTriagem';
import {formatDate} from '@/lib/utils';
import {Papeis, Triagem} from '@/types';
import {RequireRole} from "@/components/RequireRole";

const getRiscoBadge = (risco: string) => {
    const variants: Record<string, 'destructive' | 'default' | 'secondary' | 'outline'> = {
        VERMELHO: 'destructive',
        LARANJA: 'default',
        AMARELO: 'secondary',
        VERDE: 'outline',
        AZUL: 'outline',
    };
    return <Badge variant={variants[risco] || 'outline'}>{risco}</Badge>;
};

export default function TriagensPage() {
    const { data: triagens, isLoading } = useTriagens();

    const columns = [
        {
            header: 'Paciente',
            accessor: 'paciente_nome' as keyof Triagem,
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
            header: 'Classificação',
            accessor: (item: Triagem) => getRiscoBadge(item.nivel_gravidade),
        },
        {
            header: 'Queixa Principal',
            accessor: (item: Triagem) => (
                <span className="line-clamp-2">{item.queixa_principal}</span>
            ),
        },
        {
            header: 'Ações',
            accessor: (item: Triagem) => (
                <div className="flex gap-2">
                    <Link href={`/dashboard/triagens/${item.id}`}>
                        <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                        </Button>
                    </Link>
                    <Link href={`/dashboard/triagens/${item.id}/editar`}>
                        <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                        </Button>
                    </Link>
                </div>
            ),
        },
    ];

    return (
        <RequireRole allowedRoles={[Papeis.ADMINISTRADOR_PRINCIPAL, Papeis.ENFERMEIRO, Papeis.MEDICO]}>
        <div className="space-y-8">
            <Header
                title="Triagens"
                description="Gerencie todas as triagens realizadas no sistema"
                actionLabel="Nova Triagem"
                actionHref="/dashboard/triagens/criar"
            />

            <DataTable
                data={triagens}
                columns={columns}
                isLoading={isLoading}
                caption={`Total: ${triagens?.length || 0} triagens`}
            />
        </div>
        </RequireRole>
    );
}