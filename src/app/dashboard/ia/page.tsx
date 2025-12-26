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
            <div className="space-y-12 py-8">
                {/* Cabeçalho hero */}
                <div className="text-center space-y-4">
                    <div className="inline-flex items-center gap-3 rounded-full bg-purple-100 px-4 py-2 text-purple-800">
                        <Brain className="h-5 w-5" />
                        <span className="text-sm font-medium">Inteligência Artificial</span>
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight text-foreground">
                        Análises Inteligentes para Gestão Hospitalar
                    </h1>
                    <p className="mx-auto max-w-3xl text-lg text-muted-foreground">
                        Utilize ferramentas de IA para detectar surtos, identificar pacientes recorrentes e otimizar o atendimento com dados em tempo real.
                    </p>
                </div>

                {/* Grid de cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Relatório de Surto */}
                    <Card className="group hover:shadow-2xl transition-all duration-300 border-red-200 bg-gradient-to-br from-red-50 to-white">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <AlertTriangle className="h-10 w-10 text-red-600" />
                                <div className="h-3 w-3 rounded-full bg-red-500 animate-pulse" />
                            </div>
                            <CardTitle className="text-xl mt-4">Relatório de Surto</CardTitle>
                            <CardDescription className="mt-2">
                                Detecta surtos respiratórios e recomenda ações imediatas para contenção
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button asChild className="w-full bg-red-600 hover:bg-red-700">
                                <Link href="/dashboard/ia/surto">
                                    Gerar Relatório
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Análise Recorrente */}
                    <Card className="group hover:shadow-2xl transition-all duration-300 border-blue-200 bg-gradient-to-br from-blue-50 to-white">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <Users className="h-10 w-10 text-blue-600" />
                                <div className="h-3 w-3 rounded-full bg-blue-500 animate-pulse" />
                            </div>
                            <CardTitle className="text-xl mt-4">Análise Recorrente</CardTitle>
                            <CardDescription className="mt-2">
                                Identifica padrões de atendimentos frequentes e sugere intervenções preventivas
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
                                <Link href="/dashboard/ia/recorrente">
                                    Selecionar Paciente
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Triagens por Unidade */}
                    <Card className="group hover:shadow-2xl transition-all duration-300 border-green-200 bg-gradient-to-br from-green-50 to-white">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <Activity className="h-10 w-10 text-green-600" />
                                <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse" />
                            </div>
                            <CardTitle className="text-xl mt-4">Triagens por Unidade</CardTitle>
                            <CardDescription className="mt-2">
                                Analisa risco de sobrecarga e distribuição de pacientes por unidade de saúde
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button asChild className="w-full bg-green-600 hover:bg-green-700">
                                <Link href="/dashboard/ia/triagens">
                                    Selecionar Unidade
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Histórico de Relatórios */}
                    <Card className="group hover:shadow-2xl transition-all duration-300 border-purple-200 bg-gradient-to-br from-purple-50 to-white">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <BarChart3 className="h-10 w-10 text-purple-600" />
                                <div className="h-3 w-3 rounded-full bg-purple-500 animate-pulse" />
                            </div>
                            <CardTitle className="text-xl mt-4">Histórico de Relatórios</CardTitle>
                            <CardDescription className="mt-2">
                                Acesse todos os relatórios gerados pela IA com detalhes e métricas
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button asChild className="w-full bg-purple-600 hover:bg-purple-700">
                                <Link href="/dashboard/ia/relatorios">
                                    Ver Relatórios
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Dica final */}
                <div className="text-center">
                    <p className="text-muted-foreground italic">
                        Todos os relatórios são gerados com base nos dados reais do sistema em tempo real.
                    </p>
                </div>
            </div>
        </RequireRole>
    );
}