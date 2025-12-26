// src/app/dashboard/enfermeiros/[id]/page.tsx
import { useEnfermeiro } from '@/hooks/useEnfermeiro';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatCPF, formatTelefone, formatDate } from '@/lib/utils';
import { Phone, Mail, UserPlus, FileText } from 'lucide-react';
import Link from 'next/link';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import {Papeis} from "@/types";
import {RequireRole} from "@/components/RequireRole";

type Props = {
    params: { id: string };
};

export default function EnfermeiroDetalhesPage({ params }: Props) {
    const { data: enfermeiro, isLoading } = useEnfermeiro(params.id);

    if (isLoading) return <LoadingSpinner />;

    if (!enfermeiro) return <div className="text-center py-12 text-muted-foreground">Enfermeiro não encontrado</div>;

    return (
        <RequireRole allowedRoles={[Papeis.ADMINISTRADOR_PRINCIPAL]}>
        <div className="space-y-8">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold">{enfermeiro.nome}</h1>
                    <p className="text-muted-foreground mt-2">Detalhes do enfermeiro</p>
                </div>
                <Link href={`/dashboard/enfermeiros/${enfermeiro.id}/editar`}>
                    <Button>Editar Enfermeiro</Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <UserPlus className="w-5 h-5" />
                            Dados Profissionais
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <p className="text-sm text-muted-foreground">COREN</p>
                            <p className="font-medium">{enfermeiro.coren}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Data de Contratação</p>
                            <p className="font-medium">{formatDate(enfermeiro.dataContratacao)}</p>
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
                            <p className="font-medium">{formatCPF(enfermeiro.cpf)}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Data de Nascimento</p>
                            <p className="font-medium">{formatDate(enfermeiro.dataNascimento)}</p>
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
                            <span>{formatTelefone(enfermeiro.telefone)}</span>
                        </div>
                        {enfermeiro.email && (
                            <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4 text-muted-foreground" />
                                <span>{enfermeiro.email}</span>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
        </RequireRole>
    );
}