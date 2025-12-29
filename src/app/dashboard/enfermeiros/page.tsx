// src/app/dashboard/enfermeiros/page.tsx
'use client';

import { DataTable } from '@/components/DataTable';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Edit, Eye, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useEnfermeiros, useDeleteEnfermeiro } from '@/hooks/useEnfermeiro';
import { toast } from 'sonner';
import { formatCPF, formatTelefone } from '@/lib/utils';
import { Enfermeiro, Papeis } from '@/types';
import { RequireRole } from '@/components/RequireRole';
import { Skeleton } from '@/components/ui/skeleton';

export default function EnfermeirosPage() {
    const { data: enfermeiros, isLoading } = useEnfermeiros();
    const deleteEnfermeiro = useDeleteEnfermeiro();

    const handleDelete = async (id: string, nome: string) => {
        if (!confirm(`Tem certeza que deseja desativar o enfermeiro ${nome}?`)) return;

        try {
            await deleteEnfermeiro.mutateAsync(id);
            toast.success('Enfermeiro desativado com sucesso!');
        } catch (error) {
            toast.error('Erro ao desativar enfermeiro');
        }
    };

    const columns = [
        {
            header: 'Nome',
            accessor: 'nome' as keyof Enfermeiro,
            cell: (item: Enfermeiro) => (
                <div className="font-medium text-foreground">{item.nome}</div>
            ),
        },
        {
            header: 'COREN',
            accessor: 'registroProfissional' as keyof Enfermeiro,
            cell: (item: Enfermeiro) => (
                <span className="font-mono text-sm">{item.registroProfissional}</span>
            ),
        },
        {
            header: 'CPF',
            accessor: (item: Enfermeiro) => formatCPF(item.cpf),
            cell: (item: Enfermeiro) => (
                <span className="font-mono text-sm">{formatCPF(item.cpf)}</span>
            ),
        },
        {
            header: 'Telefone',
            accessor: (item: Enfermeiro) => formatTelefone(item.telefone),
        },
        {
            header: 'Ações',
            accessor: (item: Enfermeiro) => (
                <div className="flex items-center gap-1">
                    <Link href={`/dashboard/enfermeiros/${item.id}`}>
                        <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-blue-100">
                            <Eye className="h-4 w-4 text-blue-600" />
                        </Button>
                    </Link>
                    <Link href={`/dashboard/enfermeiros/${item.id}/editar`}>
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

    const totalEnfermeiros = enfermeiros?.length || 0;

    return (
        <RequireRole allowedRoles={[Papeis.ADMINISTRADOR_PRINCIPAL]}>
            <div className="space-y-10 pb-8">
                <Header
                    title="Enfermeiros"
                    description="Gerencie todos os enfermeiros cadastrados no sistema"
                    actionLabel="Novo Enfermeiro"
                    actionHref="/dashboard/enfermeiros/criar"
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
                                Total: {totalEnfermeiros} enfermeiro{totalEnfermeiros !== 1 ? 's' : ''} cadastrado{totalEnfermeiros !== 1 ? 's' : ''}
                            </span>
                        </div>

                        <DataTable
                            data={enfermeiros}
                            columns={columns}
                            isLoading={isLoading}
                        />
                    </div>
                )}
            </div>
        </RequireRole>
    );
}