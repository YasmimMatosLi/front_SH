// src/app/dashboard/pacientes/[id]/page.tsx
import { usePaciente, usePacienteHistorico } from '@/hooks/usePaciente';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatCPF, formatTelefone, formatDate } from '@/lib/utils';
import { Phone, Mail, MapPin, Activity, FileText } from 'lucide-react';
import Link from 'next/link';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import {Papeis} from "@/types";
import {RequireRole} from "@/components/RequireRole";

type Props = {
    params: { id: string };
};

export default function PacienteDetalhesPage({ params }: Props) {
    const { data: paciente, isLoading: loadingPaciente } = usePaciente(params.id);
    const { data: historico, isLoading: loadingHistorico } = usePacienteHistorico(params.id);

    if (loadingPaciente || loadingHistorico) return <LoadingSpinner />;

    if (!paciente) return <div>Paciente não encontrado</div>;

    return (
        <RequireRole allowedRoles={[Papeis.ADMINISTRADOR_PRINCIPAL, Papeis.MEDICO, Papeis.ENFERMEIRO]}>
            <div className="space-y-8">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold">{paciente.nome}</h1>
                        <p className="text-muted-foreground mt-2">Detalhes e histórico completo</p>
                    </div>
                    <Link href={`/dashboard/pacientes/${paciente.id}/editar`}>
                        <Button>Editar Paciente</Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Dados Pessoais */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="w-5 h-5" />
                                Dados Pessoais
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-sm text-muted-foreground">CPF</p>
                                <p className="font-medium">{formatCPF(paciente.cpf)}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">CNS</p>
                                <p className="font-medium">{paciente.cns}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Data de Nascimento</p>
                                <p className="font-medium">{formatDate(paciente.dataNascimento)}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Sexo</p>
                                <p className="font-medium">{paciente.sexo}</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Endereço */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <MapPin className="w-5 h-5" />
                                Endereço
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <p>{paciente.endereco.logradouro}, {paciente.endereco.numero}</p>
                            <p>{paciente.endereco.bairro} - {paciente.endereco.cidade}/{paciente.endereco.estado}</p>
                            <p>CEP: {paciente.endereco.cep}</p>
                        </CardContent>
                    </Card>

                    {/* Contato e Risco */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Phone className="w-5 h-5" />
                                Contato e Risco
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-2">
                                <Phone className="w-4 h-4 text-muted-foreground" />
                                <span>{formatTelefone(paciente.telefone)}</span>
                            </div>
                            {paciente.email && (
                                <div className="flex items-center gap-2">
                                    <Mail className="w-4 h-4 text-muted-foreground" />
                                    <span>{paciente.email}</span>
                                </div>
                            )}
                            <div>
                                <p className="text-sm text-muted-foreground mb-2">Grupos de Risco</p>
                                {paciente.gruposRisco.length > 0 ? (
                                    <div className="flex flex-wrap gap-2">
                                        {paciente.gruposRisco.map((g) => (
                                            <Badge key={g} variant="destructive">
                                                {g}
                                            </Badge>
                                        ))}
                                    </div>
                                ) : (
                                    <span className="text-muted-foreground">Nenhum</span>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Histórico */}
                <div className="space-y-8">
                    <section>
                        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                            <Activity className="w-6 h-6 text-red-600" />
                            Triagens ({historico?.triagens?.length || 0})
                        </h2>
                        {historico?.triagens?.length === 0 ? (
                            <p className="text-muted-foreground">Nenhuma triagem registrada</p>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {historico.triagens.slice(0, 4).map((t: any) => (
                                    <Card key={t.id}>
                                        <CardContent className="pt-6">
                                            <div className="flex justify-between items-start mb-2">
                                                <Badge variant={t.nivel_gravidade === 'VERMELHO' ? 'destructive' : 'default'}>
                                                    {t.nivel_gravidade}
                                                </Badge>
                                                <span className="text-sm text-muted-foreground">{formatDate(t.createdAt)}</span>
                                            </div>
                                            <p className="font-medium">Queixa: {t.queixa_principal}</p>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                            <Activity className="w-6 h-6 text-blue-600" />
                            Consultas ({historico?.consultas?.length || 0})
                        </h2>
                        {historico?.consultas?.length === 0 ? (
                            <p className="text-muted-foreground">Nenhuma consulta registrada</p>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {historico.consultas.slice(0, 4).map((c: any) => (
                                    <Card key={c.id}>
                                        <CardContent className="pt-6">
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="text-sm text-muted-foreground">{formatDate(c.dataConsulta)}</span>
                                            </div>
                                            <p className="font-medium">Motivo: {c.motivoConsulta}</p>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                            <Activity className="w-6 h-6 text-green-600" />
                            Prescrições ({historico?.prescricoes?.length || 0})
                        </h2>
                        {historico?.prescricoes?.length === 0 ? (
                            <p className="text-muted-foreground">Nenhuma prescrição registrada</p>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {historico.prescricoes.slice(0, 4).map((p: any) => (
                                    <Card key={p.id}>
                                        <CardContent className="pt-6">
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="text-sm text-muted-foreground">{formatDate(p.dataPrescricao)}</span>
                                            </div>
                                            <p className="font-medium">Médico: {p.medicoNome}</p>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                            <Activity className="w-6 h-6 text-purple-600" />
                            Prontuários ({historico?.prontuarios?.length || 0})
                        </h2>
                        {historico?.prontuarios?.length === 0 ? (
                            <p className="text-muted-foreground">Nenhum prontuário registrado</p>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {historico.prontuarios.slice(0, 4).map((pr: any) => (
                                    <Card key={pr.id}>
                                        <CardContent className="pt-6">
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="text-sm text-muted-foreground">{formatDate(pr.createdAt)}</span>
                                            </div>
                                            <p className="font-medium">Descrição: {pr.descricao}</p>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </RequireRole>
    );
}