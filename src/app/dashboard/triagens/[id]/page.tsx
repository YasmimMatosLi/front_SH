// src/app/dashboard/triagens/[id]/page.tsx
import {useTriagem} from '@/hooks/useTriagem';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {Badge} from '@/components/ui/badge';
import {formatDate} from '@/lib/utils';
import {Activity, AlertCircle, Droplet, Stethoscope, Thermometer, User} from 'lucide-react';
import Link from 'next/link';
import {LoadingSpinner} from '@/components/LoadingSpinner';
import {Metadata} from "next";
import {RequireRole} from "@/components/RequireRole";
import {Papeis} from "@/types";

type Props = {
    params: { id: string };
};

export const metadata: Metadata = {
    title: 'Detalhes da Triagem - Hospital IA',
};

const getRiscoBadge = (risco: string) => {
    const variants: Record<string, 'destructive' | 'default' | 'secondary' | 'outline'> = {
        VERMELHO: 'destructive',
        LARANJA: 'default',
        AMARELO: 'secondary',
        VERDE: 'outline',
        AZUL: 'outline',
    };
    return <Badge variant={variants[risco] || 'outline'} className="text-lg py-1 px-3">{risco}</Badge>;
};

export default function TriagemDetalhesPage({ params }: Props) {
    const { data: triagem, isLoading } = useTriagem(params.id);

    if (isLoading) return <LoadingSpinner />;

    if (!triagem) return <div className="text-center py-12 text-muted-foreground">Triagem não encontrada</div>;

    return (
        <RequireRole allowedRoles={[Papeis.ADMINISTRADOR_PRINCIPAL, Papeis.ENFERMEIRO]}>
        <div className="space-y-8">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        Triagem #{triagem.id}
                        <span className="ml-4">{getRiscoBadge(triagem.nivel_gravidade)}</span>
                    </h1>
                    <p className="text-muted-foreground mt-2">Detalhes da triagem do paciente</p>
                </div>
                <Link href={`/dashboard/triagens/${triagem.id}/editar`}>
                    <Button>Editar Triagem</Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="w-5 h-5" />
                            Paciente
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="font-medium text-lg">{triagem.paciente_nome}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Stethoscope className="w-5 h-5" />
                            Enfermeiro
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="font-medium text-lg">{triagem.enfermeiro_nome}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <AlertCircle className="w-5 h-5" />
                            Data da Triagem
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="font-medium">{formatDate(triagem.createdAt)}</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Sinais Vitais</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="flex items-center gap-3">
                        <Activity className="w-8 h-8 text-red-500" />
                        <div>
                            <p className="text-sm text-muted-foreground">Pressão Arterial</p>
                            <p className="font-semibold">
                                {triagem.sinais_vitais.pressaoArterialSistolica && triagem.sinais_vitais.pressaoArterialDiastolica
                                    ? `${triagem.sinais_vitais.pressaoArterialSistolica}/${triagem.sinais_vitais.pressaoArterialDiastolica}`
                                    : '—'}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Activity className="w-8 h-8 text-orange-500" />
                        <div>
                            <p className="text-sm text-muted-foreground">Freq. Cardíaca</p>
                            <p className="font-semibold">{triagem.sinais_vitais.frequenciaCardiaca || '—'} bpm</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Thermometer className="w-8 h-8 text-blue-500" />
                        <div>
                            <p className="text-sm text-muted-foreground">Temperatura</p>
                            <p className="font-semibold">{triagem.sinais_vitais.temperatura || '—'} °C</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Droplet className="w-8 h-8 text-cyan-500" />
                        <div>
                            <p className="text-sm text-muted-foreground">Sat. O₂</p>
                            <p className="font-semibold">{triagem.sinais_vitais.saturacaoOxigenio || '—'} %</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Queixa Principal</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="whitespace-pre-wrap">{triagem.queixa_principal}</p>
                </CardContent>
            </Card>
        </div>
        </RequireRole>
    );
}