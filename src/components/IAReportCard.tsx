// src/components/IAReportCard.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, AlertCircle, TrendingUp, Activity } from 'lucide-react';
import { RelatorioIA } from '@/types';

interface IAReportCardProps {
    relatorio: RelatorioIA;
}

export function IAReportCard({ relatorio }: IAReportCardProps) {
    const { tipo, conteudo, criado_em } = relatorio;

    const configs = {
        surto_j: { icon: TrendingUp, color: 'text-orange-600', bg: 'bg-orange-50', title: 'Alerta de Surto Respiratório' },
        surto_a: { icon: TrendingUp, color: 'text-red-600', bg: 'bg-red-50', title: 'Alerta de Surto (CID Axx)' },
        paciente_recorrente: { icon: AlertCircle, color: 'text-purple-600', bg: 'bg-purple-50', title: 'Análise de Paciente Recorrente' },
        triagem_unidade: { icon: Activity, color: 'text-teal-600', bg: 'bg-teal-50', title: 'Análise de Demanda por Triagem' },
    };

    const config = Object.entries(configs).find(([key]) => tipo.includes(key))
        ? configs[Object.keys(configs).find(k => tipo.includes(k)) as keyof typeof configs]
        : { icon: Brain, color: 'text-blue-600', bg: 'bg-blue-50', title: 'Relatório Inteligente' };

    const Icon = config.icon;

    return (
        <Card className="hover:shadow-xl transition-shadow duration-300 border-l-4 border-l-blue-500">
            <CardHeader>
                <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-full ${config.bg}`}>
                        <Icon className={`w-8 h-8 ${config.color}`} />
                    </div>
                    <div>
                        <CardTitle className="text-xl">{config.title}</CardTitle>
                        <p className="text-sm text-gray-500 mt-1">
                            Gerado em {new Date(criado_em).toLocaleString('pt-BR')}
                        </p>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="prose prose-sm max-w-none">
          <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-gray-700 bg-gray-50 p-4 rounded-lg">
            {conteudo}
          </pre>
                </div>
            </CardContent>
        </Card>
    );
}