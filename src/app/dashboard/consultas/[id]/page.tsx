'use client';

import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useConsulta } from '@/hooks/useConsulta';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Edit, Calendar, User, Stethoscope, FileText } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { Papeis } from '@/types';
import { RequireRole } from '@/components/RequireRole';

export default function ConsultaDetalhesPage() {
    const params = useParams();
    const id = params.id as string;

    const { data: consulta, isLoading, isError } = useConsulta(id);

    if (isLoading) {
        return (
            <div className="space-y-10 pb-12">
                <Header title="Carregando consulta..." />
                <div className="space-y-6">
                    <Skeleton className="h-12 w-96 rounded-xl" />
                    <Skeleton className="h-64 w-full rounded-xl" />
                    <Skeleton className="h-48 w-full rounded-xl" />
                </div>
            </div>
        );
    }

    if (isError || !consulta) {
        return (
            <div className="space-y-10 pb-12">
                <Header title="Consulta não encontrada" />
                <Card className="border-red-200 bg-red-50">
                    <CardContent className="pt-10 text-center">
                        <p className="text-xl mb-8">Não foi possível carregar os dados da consulta.</p>
                        <Link href="/dashboard/consultas">
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
        <RequireRole allowedRoles={[Papeis.ADMINISTRADOR_PRINCIPAL, Papeis.MEDICO]}>
            <div className="space-y-10 pb-12">
                <Header
                    title={`Consulta - #${consulta.id.slice(0,8)}`}
                    description={formatDate(consulta.data_consulta)}
                    actionLabel="Voltar"
                    actionHref="/dashboard/consultas"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Informações da Consulta */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3">
                                <Calendar className="h-6 w-6 text-blue-600" />
                                Informações da Consulta
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div>
                                <p className="text-sm text-muted-foreground">Data</p>
                                <p className="text-xl font-semibold">{formatDate(consulta.data_consulta)}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">CID-10</p>
                                <p className="font-mono text-lg">{consulta.cid10 || 'Não informado'}</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Paciente */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3">
                                <User className="h-6 w-6 text-green-600" />
                                Paciente
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-xl font-semibold">{consulta.paciente_nome}</p>
                        </CardContent>
                    </Card>

                    {/* Médico */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3">
                                <Stethoscope className="h-6 w-6 text-purple-600" />
                                Médico Responsável
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-xl font-semibold">{consulta.medicoNome}</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Observações */}
                <Card className="mt-8">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-3">
                            <FileText className="h-6 w-6 text-orange-600" />
                            Observações da Consulta
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="whitespace-pre-wrap text-lg leading-relaxed">
                            {consulta.observacoes || 'Nenhuma observação registrada.'}
                        </p>
                    </CardContent>
                </Card>

                <div className="flex justify-end">
                    <Link href={`/dashboard/consultas/${id}/editar`}>
                        <Button size="lg">
                            <Edit className="mr-2 h-5 w-5" />
                            Editar Consulta
                        </Button>
                    </Link>
                </div>
            </div>
        </RequireRole>
    );
}