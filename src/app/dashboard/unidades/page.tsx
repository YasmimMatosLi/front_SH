// src/app/dashboard/unidades/page.tsx
'use client';

import { DataTable } from '@/components/DataTable';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Eye, Trash2, Building2 } from 'lucide-react';
import Link from 'next/link';
import { useUnidadesSaude, useDeleteUnidade } from '@/hooks/useUnidadeSaude';
import { toast } from 'sonner';
import { Papeis, UnidadeSaude } from '@/types';
import { RequireRole } from '@/components/RequireRole';
import { Skeleton } from '@/components/ui/skeleton';

export default function UnidadesPage() {
    const { data: unidades, isLoading } = useUnidadesSaude();
    const deleteUnidade = useDeleteUnidade();

    const handleDelete = async (id: string, nome: string) => {
        if (!confirm(`Tem certeza que deseja remover a unidade ${nome}?`)) return;

        try {
            await deleteUnidade.mutateAsync(id);
            toast.success('Unidade removida com sucesso!');
        } catch (error) {
            toast.error('Erro ao remover unidade');
        }
    };

    const columns = [
        {
            header: 'Nome',
            accessor: 'nome' as keyof UnidadeSaude,
            cell: (item: UnidadeSaude) => (
                <div className="font-medium text-foreground">{item.nome}</div>
            ),
        },
        {
            header: 'Tipo',
            accessor: (item: UnidadeSaude) => (
                <Badge variant="secondary" className="font-medium">
                    {item.tipo}
                </Badge>
            ),
        },
        {
            header: 'CNES',
            accessor: 'cnes' as keyof UnidadeSaude,
            cell: (item: UnidadeSaude) => (
                <span className="font-mono text-sm">{item.cnes}</span>
            ),
        },
        {
            header: 'Cidade/UF',
            accessor: (item: UnidadeSaude) => (
                <div className="text-sm">
                    <div className="font-medium">{item.endereco.cidade}</div>
                    <div className="text-muted-foreground">{item.endereco.estado}</div>
                </div>
            ),
        },
        {
            header: 'Telefone',
            accessor: 'telefone' as keyof UnidadeSaude,
        },
        {
            header: 'Ações',
            accessor: (item: UnidadeSaude) => (
                <div className="flex items-center gap-1">
                    <Link href={`/dashboard/unidades/${item.id}`}>
                        <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-blue-100">
                            <Eye className="h-4 w-4 text-blue-600" />
                        </Button>
                    </Link>
                    <Link href={`/dashboard/unidades/${item.id}/editar`}>
                        <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-green-100">
                            <Edit className="h-4 w-4 text-green-600" />
                        </Button>
                    </Link>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(item.id, item.nome)}
                        className="h-9 w-9 hover:bg-red-100"
                    >
                        <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                </div>
            ),
        },
    ];

    const totalUnidades = unidades?.length || 0;

    return (
        <RequireRole allowedRoles={[Papeis.ADMINISTRADOR_PRINCIPAL]}>
            <div className="space-y-10 pb-8">
                <Header
                    title="Unidades de Saúde"
                    description="Gerencie todas as unidades cadastradas no sistema"
                    actionLabel="Nova Unidade"
                    actionHref="/dashboard/unidades/criar"
                />

                {isLoading ? (
                    <div className="space-y-6">
                        <Skeleton className="h-12 w-full rounded-xl" />
                        <Skeleton className="h-96 w-full rounded-xl" />
                    </div>
                ) : (
                    <div className="rounded-2xl border bg-card shadow-xl overflow-hidden">
                        {/* Caption personalizado acima da tabela */}
                        <div className="border-b bg-muted/40 px-6 py-4">
                            <div className="flex items-center gap-3">
                                <Building2 className="h-6 w-6 text-teal-600" />
                                <span className="text-lg font-semibold text-foreground">
                                    Total: {totalUnidades} unidade{totalUnidades !== 1 ? 's' : ''} cadastrada{totalUnidades !== 1 ? 's' : ''}
                                </span>
                            </div>
                        </div>

                        <DataTable
                            data={unidades}
                            columns={columns}
                            isLoading={isLoading}
                        />
                    </div>
                )}
            </div>
        </RequireRole>
    );
}