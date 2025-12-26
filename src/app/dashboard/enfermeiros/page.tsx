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
import {Enfermeiro, Papeis} from '@/types';
import {RequireRole} from "@/components/RequireRole";

export default function EnfermeirosPage() {
    const { data: enfermeiros, isLoading } = useEnfermeiros();
    const deleteEnfermeiro = useDeleteEnfermeiro();

    const handleDelete = async (id: string, nome: string) => {
        if (!confirm(`Tem certeza que deseja desativar o enfermeiro ${nome}?`)) return;

        try {
            await deleteEnfermeiro.mutateAsync(id);
            toast.success('Enfermeiro desativado com sucesso!');
        } catch (error) {
            toast.error('Erro ao desativar enfermeiro' + error);
        }
    };

    const columns = [
        {
            header: 'Nome',
            accessor: 'nome' as keyof Enfermeiro,
        },
        {
            header: 'COREN',
            accessor: 'registroProfissional' as keyof Enfermeiro,
        },
        {
            header: 'CPF',
            accessor: (item: Enfermeiro) => formatCPF(item.cpf),
        },
        {
            header: 'Telefone',
            accessor: (item: Enfermeiro) => formatTelefone(item.telefone),
        },
        {
            header: 'Ações',
            accessor: (item: Enfermeiro) => (
                <div className="flex gap-2">
                    <Link href={`/dashboard/enfermeiros/${item.id}`}>
                        <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                        </Button>
                    </Link>
                    <Link href={`/dashboard/enfermeiros/${item.id}/editar`}>
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
                title="Enfermeiros"
                description="Gerencie todos os enfermeiros cadastrados no sistema"
                actionLabel="Novo Enfermeiro"
                actionHref="/dashboard/enfermeiros/criar"
            />

            <DataTable
                data={enfermeiros}
                columns={columns}
                isLoading={isLoading}
                caption={`Total: ${enfermeiros?.length || 0} enfermeiros`}
            />
        </div>
        </RequireRole>
    );
}