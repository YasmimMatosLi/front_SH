// src/app/dashboard/ia/recorrente/[pacienteId]/page.tsx
'use client';

import { usePaciente } from '@/hooks/usePaciente';
import { useAnalisarRecorrente } from '@/hooks/useIA';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from '@/components/Header';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import {Papeis} from "@/types";
import {RequireRole} from "@/components/RequireRole";

type Props = {
    params: { pacienteId: string };
};

export default function RecorrentePage({ params }: Props) {
    const { data: paciente, isLoading: loadingPaciente } = usePaciente(params.pacienteId);
    const { mutate: analisar, data: analiseTexto, isPending } = useAnalisarRecorrente();

    const handleAnalisar = () => {
        analisar(params.pacienteId, {
            onSuccess: () => toast.success('Análise gerada com sucesso!'),
            onError: (err: Error) => toast.error(`Erro: ${err.message}`),
        });
    };

    if (loadingPaciente) return <LoadingSpinner />;
    if (!paciente) return <div>Paciente não encontrado</div>;

    return (
        <RequireRole allowedRoles={[Papeis.ADMINISTRADOR_PRINCIPAL, Papeis.MEDICO, Papeis.ENFERMEIRO]}>
        <div className="space-y-8">
            <Header title="Análise Recorrente" description={`Paciente: ${paciente.nome}`} />

            <Card>
                <CardHeader>
                    <CardTitle>Gerar Análise de Recorrência</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <Button onClick={handleAnalisar} disabled={isPending} size="lg">
                        {isPending ? 'Analisando...' : 'Gerar Análise Recorrente'}
                    </Button>

                    {analiseTexto && (
                        <Card className="mt-8 bg-muted/30">
                            <CardHeader>
                                <CardTitle>Análise Gerada</CardTitle>
                            </CardHeader>
                            <CardContent className="prose max-w-none">
                                <div dangerouslySetInnerHTML={{ __html: analiseTexto.replace(/\n/g, '<br/>') }} />
                            </CardContent>
                        </Card>
                    )}
                </CardContent>
            </Card>
        </div>
        </RequireRole>
    );
}