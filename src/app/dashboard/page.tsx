// src/app/dashboard/page.tsx
'use client';

import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {Activity, AlertCircle, Brain, ClipboardList, Users} from 'lucide-react';
import {Header} from '@/components/Header';
import {IAReportCard} from '@/components/IAReportCard';
import {useConsultas, usePacientes, useRelatoriosIA, useTriagens} from '@/hooks';
import { useCurrentUser } from '@/hooks/useAuth';
import Link from 'next/link';

export default function DashboardPage() {
    const { data: user } = useCurrentUser();

    const { data: pacientes, isLoading: loadingPacientes } = usePacientes();
    const { data: consultas, isLoading: loadingConsultas } = useConsultas();
    const { data: triagens, isLoading: loadingTriagens } = useTriagens();
    const { data: relatorios, isLoading: loadingRelatorios } = useRelatoriosIA(1);

    const totalPacientes = pacientes?.length ?? 0;
    const consultasHoje = consultas?.filter(c => {
        const dataConsulta = new Date(c.data);
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
        <div className="space-y-8">
            <Header
                title="Dashboard"
                description="Visão geral do sistema hospitalar"
                actionLabel="Gerar Relatório IA"
                actionHref="/dashboard/ia"
            />

            {/* Métricas — todos veem */}
            {isLoading ? (
                // skeleton
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[...Array(3)].map((_, i) => (
                        <Card key={i}>
                            <CardHeader>
                                <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
                            </CardHeader>
                            <CardContent>
                                <div className="h-12 w-24 bg-gray-300 rounded animate-pulse" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-lg font-medium">Pacientes Cadastrados</CardTitle>
                            <Users className="w-8 h-8 text-blue-600 opacity-70" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-bold">{totalPacientes}</div>
                            <p className="text-sm text-muted-foreground mt-1">Total no sistema</p>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-lg font-medium">Consultas Hoje</CardTitle>
                            <ClipboardList className="w-8 h-8 text-green-600 opacity-70" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-bold">{consultasHoje}</div>
                            <p className="text-sm text-muted-foreground mt-1">Atendimentos do dia</p>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-lg font-medium">Triagens Críticas</CardTitle>
                            <AlertCircle className="w-8 h-8 text-red-600 opacity-70" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-bold text-red-600">{triagensCriticas}</div>
                            <p className="text-sm text-muted-foreground mt-1">Atenção imediata</p>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Último Relatório IA */}
            <Card className="border-purple-200 bg-purple-50/50">
                <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                        <Brain className="w-6 h-6 text-purple-600" />
                        Último Relatório IA
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {loadingRelatorios ? (
                        <div className="space-y-4">
                            <div className="h-6 w-64 bg-gray-200 rounded animate-pulse" />
                            <div className="h-32 bg-gray-200 rounded animate-pulse" />
                        </div>
                    ) : ultimoRelatorio ? (
                        <IAReportCard relatorio={ultimoRelatorio} />
                    ) : (
                        <div className="text-center py-8 text-muted-foreground">
                            Nenhum relatório gerado ainda. Comece criando um na seção IA!
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Botões rápidos — responsivos e bonitos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 auto-rows-fr">
                {(isAdmin || isEnfermeiro) && (
                    <Link href="/dashboard/pacientes/criar" className="block">
                        <Button variant="outline" className="w-full h-full flex flex-col gap-3 py-8 px-6 hover:shadow-lg transition-shadow">
                            <Users className="w-12 h-12 text-blue-600" />
                            <span className="text-lg font-medium">Novo Paciente</span>
                        </Button>
                    </Link>
                )}

                {isMedico && (
                    <Link href="/dashboard/consultas/criar" className="block">
                        <Button variant="outline" className="w-full h-full flex flex-col gap-3 py-8 px-6 hover:shadow-lg transition-shadow">
                            <ClipboardList className="w-12 h-12 text-green-600" />
                            <span className="text-lg font-medium">Nova Consulta</span>
                        </Button>
                    </Link>
                )}

                {isEnfermeiro && (
                    <Link href="/dashboard/triagens/criar" className="block">
                        <Button variant="outline" className="w-full h-full flex flex-col gap-3 py-8 px-6 hover:shadow-lg transition-shadow">
                            <Activity className="w-12 h-12 text-orange-600" />
                            <span className="text-lg font-medium">Nova Triagem</span>
                        </Button>
                    </Link>
                )}

                {/* Todos podem gerar relatório IA */}
                <Link href="/dashboard/ia" className="block">
                    <Button variant="outline" className="w-full h-full flex flex-col gap-3 py-8 px-6 hover:shadow-lg transition-shadow">
                        <Brain className="w-12 h-12 text-purple-600" />
                        <span className="text-lg font-medium">Gerar Relatório IA</span>
                    </Button>
                </Link>
            </div>
        </div>
    );
}