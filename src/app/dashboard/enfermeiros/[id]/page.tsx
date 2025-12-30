'use client';

import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useEnfermeiro } from '@/hooks/useEnfermeiro';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Edit, Phone, Mail, UserPlus, FileText, Calendar } from 'lucide-react';
import { formatCPF, formatTelefone, formatDate } from '@/lib/utils';
import { Papeis } from '@/types';
import { RequireRole } from '@/components/RequireRole';

export default function EnfermeiroDetalhesPage() {
    const params = useParams();
    const id = params.id as string;

    const { data: enfermeiro, isLoading, isError } = useEnfermeiro(id);

    if (isLoading) {
        return (
            <div className="space-y-10 pb-12">
                <Header title="Carregando enfermeiro..." />
                <div className="space-y-6">
                    <Skeleton className="h-12 w-96 rounded-xl" />
                    <Skeleton className="h-64 w-full rounded-xl" />
                    <Skeleton className="h-48 w-full rounded-xl" />
                </div>
            </div>
        );
    }

    if (isError || !enfermeiro) {
        return (
            <div className="space-y-10 pb-12">
                <Header title="Enfermeiro não encontrado" />
                <Card className="border-red-200 bg-red-50">
                    <CardContent className="pt-10 text-center">
                        <p className="text-xl mb-8">Não foi possível carregar os dados do enfermeiro.</p>
                        <Link href="/dashboard/enfermeiros">
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
        <RequireRole allowedRoles={[Papeis.ADMINISTRADOR_PRINCIPAL]}>
            <div className="space-y-10 pb-12">
                <Header
                    title={enfermeiro.nome}
                    description={`COREN: ${enfermeiro.registroProfissional}`}
                    actionLabel="Voltar"
                    actionHref="/dashboard/enfermeiros"
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Dados Profissionais */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3">
                                <UserPlus className="h-6 w-6 text-teal-600" />
                                Dados Profissionais
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div>
                                <p className="text-sm text-muted-foreground">COREN</p>
                                <p className="text-xl font-semibold">{enfermeiro.registroProfissional}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Data de Contratação</p>
                                <p className="text-lg flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    {formatDate(enfermeiro.dataContratacao)}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Dados Pessoais */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3">
                                <FileText className="h-6 w-6 text-green-600" />
                                Dados Pessoais
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div>
                                <p className="text-sm text-muted-foreground">CPF</p>
                                <p className="font-mono text-lg">{formatCPF(enfermeiro.cpf)}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Data de Nascimento</p>
                                <p className="text-lg flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    {formatDate(enfermeiro.dataNascimento)}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Contato */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3">
                                <Phone className="h-6 w-6 text-purple-600" />
                                Contato
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center gap-3">
                                <Phone className="h-5 w-5 text-muted-foreground" />
                                <span className="text-lg">{formatTelefone(enfermeiro.telefone)}</span>
                            </div>
                            {enfermeiro.email && (
                                <div className="flex items-center gap-3">
                                    <Mail className="h-5 w-5 text-muted-foreground" />
                                    <span className="text-lg break-all">{enfermeiro.email}</span>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <div className="flex justify-end">
                    <Link href={`/dashboard/enfermeiros/${id}/editar`}>
                        <Button size="lg">
                            <Edit className="mr-2 h-5 w-5" />
                            Editar Enfermeiro
                        </Button>
                    </Link>
                </div>
            </div>
        </RequireRole>
    );
}