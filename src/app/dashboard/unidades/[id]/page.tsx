// src/app/dashboard/unidades/[id]/page.tsx
'use client';

import { useUnidadeSaude, useFuncionariosUnidade, useAssociarFuncionario } from '@/hooks/useUnidadeSaude';
import { useMedicos, useEnfermeiros } from '@/hooks';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Building2, MapPin, Users } from 'lucide-react';
import Link from 'next/link';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { toast } from 'sonner';
import { RequireRole } from "@/components/RequireRole";
import {Papeis} from "@/types";

type Props = {
    params: { id: string };
};

export default function UnidadeDetalhesPage({ params }: Props) {
    const { data: unidade, isLoading: loadingUnidade } = useUnidadeSaude(params.id);
    const { data: funcionarios, isLoading: loadingFuncionarios } = useFuncionariosUnidade(params.id);
    const { data: medicos } = useMedicos();
    const { data: enfermeiros } = useEnfermeiros();
    const associar = useAssociarFuncionario();

    const handleAssociar = (funcionarioId: string) => {
        associar.mutate(
            { unidadeId: params.id, funcionarioId },
            {
                onSuccess: () => toast.success('Funcionário associado com sucesso!'),
                onError: () => toast.error('Erro ao associar funcionário'),
            }
        );
    };

    if (loadingUnidade || loadingFuncionarios) return <LoadingSpinner />;

    if (!unidade) return <div>Unidade não encontrada</div>;

    return (
        <RequireRole allowedRoles={[Papeis.ADMINISTRADOR_PRINCIPAL]}>
        <div className="space-y-8">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold">{unidade.nome}</h1>
                    <p className="text-muted-foreground mt-2">Detalhes e equipe da unidade</p>
                </div>
                <Link href={`/dashboard/unidades/${unidade.id}/editar`}>
                    <Button>Editar Unidade</Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Building2 className="w-5 h-5" />
                            Informações Gerais
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <p className="text-sm text-muted-foreground">Tipo</p>
                            <Badge>{unidade.tipo}</Badge>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">CNES</p>
                            <p className="font-medium">{unidade.cnes}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Telefone</p>
                            <p className="font-medium">{unidade.telefone}</p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <MapPin className="w-5 h-5" />
                            Endereço
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <p>{unidade.endereco.logradouro}, {unidade.endereco.numero}</p>
                        <p>{unidade.endereco.bairro}</p>
                        <p>{unidade.endereco.cidade}/{unidade.endereco.estado} - CEP: {unidade.endereco.cep}</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Users className="w-5 h-5" />
                        Equipe ({funcionarios?.length || 0} funcionários)
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {funcionarios?.length === 0 ? (
                        <p className="text-muted-foreground">Nenhum funcionário associado</p>
                    ) : (
                        <div className="space-y-2">
                            {funcionarios?.map((f: any) => (
                                <div key={f.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                                    <span>{f.nome} ({f.tipo === 'MEDICO' ? 'Médico' : 'Enfermeiro'})</span>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="mt-6">
                        <h4 className="font-medium mb-3">Adicionar funcionário</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {medicos?.map((m) => (
                                <Button
                                    key={m.id}
                                    variant="outline"
                                    onClick={() => handleAssociar(m.id)}
                                    disabled={associar.isPending}
                                >
                                    + {m.nome} (Médico)
                                </Button>
                            ))}
                            {enfermeiros?.map((e) => (
                                <Button
                                    key={e.id}
                                    variant="outline"
                                    onClick={() => handleAssociar(e.id)}
                                    disabled={associar.isPending}
                                >
                                    + {e.nome} (Enfermeiro)
                                </Button>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
        </RequireRole>
    );
}