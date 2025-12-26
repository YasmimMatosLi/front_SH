// src/app/dashboard/pacientes/page.tsx
'use client';

import { DataTable } from '@/components/DataTable';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Eye, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { usePacientes, useDeletePaciente } from '@/hooks/usePaciente';
import { toast } from 'sonner';
import { formatCPF, formatTelefone } from '@/lib/utils';
import {Paciente, Papeis} from '@/types';
import {RequireRole} from "@/components/RequireRole";

export default function PacientesPage() {
    const { data: pacientes, isLoading } = usePacientes();
    const deletePaciente = useDeletePaciente();

    const handleDelete = async (id: string, nome: string) => {
        if (!confirm(`Tem certeza que deseja desativar o paciente ${nome}?`)) return;

        try {
            await deletePaciente.mutateAsync(id);
            toast.success('Paciente desativado com sucesso!');
        } catch (error) {
            toast.error('Erro ao desativar paciente: ' + error);
        }
    };

    const columns = [
        {
            header: 'Nome',
            accessor: 'nome' as keyof Paciente,
        },
        {
            header: 'CPF',
            accessor: (item: Paciente) => formatCPF(item.cpf),
        },
        {
            header: 'CNS',
            accessor: 'cns' as keyof Paciente,
        },
        {
            header: 'Telefone',
            accessor: (item: Paciente) => formatTelefone(item.telefone),
        },
        {
            header: 'Grupos de Risco',
            accessor: (item: Paciente) =>
                item.gruposRisco.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                        {item.gruposRisco.map((g) => (
                            <Badge key={g} variant="secondary">
                                {g}
                            </Badge>
                        ))}
                    </div>
                ) : (
                    <span className="text-muted-foreground">Nenhum</span>
                ),
        },
        {
            header: 'Ações',
            accessor: (item: Paciente) => (
                <div className="flex gap-2">
                    <Link href={`/dashboard/pacientes/${item.id}`}>
                        <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                        </Button>
                    </Link>
                    <Link href={`/dashboard/pacientes/${item.id}/editar`}>
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
        <RequireRole allowedRoles={[Papeis.ADMINISTRADOR_PRINCIPAL, Papeis.MEDICO, Papeis.ENFERMEIRO]}>
            <div className="space-y-8">
                <Header
                    title="Pacientes"
                    description="Gerencie todos os pacientes cadastrados no sistema"
                    actionLabel="Novo Paciente"
                    actionHref="/dashboard/pacientes/criar"
                />

                <DataTable
                    data={pacientes}
                    columns={columns}
                    isLoading={isLoading}
                    caption={`Total: ${pacientes?.length || 0} pacientes`}
                />
            </div>
        </RequireRole>
    );
}