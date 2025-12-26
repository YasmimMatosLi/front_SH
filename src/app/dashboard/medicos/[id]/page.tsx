// src/app/dashboard/medicos/[id]/page.tsx
import { useMedico } from '@/hooks/useMedico';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatCPF, formatTelefone, formatDate } from '@/lib/utils';
import {Phone, Mail, Stethoscope, FileText} from 'lucide-react';
import Link from 'next/link';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import {Papeis} from "@/types";
import {RequireRole} from "@/components/RequireRole";

type Props = {
    params: { id: string };
};

export default function MedicoDetalhesPage({ params }: Props) {
    const { data: medico, isLoading } = useMedico(params.id);

    if (isLoading) return <LoadingSpinner />;

    if (!medico) return <div>Médico não encontrado</div>;

    return (
        <RequireRole allowedRoles={[Papeis.ADMINISTRADOR_PRINCIPAL]}>
        <div className="space-y-8">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold">{medico.nome}</h1>
                    <p className="text-muted-foreground mt-2">Detalhes do médico</p>
                </div>
                <Link href={`/dashboard/medicos/${medico.id}/editar`}>
                    <Button>Editar Médico</Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Stethoscope className="w-5 h-5" />
                            Dados Profissionais
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <p className="text-sm text-muted-foreground">CRM</p>
                            <p className="font-medium">{medico.crm}</p>
                        </div>
                    </CardContent>
                </Card>

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
                            <p className="font-medium">{formatCPF(medico.cpf)}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Data de Nascimento</p>
                            <p className="font-medium">{formatDate(medico.dataNascimento)}</p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Phone className="w-5 h-5" />
                            Contato
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-muted-foreground" />
                            <span>{formatTelefone(medico.telefone)}</span>
                        </div>
                        {medico.email && (
                            <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4 text-muted-foreground" />
                                <span>{medico.email}</span>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
        </RequireRole>
    );
}