// src/app/dashboard/medicos/page.tsx
'use client';

import {DataTable} from '@/components/DataTable';
import {Header} from '@/components/Header';
import {Button} from '@/components/ui/button';
import {Edit, Eye, Trash2} from 'lucide-react';
import Link from 'next/link';
import {useDeleteMedico, useMedicos} from '@/hooks/useMedico';
import {toast} from 'sonner';
import {Medico, Papeis} from '@/types';
import {RequireRole} from "@/components/RequireRole";

export default function MedicosPage() {
    const { data: medicos, isLoading } = useMedicos();
    const deleteMedico = useDeleteMedico();

    const handleDelete = async (id: string, nome: string) => {
        if (!confirm(`Tem certeza que deseja desativar o médico ${nome}?`)) return;

        try {
            await deleteMedico.mutateAsync(id);
            toast.success('Médico desativado com sucesso!');
        } catch (error) {
            toast.error('Erro ao desativar médico' + error);
        }
    };

    const columns = [
        {
            header: 'Nome',
            accessor: 'nome' as keyof Medico,
        },
        {
            header: 'CRM',
            accessor: 'registroProfissional' as keyof Medico,
        },
        {
            header: 'Telefone',
            accessor: (item: Medico) => item.telefone,
        },
        {
            header: 'Ações',
            accessor: (item: Medico) => (
                <div className="flex gap-2">
                    <Link href={`/dashboard/medicos/${item.id}`}>
                        <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                        </Button>
                    </Link>
                    <Link href={`/dashboard/medicos/${item.id}/editar`}>
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
                title="Médicos"
                description="Gerencie todos os médicos cadastrados no sistema"
                actionLabel="Novo Médico"
                actionHref="/dashboard/medicos/criar"
            />

            <DataTable
                data={medicos}
                columns={columns}
                isLoading={isLoading}
                caption={`Total: ${medicos?.length || 0} médicos`}
            />
        </div>
        </RequireRole>
    );
}