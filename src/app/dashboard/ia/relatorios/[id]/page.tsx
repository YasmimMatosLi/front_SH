'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { AlertTriangle, Brain, Calendar, ChevronLeft, Activity, Users } from 'lucide-react';
import { Header } from '@/components/Header';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useRelatorioIA } from '@/hooks/useIA';
import { useParams } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';

export default function RelatorioDetalhesPage() {
    const params = useParams();
    const id = params.id as string;
    const { data: relatorio, isLoading, isError } = useRelatorioIA(id);

    const getConfig = (tipo: string) => {
        if (tipo.includes('surto')) return { icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50', badge: 'bg-red-100 text-red-800', title: 'Alerta de Surto Respiratório' };
        if (tipo.includes('recorrente')) return { icon: Users, color: 'text-purple-600', bg: 'bg-purple-50', badge: 'bg-purple-100 text-purple-800', title: 'Análise de Paciente Recorrente' };
        if (tipo.includes('triagem')) return { icon: Activity, color: 'text-teal-600', bg: 'bg-teal-50', badge: 'bg-teal-100 text-teal-800', title: 'Análise de Triagens por Unidade' };
        return { icon: Brain, color: 'text-blue-600', bg: 'bg-blue-50', badge: 'bg-blue-100 text-blue-800', title: 'Relatório de Inteligência Artificial' };
    };

    if (isLoading) return (
        <div className="space-y-10 pb-12">
            <Header title="Carregando relatório..." />
            <Card className="border-l-4 border-l-purple-500">
                <CardHeader>
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <Skeleton className="h-10 w-96 mt-4" />
                    <Skeleton className="h-6 w-64 mt-4" />
                </CardHeader>
                <CardContent className="space-y-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-32 w-full rounded-xl" />
                    <Skeleton className="h-24 w-full rounded-xl" />
                </CardContent>
            </Card>
        </div>
    );

    if (isError || !relatorio) return (
        <div className="space-y-10 pb-12">
            <Header title="Erro" description="Detalhes do relatório" />
            <Card className="border-red-200 bg-red-50">
                <CardContent className="pt-10 text-center">
                    <AlertTriangle className="h-16 w-16 text-red-600 mx-auto mb-6" />
                    <p className="text-xl mb-8">Relatório não encontrado.</p>
                    <Link href="/dashboard/ia">
                        <Button variant="outline" size="lg">
                            <ChevronLeft className="mr-2 h-5 w-5" />
                            Voltar para IA
                        </Button>
                    </Link>
                </CardContent>
            </Card>
        </div>
    );

    const config = getConfig(relatorio.tipo);
    const Icon = config.icon;
    const dataFormatada = format(new Date(relatorio.criado_em), "dd 'de' MMMM 'de' yyyy, 'às' HH:mm", { locale: ptBR });

    const riscoCor = relatorio.resumo.risco === 'Alto' ? 'text-red-600 bg-red-50' :
        relatorio.resumo.risco === 'Moderado' ? 'text-orange-600 bg-orange-50' :
            'text-green-600 bg-green-50';

    const confiabilidadeCor = relatorio.indicadores.confiabilidade === 'alta' ? 'bg-green-100 text-green-800' :
        relatorio.indicadores.confiabilidade === 'media' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800';

    return (
        <div className="space-y-10 pb-16">
            <Header
                title="Relatório de Inteligência Artificial"
                description={dataFormatada}
                actionLabel="Voltar"
                actionHref="/dashboard/ia"
            />

            <Card className={`border-l-4 ${config.color.replace('text-', 'border-')} shadow-xl bg-white overflow-hidden`}>
                <CardHeader className="pb-8">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-6">
                            <div className="relative">
                                <div className={`p-5 rounded-full ${config.bg} shadow-lg`}>
                                    <Icon className={`w-14 h-14 ${config.color}`} />
                                </div>
                                <div className={`absolute -top-1 -right-1 h-4 w-4 rounded-full ${riscoCor} animate-pulse`} />
                            </div>
                            <div>
                                <CardTitle className="text-4xl font-bold text-gray-900">
                                    {config.title}
                                </CardTitle>
                                <div className="flex items-center gap-3 mt-4 text-lg text-muted-foreground">
                                    <Calendar className="h-6 w-6" />
                                    <span>Gerado em {dataFormatada}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="space-y-10">

                    {/* 1. RESUMO EXECUTIVO */}
                    <Card className="border-purple-200 bg-purple-50/60 shadow-md">
                        <CardHeader>
                            <CardTitle className="text-2xl text-purple-900 flex items-center gap-2">
                                📊 Resumo Executivo
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6 pt-6">
                            <div className="flex items-center gap-6">
                                <div className="flex-1">
                                    <span className="text-lg font-semibold text-gray-700">Nível de Risco:</span>
                                    <Badge className={`text-lg px-4 py-2 ml-2 ${riscoCor} border border-${riscoCor.split(' ')[0].replace('text-', '')}`}>
                                        {relatorio.resumo.risco}
                                    </Badge>
                                </div>
                                <div className="flex-1">
                                    <span className="text-lg font-semibold text-gray-700">Período:</span>
                                    <span className="ml-2 text-lg font-medium text-purple-800">{relatorio.resumo.periodo}</span>
                                </div>
                            </div>
                            <div className="border-l-4 border-purple-300 pl-6 py-4 bg-purple-50 rounded-r-lg">
                                <p className="text-xl font-semibold text-gray-800 leading-relaxed">
                                    {relatorio.resumo.conclusao}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* 2. INDICADORES */}
                    <Card className="shadow-md">
                        <CardHeader>
                            <CardTitle className="text-2xl text-gray-900 flex items-center gap-2">
                                📈 Indicadores Chave
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <Card className="border border-gray-200 hover:shadow-md transition-shadow">
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-sm font-medium text-gray-600">Casos Respiratórios</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-4xl font-bold text-red-600">{relatorio.indicadores.casos_respiratorios}</div>
                                    </CardContent>
                                </Card>
                                <Card className="border border-gray-200 hover:shadow-md transition-shadow">
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-sm font-medium text-gray-600">Consultas Totais</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-4xl font-bold text-gray-900">{relatorio.indicadores.consultas_totais}</div>
                                    </CardContent>
                                </Card>
                                <Card className="border border-gray-200 hover:shadow-md transition-shadow">
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-sm font-medium text-gray-600">Percentual</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-4xl font-bold text-orange-600">{relatorio.indicadores.percentual}%</div>
                                    </CardContent>
                                </Card>
                                <Card className="border border-gray-200 hover:shadow-md transition-shadow">
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-sm font-medium text-gray-600">Confiabilidade</CardTitle>
                                    </CardHeader>
                                    <CardContent className="pt-0">
                                        <Badge className={`px-4 py-2 ${confiabilidadeCor}`}>
                                            {relatorio.indicadores.confiabilidade}
                                        </Badge>
                                    </CardContent>
                                </Card>
                            </div>
                        </CardContent>
                    </Card>

                    {/* 3. RECOMENDAÇÕES */}
                    <Card className="shadow-md">
                        <CardHeader>
                            <CardTitle className="text-2xl text-gray-900 flex items-center gap-2">
                                ⚡ Recomendações Prioritárias
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="space-y-4">
                                {relatorio.recomendacoes.map((recomendacao, index) => (
                                    <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl border-l-4 border-l-purple-400 hover:bg-gray-100 transition-colors">
                                        <div className="flex-shrink-0 mt-1 h-2 w-2 rounded-full bg-purple-600" />
                                        <div>
                                            <h4 className="font-semibold text-gray-900 text-lg">{recomendacao}</h4>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* 4. ANÁLISE COMPLETA (ACCORDION) */}
                    <Card className="shadow-md">
                        <CardHeader>
                            <CardTitle className="text-2xl text-gray-900 flex items-center gap-2">
                                📋 Análise Técnica Completa
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <Accordion type="single" collapsible defaultValue="completo" className="border-none">
                                <AccordionItem value="completo" className="border-none">
                                    <AccordionTrigger className="text-lg font-semibold text-gray-700 hover:text-gray-900 px-0 py-4">
                                        Expandir análise detalhada
                                    </AccordionTrigger>
                                    <AccordionContent className="pt-6 prose prose-lg max-w-none border-t border-gray-200 mt-4">
                                        <ReactMarkdown
                                            remarkPlugins={[remarkGfm]}
                                            components={{
                                                h1: ({ children }) => <h1 className="text-2xl font-bold text-gray-900 mt-8 mb-4 border-b border-gray-300 pb-2">{children}</h1>,
                                                h2: ({ children }) => <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">{children}</h2>,
                                                h3: ({ children }) => <h3 className="text-lg font-medium text-gray-700 mt-5 mb-2">{children}</h3>,
                                                p: ({ children }) => <p className="my-4 leading-relaxed text-gray-700">{children}</p>,
                                                ul: ({ children }) => <ul className="list-disc list-inside space-y-2 my-4 ml-6 text-gray-700">{children}</ul>,
                                                table: ({ children }) => (
                                                    <div className="my-8 overflow-x-auto">
                                                        <table className="min-w-full divide-y divide-gray-300 border border-gray-300 rounded-xl overflow-hidden shadow-sm">
                                                            {children}
                                                        </table>
                                                    </div>
                                                ),
                                                thead: ({ children }) => <thead className="bg-gray-50">{children}</thead>,
                                                th: ({ children }) => <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 bg-gray-50">{children}</th>,
                                                td: ({ children }) => <td className="px-6 py-3 text-sm text-gray-700 border-t border-gray-200">{children}</td>,
                                                blockquote: ({ children }) => (
                                                    <blockquote className="border-l-4 border-gray-300 bg-gray-50 pl-6 py-4 my-6 italic text-gray-700 rounded-r-lg">
                                                        {children}
                                                    </blockquote>
                                                ),
                                            }}
                                        >
                                            {relatorio.conteudo}
                                        </ReactMarkdown>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </CardContent>
                    </Card>

                </CardContent>
            </Card>
        </div>
    );
}