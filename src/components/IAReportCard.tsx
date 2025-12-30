// src/components/IAReportCard.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, AlertTriangle, Users, Activity, Calendar, ChevronRight } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Badge } from '@/components/ui/badge';
import { RelatorioIAItem } from '@/types/relatorio-ia';

interface IAReportCardProps {
    relatorio: RelatorioIAItem;
}

const getConfig = (tipo: string) => {
    if (tipo.includes('surto')) {
        return { icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50', border: 'border-l-red-500', title: 'Alerta de Surto Respiratório' };
    }
    if (tipo.includes('recorrente')) {
        return { icon: Users, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-l-purple-500', title: 'Análise de Paciente Recorrente' };
    }
    if (tipo.includes('triagem')) {
        return { icon: Activity, color: 'text-teal-600', bg: 'bg-teal-50', border: 'border-l-teal-500', title: 'Análise de Triagens por Unidade' };
    }
    return { icon: Brain, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-l-blue-500', title: 'Relatório de Inteligência Artificial' };
};

export function IAReportCard({ relatorio }: IAReportCardProps) {
    const { tipo, resumo, conteudo, criado_em, id } = relatorio;
    const config = getConfig(tipo);
    const Icon = config.icon;

    const dataFormatada = format(new Date(criado_em), "dd 'de' MMMM 'de' yyyy, HH:mm", { locale: ptBR });

    // === SUPORTE A RELATÓRIOS ANTIGOS E NOVOS ===
    const hasEstruturaNova = resumo && typeof resumo === 'object';

    const preview = hasEstruturaNova
        ? resumo.conclusao || 'Análise gerada pela IA'
        : conteudo
            .replace(/^\s*[\r\n]+/gm, '')
            .replace(/^\s*[-•*]\s*/gm, '')
            .trim()
            .slice(0, 600);

    const hasMore = hasEstruturaNova
        ? conteudo.length > 300 // se for novo, sempre tem "mais" no detalhe
        : conteudo.trim().length > 600;

    // Risco: só existe nos novos relatórios de surto
    const risco = hasEstruturaNova && resumo.risco ? resumo.risco : null;
    const riscoCor = risco === 'Alto' ? 'text-red-600 bg-red-50' :
        risco === 'Moderado' ? 'text-orange-600 bg-orange-50' :
            risco === 'Baixo' ? 'text-green-600 bg-green-50' :
                'text-gray-600 bg-gray-100';

    return (
        <Card className={`hover:shadow-2xl transition-all duration-300 border-l-4 ${config.border} bg-white overflow-hidden`}>
            <CardHeader className="pb-5">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                        <div className={`p-4 rounded-full ${config.bg} shadow-md relative`}>
                            <Icon className={`w-10 h-10 ${config.color}`} />
                            {risco && (
                                <div className={`absolute -top-1 -right-1 h-3 w-3 rounded-full ${riscoCor} animate-pulse`} />
                            )}
                        </div>
                        <div className="flex-1">
                            <CardTitle className="text-2xl font-bold text-gray-900">
                                {config.title}
                            </CardTitle>
                            <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
                                <Calendar className="h-4 w-4" />
                                <span>{dataFormatada}</span>
                                {risco && <Badge className={`text-xs ${riscoCor}`}>{risco}</Badge>}
                            </div>
                            <p className="mt-3 text-gray-700 leading-relaxed">
                                {preview}
                                {hasMore && '...'}
                            </p>
                        </div>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="pt-4">
                <div className="flex justify-end">
                    <Link href={`/dashboard/ia/relatorios/${id}`}>
                        <Button variant="ghost" className="font-medium text-purple-600 hover:text-purple-700 hover:bg-purple-50">
                            Ver relatório completo
                            <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                </div>
            </CardContent>
        </Card>
    );
}