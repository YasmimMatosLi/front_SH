'use client';

import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { usePaciente } from '@/hooks/usePaciente';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Edit } from 'lucide-react';
import { formatCPF, formatTelefone, formatDate } from '@/lib/utils';

export default function PacienteDetalhesPage() {
    const params = useParams();
    const id = params.id as string;

    const { data: paciente, isLoading, isError } = usePaciente(id);

    if (isLoading) {
        return (
            <div className="space-y-10 pb-12">
                <Header title="Carregando paciente..." />
                <div className="space-y-6">
                    <Skeleton className="h-12 w-96 rounded-xl" />
                    <Skeleton className="h-64 w-full rounded-xl" />
                    <Skeleton className="h-48 w-full rounded-xl" />
                </div>
            </div>
        );
    }

    if (isError || !paciente) {
        return (
            <div className="space-y-10 pb-12">
                <Header title="Paciente não encontrado" />
                <Card className="border-red-200 bg-red-50">
                    <CardContent className="pt-10 text-center">
                        <p className="text-xl mb-8">Não foi possível carregar os dados do paciente.</p>
                        <Link href="/dashboard/pacientes">
                            <Button variant="outline" size="lg">
                                <ArrowLeft className="mr-2 h-5 w-5" />
                                Voltar para lista
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-10 pb-12">
            <Header
                title={paciente.nome}
                description={`CPF: ${formatCPF(paciente.cpf)}`}
                actionLabel="Voltar"
                actionHref="/dashboard/pacientes"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Informações Pessoais</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <p className="text-sm text-muted-foreground">Nome completo</p>
                            <p className="text-lg font-medium">{paciente.nome}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Data de nascimento</p>
                            <p className="text-lg font-medium">{formatDate(paciente.dataNascimento)}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">CPF</p>
                            <p className="font-mono text-lg">{formatCPF(paciente.cpf)}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">CNS</p>
                            <p className="font-mono text-lg">{paciente.cns || '—'}</p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Contato</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <p className="text-sm text-muted-foreground">Telefone</p>
                            <p className="text-lg font-medium">{formatTelefone(paciente.telefone)}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Email</p>
                            <p className="text-lg font-medium">{paciente.email || '—'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Endereço</p>
                            <p className="text-lg font-medium">
                                {`${paciente.endereco.logradouro}, ${paciente.endereco.numero}, ${paciente.endereco.bairro}, ${paciente.endereco.cidade} - ${paciente.endereco.estado}, ${paciente.endereco.cep}`}
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Grupos de Risco</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {paciente.gruposRisco.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {paciente.gruposRisco.map((grupo) => (
                                    <Badge key={grupo} variant="secondary">
                                        {grupo}
                                    </Badge>
                                ))}
                            </div>
                        ) : (
                            <p className="text-muted-foreground">Nenhum grupo de risco cadastrado</p>
                        )}
                    </CardContent>
                </Card>
            </div>

            <div className="flex justify-end gap-4">
                <Link href={`/dashboard/pacientes/${id}/editar`}>
                    <Button>
                        <Edit className="mr-2 h-4 w-4" />
                        Editar Paciente
                    </Button>
                </Link>
            </div>
        </div>
    );
}