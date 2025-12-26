// src/app/dashboard/unidades/page.tsx
'use client';

import { DataTable } from '@/components/DataTable';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Eye, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useUnidadesSaude, useDeleteUnidade } from '@/hooks/useUnidadeSaude';
import { toast } from 'sonner';
import {Papeis, UnidadeSaude} from '@/types';
import { RequireRole } from "@/components/RequireRole";

export default function UnidadesPage() {
    const { data: unidades, isLoading } = useUnidadesSaude();
    const deleteUnidade = useDeleteUnidade();

    const handleDelete = async (id: string, nome: string) => {
        if (!confirm(`Tem certeza que deseja remover a unidade ${nome}?`)) return;

        try {
            await deleteUnidade.mutateAsync(id);
            toast.success('Unidade removida com sucesso!');
        } catch (error) {
            toast.error('Erro ao remover unidade' + error);
        }
    };

    const columns = [
        {
            header: 'Nome',
            accessor: 'nome' as keyof UnidadeSaude,
        },
        {
            header: 'Tipo',
            accessor: (item: UnidadeSaude) => (
                <Badge variant="outline">{item.tipo}</Badge>
            ),
        },
        {
            header: 'CNES',
            accessor: 'cnes' as keyof UnidadeSaude,
        },
        {
            header: 'Cidade',
            accessor: (item: UnidadeSaude) => `${item.endereco.cidade}/${item.endereco.estado}`,
        },
        {
            header: 'Telefone',
            accessor: 'telefone' as keyof UnidadeSaude,
        },
        {
            header: 'Ações',
            accessor: (item: UnidadeSaude) => (
                <div className="flex gap-2">
                    <Link href={`/dashboard/unidades/${item.id}`}>
                        <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                        </Button>
                    </Link>
                    <Link href={`/dashboard/unidades/${item.id}/editar`}>
                        <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                        </Button>
                    </Link>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(item.id, item.nome)}
                        className="text-red-600 hover:text-red-700"
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <RequireRole allowedRoles={[Papeis.ADMINISTRADOR_PRINCIPAL]}>
        <div className="space-y-8">
            <Header
                title="Unidades de Saúde"
                description="Gerencie todas as unidades cadastradas no sistema"
                actionLabel="Nova Unidade"
                actionHref="/dashboard/unidades/criar"
            />

            <DataTable
                data={unidades}
                columns={columns}
                isLoading={isLoading}
                caption={`Total: ${unidades?.length || 0} unidades`}
            />
        </div>
        </RequireRole>
    );
}