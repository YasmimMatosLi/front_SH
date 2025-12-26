// src/app/dashboard/ia/triagens/page.tsx
'use client';

import {useState} from 'react';
import {useUnidadesSaude} from '@/hooks/useUnidadeSaude';
import {useGerarTriagens} from '@/hooks/useIA';
import {toast} from 'sonner';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Header} from '@/components/Header';
import {RequireRole} from "@/components/RequireRole";
import {Papeis} from "@/types";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Button} from "@/components/ui/button";

export default function TriagensUnidadePage() {
    const [unidadeId, setUnidadeId] = useState<string | undefined>(undefined);
    const { data: unidades } = useUnidadesSaude();
    const { mutate: gerarTriagens, data: relatorioTexto, isPending } = useGerarTriagens();

    const handleGerar = () => {
        if (!unidadeId) return toast.error('Selecione uma unidade');
        gerarTriagens(unidadeId, {
            onSuccess: () => toast.success('Relatório gerado!'),
            onError: (err: Error) => toast.error(`Erro: ${err.message}`),
        });
    };

    return (
        <RequireRole allowedRoles={[Papeis.ADMINISTRADOR_PRINCIPAL, Papeis.ENFERMEIRO]}>
        <div className="space-y-8">
            <Header title="Análise de Triagens por Unidade" description="Risco de sobrecarga e distribuição de gravidade" />

            <Card>
                <CardHeader>
                    <CardTitle>Gerar Relatório</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium mb-2">Unidade de Saúde</label>
                        <Select onValueChange={setUnidadeId} value={unidadeId}>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione a unidade" />
                            </SelectTrigger>
                            <SelectContent>
                                {unidades?.map(u => (
                                    <SelectItem key={u.id} value={u.id}>
                                        {u.nome}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <Button onClick={handleGerar} disabled={isPending} size="lg">
                        {isPending ? 'Gerando...' : 'Gerar Análise de Triagens'}
                    </Button>

                    {relatorioTexto && (
                        <Card className="mt-8 bg-muted/30">
                            <CardHeader>
                                <CardTitle>Relatório Gerado</CardTitle>
                            </CardHeader>
                            <CardContent className="prose max-w-none">
                                <div dangerouslySetInnerHTML={{ __html: relatorioTexto.replace(/\n/g, '<br/>') }} />
                            </CardContent>
                        </Card>
                    )}
                </CardContent>
            </Card>
        </div>
        </RequireRole>
    );
}