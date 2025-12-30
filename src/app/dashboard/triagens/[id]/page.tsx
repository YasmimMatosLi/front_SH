'use client';

import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useTriagem } from '@/hooks/useTriagem';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {ArrowLeft, Edit, Activity, Droplet, Stethoscope, Thermometer, User, Calendar} from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { Papeis } from '@/types';
import { RequireRole } from '@/components/RequireRole';

const getRiscoBadge = (risco: string) => {
    const colors: Record<string, string> = {
        VERMELHO: 'bg-red-600 text-white',
        LARANJA: 'bg-orange-500 text-white',
        AMARELO: 'bg-yellow-500 text-black',
        VERDE: 'bg-green-600 text-white',
        AZUL: 'bg-blue-600 text-white',
    };
    return (
        <Badge className={`text-lg px-6 py-2 font-bold ${colors[risco] || 'bg-gray-500 text-white'}`}>
            {risco}
        </Badge>
    );
};

export default function TriagemDetalhesPage() {
    const params = useParams();
    const id = params.id as string;

    const { data: triagem, isLoading, isError } = useTriagem(id);

    if (isLoading) {
        return (
            <div className="space-y-10 pb-12">
                <Header title="Carregando triagem..." />
                <div className="space-y-6">
                    <Skeleton className="h-12 w-96 rounded-xl" />
                    <Skeleton className="h-64 w-full rounded-xl" />
                    <Skeleton className="h-48 w-full rounded-xl" />
                </div>
            </div>
        );
    }

    if (isError || !triagem) {
        return (
            <div className="space-y-10 pb-12">
                <Header title="Triagem não encontrada" />
                <Card className="border-red-200 bg-red-50">
                    <CardContent className="pt-10 text-center">
                        <p className="text-xl mb-8">Não foi possível carregar os dados da triagem.</p>
                        <Link href="/dashboard/triagens">
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
        <RequireRole allowedRoles={[Papeis.ADMINISTRADOR_PRINCIPAL, Papeis.ENFERMEIRO]}>
            <div className="space-y-10 pb-12">
                <Header
                    title={`Triagem #${triagem.id.slice(0, 8)}`}
                    description={formatDate(triagem.data_triagem)}
                    actionLabel="Voltar"
                    actionHref="/dashboard/triagens"
                />

                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-6">
                        <Activity className="h-12 w-12 text-orange-600" />
                        <div>
                            <h1 className="text-4xl font-bold flex items-center gap-4">
                                Classificação de Risco
                                {getRiscoBadge(triagem.nivel_gravidade)}
                            </h1>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3">
                                <User className="h-6 w-6 text-blue-600" />
                                Paciente
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-xl font-semibold">{triagem.paciente_nome}</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3">
                                <Stethoscope className="h-6 w-6 text-green-600" />
                                Enfermeiro
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-xl font-semibold">{triagem.enfermeiro_nome}</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3">
                                <Calendar className="h-6 w-6 text-purple-600" />
                                Data da Triagem
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-xl font-semibold">{formatDate(triagem.data_triagem)}</p>
                        </CardContent>
                    </Card>
                </div>

                <Card className="mt-8">
                    <CardHeader>
                        <CardTitle>Sinais Vitais</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            <div className="flex items-center gap-4">
                                <Activity className="h-10 w-10 text-red-500" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Pressão Arterial</p>
                                    <p className="text-2xl font-bold">
                                        {triagem.sinais_vitais.pressaoArterialSistolica && triagem.sinais_vitais.pressaoArterialDiastolica
                                            ? `${triagem.sinais_vitais.pressaoArterialSistolica}/${triagem.sinais_vitais.pressaoArterialDiastolica}`
                                            : '—'}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <Activity className="h-10 w-10 text-orange-500" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Frequência Cardíaca</p>
                                    <p className="text-2xl font-bold">{triagem.sinais_vitais.frequenciaCardiaca || '—'} bpm</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <Thermometer className="h-10 w-10 text-blue-500" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Temperatura</p>
                                    <p className="text-2xl font-bold">{triagem.sinais_vitais.temperatura || '—'} °C</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <Droplet className="h-10 w-10 text-cyan-500" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Saturação O₂</p>
                                    <p className="text-2xl font-bold">{triagem.sinais_vitais.saturacaoOxigenio || '—'} %</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="mt-8">
                    <CardHeader>
                        <CardTitle>Queixa Principal</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-lg leading-relaxed whitespace-pre-wrap">
                            {triagem.queixa_principal || 'Não registrada.'}
                        </p>
                    </CardContent>
                </Card>

                <div className="flex justify-end mt-8">
                    <Link href={`/dashboard/triagens/${id}/editar`}>
                        <Button size="lg">
                            <Edit className="mr-2 h-5 w-5" />
                            Editar Triagem
                        </Button>
                    </Link>
                </div>
            </div>
        </RequireRole>
    );
}