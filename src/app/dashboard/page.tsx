'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Activity, AlertCircle, Brain, ClipboardList, Users, TrendingUp } from 'lucide-react';
import { Header } from '@/components/Header';
import { IAReportCard } from '@/components/IAReportCard';
import { useConsultas, usePacientes, useRelatoriosIA, useTriagens } from '@/hooks';
import { useCurrentUser } from '@/hooks/useAuth';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardPage() {
    const { data: user } = useCurrentUser();

    const { data: pacientes, isLoading: loadingPacientes } = usePacientes();
    const { data: consultas, isLoading: loadingConsultas } = useConsultas();
    const { data: triagens, isLoading: loadingTriagens } = useTriagens();
    const { data: relatorios, isLoading: loadingRelatorios } = useRelatoriosIA(1);

    const totalPacientes = pacientes?.length ?? 0;
    const consultasHoje = consultas?.filter(c => {
        const dataConsulta = new Date(c.data_consulta);
        const hoje = new Date();
        return dataConsulta.toDateString() === hoje.toDateString();
    }).length ?? 0;

    const triagensCriticas = triagens?.filter(t => ['VERMELHO', 'LARANJA'].includes(t.nivel_gravidade)).length ?? 0;
    const ultimoRelatorio = relatorios?.[0];

    const isLoading = loadingPacientes || loadingConsultas || loadingTriagens || loadingRelatorios;

    const isAdmin = user?.papel === 'ADMINISTRADOR_PRINCIPAL';
    const isMedico = user?.papel === 'MEDICO';
    const isEnfermeiro = user?.papel === 'ENFERMEIRO';

    return (
        <div className="space-y-10 pb-12">
            <Header
                title="Dashboard"
                description="Visão geral em tempo real do Hospital IA"
                actionLabel="Relatórios IA"
                actionHref="/dashboard/ia"
            />

            {/* Métricas principais */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {isLoading ? (
                    <>
                        <Skeleton className="h-48 rounded-2xl" />
                        <Skeleton className="h-48 rounded-2xl" />
                        <Skeleton className="h-48 rounded-2xl" />
                    </>
                ) : (
                    <>
                        <Card className="hover:shadow-xl transition-all duration-300 border-blue-200 bg-gradient-to-br from-blue-50 to-white">
                            <CardHeader className="flex flex-row items-center justify-between pb-4">
                                <CardTitle className="text-xl font-semibold text-blue-900">
                                    Pacientes Cadastrados
                                </CardTitle>
                                <Users className="h-10 w-10 text-blue-600 opacity-80" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-5xl font-bold text-blue-900">{totalPacientes}</div>
                                <p className="text-muted-foreground mt-2 flex items-center gap-2">
                                    <TrendingUp className="h-4 w-4 text-green-600" />
                                    Total no sistema
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-xl transition-all duration-300 border-green-200 bg-gradient-to-br from-green-50 to-white">
                            <CardHeader className="flex flex-row items-center justify-between pb-4">
                                <CardTitle className="text-xl font-semibold text-green-900">
                                    Consultas Hoje
                                </CardTitle>
                                <ClipboardList className="h-10 w-10 text-green-600 opacity-80" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-5xl font-bold text-green-900">{consultasHoje}</div>
                                <p className="text-muted-foreground mt-2">Atendimentos do dia</p>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-xl transition-all duration-300 border-red-200 bg-gradient-to-br from-red-50 to-white">
                            <CardHeader className="flex flex-row items-center justify-between pb-4">
                                <CardTitle className="text-xl font-semibold text-red-900">
                                    Triagens Críticas
                                </CardTitle>
                                <AlertCircle className="h-10 w-10 text-red-600 opacity-80" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-5xl font-bold text-red-900">{triagensCriticas}</div>
                                <p className="text-muted-foreground mt-2">Atenção imediata necessária</p>
                            </CardContent>
                        </Card>
                    </>
                )}
            </div>

            {/* Último Relatório IA */}
            <Card className="border-purple-200 bg-purple-50/60 shadow-xl">
                <CardHeader>
                    <CardTitle className="flex items-center gap-4 text-purple-900">
                        <Brain className="h-8 w-8 text-purple-600" />
                        Último Relatório de Inteligência Artificial
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {loadingRelatorios ? (
                        <div className="space-y-6">
                            <Skeleton className="h-8 w-72 rounded" />
                            <Skeleton className="h-40 rounded-xl" />
                        </div>
                    ) : ultimoRelatorio ? (
                        <IAReportCard relatorio={ultimoRelatorio} />
                    ) : (
                        <div className="text-center py-12 text-muted-foreground">
                            Nenhum relatório gerado ainda. Acesse a seção IA para começar!
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Ações rápidas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {(isAdmin || isEnfermeiro) && (
                    <Link href="/dashboard/pacientes/criar">
                        <Button variant="outline" className="w-full h-32 flex flex-col gap-4 py-8 hover:shadow-2xl hover:border-blue-400 transition-all">
                            <Users className="h-14 w-14 text-blue-600" />
                            <span className="text-lg font-semibold">Novo Paciente</span>
                        </Button>
                    </Link>
                )}

                {isMedico && (
                    <Link href="/dashboard/consultas/criar">
                        <Button variant="outline" className="w-full h-32 flex flex-col gap-4 py-8 hover:shadow-2xl hover:border-green-400 transition-all">
                            <ClipboardList className="h-14 w-14 text-green-600" />
                            <span className="text-lg font-semibold">Nova Consulta</span>
                        </Button>
                    </Link>
                )}

                {isEnfermeiro && (
                    <Link href="/dashboard/triagens/criar">
                        <Button variant="outline" className="w-full h-32 flex flex-col gap-4 py-8 hover:shadow-2xl hover:border-orange-400 transition-all">
                            <Activity className="h-14 w-14 text-orange-600" />
                            <span className="text-lg font-semibold">Nova Triagem</span>
                        </Button>
                    </Link>
                )}

                <Link href="/dashboard/ia">
                    <Button variant="outline" className="w-full h-32 flex flex-col gap-4 py-8 hover:shadow-2xl hover:border-purple-400 transition-all">
                        <Brain className="h-14 w-14 text-purple-600" />
                        <span className="text-lg font-semibold">Gerar Relatório IA</span>
                    </Button>
                </Link>
            </div>
        </div>
    );
}