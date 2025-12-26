// src/app/dashboard/ia/surto/page.tsx
'use client';

import { useState } from 'react';
import { useUnidadesSaude } from '@/hooks/useUnidadeSaude';
import { useGerarSurto } from '@/hooks/useIA';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from '@/components/Header';
import {Papeis} from "@/types";
import {RequireRole} from "@/components/RequireRole";

export default function SurtoPage() {
    const [unidadeId, setUnidadeId] = useState<string | undefined>(undefined);
    const { data: unidades } = useUnidadesSaude();
    const { mutate: gerarSurto, data: relatorioTexto, isPending } = useGerarSurto();

    const handleGerar = () => {
        gerarSurto(unidadeId, {
            onSuccess: () => toast.success('Relatório gerado com sucesso!'),
            onError: (err: Error) => toast.error(`Erro: ${err.message}`),
        });
    };

    return (
        <RequireRole allowedRoles={[Papeis.ADMINISTRADOR_PRINCIPAL, Papeis.MEDICO, Papeis.ENFERMEIRO]}>
        <div className="space-y-8">
            <Header title="Relatório de Surto Respiratório" description="Análise de risco de surto por unidade ou global" />

            <Card>
                <CardHeader>
                    <CardTitle>Gerar Relatório</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium mb-2">Unidade de Saúde (opcional)</label>
                        <Select onValueChange={setUnidadeId} value={unidadeId}>
                            <SelectTrigger>
                                <SelectValue placeholder="Todas as unidades (global)" />
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
                        {isPending ? 'Gerando...' : 'Gerar Relatório de Surto'}
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