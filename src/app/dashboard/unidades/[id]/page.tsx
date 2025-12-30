'use client';

import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useUnidadeSaude, useFuncionariosUnidade } from '@/hooks/useUnidadeSaude';
import { useMedicos, useEnfermeiros } from '@/hooks';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Edit, Building2, MapPin, Users, Phone } from 'lucide-react';
import { toast } from 'sonner';
import { useAssociarFuncionario } from '@/hooks/useUnidadeSaude';
import { Papeis } from '@/types';
import { RequireRole } from '@/components/RequireRole';

export default function UnidadeDetalhesPage() {
    const params = useParams();
    const id = params.id as string;

    const { data: unidade, isLoading: loadingUnidade } = useUnidadeSaude(id);
    const { data: funcionarios, isLoading: loadingFuncionarios } = useFuncionariosUnidade(id);
    const { data: medicos } = useMedicos();
    const { data: enfermeiros } = useEnfermeiros();
    const associar = useAssociarFuncionario();

    const handleAssociar = (funcionarioId: string) => {
        associar.mutate(
            { unidadeId: id, funcionarioId },
            {
                onSuccess: () => toast.success('Funcionário associado com sucesso!'),
                onError: () => toast.error('Erro ao associar funcionário'),
            }
        );
    };

    if (loadingUnidade || loadingFuncionarios) {
        return (
            <div className="space-y-10 pb-12">
                <Header title="Carregando unidade..." />
                <div className="space-y-6">
                    <Skeleton className="h-12 w-96 rounded-xl" />
                    <Skeleton className="h-64 w-full rounded-xl" />
                    <Skeleton className="h-48 w-full rounded-xl" />
                </div>
            </div>
        );
    }

    if (!unidade) {
        return (
            <div className="space-y-10 pb-12">
                <Header title="Unidade não encontrada" />
                <Card className="border-red-200 bg-red-50">
                    <CardContent className="pt-10 text-center">
                        <p className="text-xl mb-8">A unidade solicitada não foi encontrada.</p>
                        <Link href="/dashboard/unidades">
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
        <RequireRole allowedRoles={[Papeis.ADMINISTRADOR_PRINCIPAL]}>
            <div className="space-y-10 pb-12">
                <Header
                    title={unidade.nome}
                    description={`CNES: ${unidade.cnes}`}
                    actionLabel="Voltar"
                    actionHref="/dashboard/unidades"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3">
                                <Building2 className="h-6 w-6 text-teal-600" />
                                Informações Gerais
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center gap-3">
                                <Badge className="text-lg px-4 py-1">{unidade.tipo}</Badge>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">CNES</p>
                                <p className="text-xl font-semibold font-mono">{unidade.cnes}</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <Phone className="h-5 w-5 text-muted-foreground" />
                                <span className="text-lg">{unidade.telefone}</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3">
                                <MapPin className="h-6 w-6 text-orange-600" />
                                Endereço
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-lg">
                            <p>{unidade.endereco.logradouro}, {unidade.endereco.numero}</p>
                            <p>{unidade.endereco.bairro}</p>
                            <p>{unidade.endereco.cidade} - {unidade.endereco.estado}</p>
                            <p>CEP: {unidade.endereco.cep}</p>
                        </CardContent>
                    </Card>
                </div>

                <Card className="mt-8">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-3">
                            <Users className="h-6 w-6 text-purple-600" />
                            Equipe ({funcionarios?.length || 0} funcionários)
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {funcionarios && funcionarios.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {funcionarios.map((f: any) => (
                                    <div key={f.id} className="flex items-center justify-between p-4 bg-muted/40 rounded-lg">
                                        <div>
                                            <p className="font-semibold">{f.nome}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {f.tipo === 'MEDICO' ? 'Médico' : 'Enfermeiro'}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-muted-foreground py-8 text-center">
                                Nenhum funcionário associado à unidade.
                            </p>
                        )}

                        {(medicos || enfermeiros) && (medicos!.length > 0 || enfermeiros!.length > 0) && (
                            <div className="mt-8 pt-8 border-t">
                                <h4 className="text-lg font-semibold mb-4">Adicionar à equipe</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {medicos?.map((m: any) => (
                                        <Button
                                            key={m.id}
                                            variant="outline"
                                            onClick={() => handleAssociar(m.id)}
                                            disabled={associar.isPending}
                                            className="justify-start"
                                        >
                                            + {m.nome} (Médico)
                                        </Button>
                                    ))}
                                    {enfermeiros?.map((e: any) => (
                                        <Button
                                            key={e.id}
                                            variant="outline"
                                            onClick={() => handleAssociar(e.id)}
                                            disabled={associar.isPending}
                                            className="justify-start"
                                        >
                                            + {e.nome} (Enfermeiro)
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <div className="flex justify-end mt-8">
                    <Link href={`/dashboard/unidades/${id}/editar`}>
                        <Button size="lg">
                            <Edit className="mr-2 h-5 w-5" />
                            Editar Unidade
                        </Button>
                    </Link>
                </div>
            </div>
        </RequireRole>
    );
}