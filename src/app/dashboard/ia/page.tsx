// src/app/dashboard/ia/page.tsx
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Users, Activity, BarChart3, Brain } from 'lucide-react';
import Link from 'next/link';
import { Papeis } from '@/types';
import { RequireRole } from '@/components/RequireRole';

export default function IAPage() {
    return (
        <RequireRole allowedRoles={[Papeis.ADMINISTRADOR_PRINCIPAL, Papeis.MEDICO, Papeis.ENFERMEIRO]}>
            <div className="space-y-16 py-12">
                <div className="text-center space-y-6">
                    <div className="inline-flex items-center gap-3 rounded-full bg-purple-100 px-5 py-2.5 text-purple-800 shadow-sm">
                        <Brain className="h-5 w-5" />
                        <span className="text-sm font-semibold">Inteligência Artificial</span>
                    </div>
                    <h1 className="text-5xl font-bold tracking-tight text-foreground max-w-4xl mx-auto">
                        Análises Inteligentes para Gestão Hospitalar
                    </h1>
                    <p className="mx-auto max-w-4xl text-xl text-muted-foreground leading-relaxed">
                        Utilize ferramentas de IA para detectar surtos, identificar pacientes recorrentes e otimizar o atendimento com dados em tempo real.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 px-4">
                    <Card className="group hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border-red-200 bg-gradient-to-br from-red-50/80 to-white overflow-hidden">
                        <CardHeader className="pb-6">
                            <div className="flex items-center justify-between mb-4">
                                <AlertTriangle className="h-12 w-12 text-red-600" />
                                <div className="h-3 w-3 rounded-full bg-red-500 animate-pulse" />
                            </div>
                            <CardTitle className="text-2xl font-bold text-red-900">
                                Relatório de Surto
                            </CardTitle>
                            <CardDescription className="text-base mt-3 text-gray-700">
                                Detecta surtos respiratórios e recomenda ações imediatas para contenção
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-4">
                            <Button asChild size="lg" className="w-full font-semibold bg-red-600 hover:bg-red-700 shadow-md">
                                <Link href="/dashboard/ia/surto">
                                    Gerar Relatório
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="group hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border-blue-200 bg-gradient-to-br from-blue-50/80 to-white overflow-hidden">
                        <CardHeader className="pb-6">
                            <div className="flex items-center justify-between mb-4">
                                <Users className="h-12 w-12 text-blue-600" />
                                <div className="h-3 w-3 rounded-full bg-blue-500 animate-pulse" />
                            </div>
                            <CardTitle className="text-2xl font-bold text-blue-900">
                                Análise Recorrente
                            </CardTitle>
                            <CardDescription className="text-base mt-3 text-gray-700">
                                Identifica padrões de atendimentos frequentes e sugere intervenções preventivas
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-4">
                            <Button asChild size="lg" className="w-full font-semibold bg-blue-600 hover:bg-blue-700 shadow-md">
                                <Link href="/dashboard/ia/recorrente">
                                    Selecionar Paciente
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="group hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border-green-200 bg-gradient-to-br from-green-50/80 to-white overflow-hidden">
                        <CardHeader className="pb-6">
                            <div className="flex items-center justify-between mb-4">
                                <Activity className="h-12 w-12 text-green-600" />
                                <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse" />
                            </div>
                            <CardTitle className="text-2xl font-bold text-green-900">
                                Triagens por Unidade
                            </CardTitle>
                            <CardDescription className="text-base mt-3 text-gray-700">
                                Analisa risco de sobrecarga e distribuição de pacientes por unidade de saúde
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-4">
                            <Button asChild size="lg" className="w-full font-semibold bg-green-600 hover:bg-green-700 shadow-md">
                                <Link href="/dashboard/ia/triagens">
                                    Selecionar Unidade
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="group hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border-purple-200 bg-gradient-to-br from-purple-50/80 to-white overflow-hidden">
                        <CardHeader className="pb-6">
                            <div className="flex items-center justify-between mb-4">
                                <BarChart3 className="h-12 w-12 text-purple-600" />
                                <div className="h-3 w-3 rounded-full bg-purple-500 animate-pulse" />
                            </div>
                            <CardTitle className="text-2xl font-bold text-purple-900">
                                Histórico de Relatórios
                            </CardTitle>
                            <CardDescription className="text-base mt-3 text-gray-700">
                                Acesse todos os relatórios gerados pela IA com detalhes e métricas
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-4">
                            <Button asChild size="lg" className="w-full font-semibold bg-purple-600 hover:bg-purple-700 shadow-md">
                                <Link href="/dashboard/ia/relatorios">
                                    Ver Relatórios
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                <div className="text-center pt-8">
                    <p className="text-muted-foreground text-lg italic">
                        Todos os relatórios são gerados com base nos dados reais do sistema em tempo real.
                    </p>
                </div>
            </div>
        </RequireRole>
    );
}