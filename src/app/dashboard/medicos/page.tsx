// src/app/dashboard/medicos/page.tsx
'use client';

import { DataTable } from '@/components/DataTable';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Edit, Eye, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useDeleteMedico, useMedicos } from '@/hooks/useMedico';
import { toast } from 'sonner';
import { Medico, Papeis } from '@/types';
import { RequireRole } from '@/components/RequireRole';
import { Skeleton } from '@/components/ui/skeleton';

export default function MedicosPage() {
    const { data: medicos, isLoading } = useMedicos();
    const deleteMedico = useDeleteMedico();

    const handleDelete = async (id: string, nome: string) => {
        if (!confirm(`Tem certeza que deseja desativar o médico ${nome}?`)) return;

        try {
            await deleteMedico.mutateAsync(id);
            toast.success('Médico desativado com sucesso!');
        } catch (error) {
            toast.error('Erro ao desativar médico');
        }
    };

    const columns = [
        {
            header: 'Nome',
            accessor: 'nome' as keyof Medico,
            cell: (item: Medico) => (
                <div className="font-medium text-foreground">{item.nome}</div>
            ),
        },
        {
            header: 'CRM',
            accessor: 'registroProfissional' as keyof Medico,
            cell: (item: Medico) => (
                <span className="font-mono text-sm">{item.registroProfissional}</span>
            ),
        },
        {
            header: 'Telefone',
            accessor: (item: Medico) => item.telefone,
        },
        {
            header: 'Ações',
            accessor: (item: Medico) => (
                <div className="flex items-center gap-1">
                    <Link href={`/dashboard/medicos/${item.id}`}>
                        <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-blue-100">
                            <Eye className="h-4 w-4 text-blue-600" />
                        </Button>
                    </Link>
                    <Link href={`/dashboard/medicos/${item.id}/editar`}>
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

    const totalMedicos = medicos?.length || 0;

    return (
        <RequireRole allowedRoles={[Papeis.ADMINISTRADOR_PRINCIPAL]}>
            <div className="space-y-10 pb-8">
                <Header
                    title="Médicos"
                    description="Gerencie todos os médicos cadastrados no sistema"
                    actionLabel="Novo Médico"
                    actionHref="/dashboard/medicos/criar"
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
                                Total: {totalMedicos} médico{totalMedicos !== 1 ? 's' : ''} cadastrado{totalMedicos !== 1 ? 's' : ''}
                            </span>
                        </div>

                        <DataTable
                            data={medicos}
                            columns={columns}
                            isLoading={isLoading}
                        />
                    </div>
                )}
            </div>
        </RequireRole>
    );
}