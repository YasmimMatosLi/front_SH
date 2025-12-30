'use client';

import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useProntuario } from '@/hooks/useProntuario';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Edit, FileDown, User, Stethoscope, Calendar } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { Papeis } from '@/types';
import { RequireRole } from '@/components/RequireRole';

export default function ProntuarioDetalhesPage() {
    const params = useParams();
    const id = params.id as string;

    const { data: prontuario, isLoading, isError } = useProntuario(id);

    if (isLoading) {
        return (
            <div className="space-y-10 pb-12">
                <Header title="Carregando prontuário..." />
                <div className="space-y-6">
                    <Skeleton className="h-12 w-96 rounded-xl" />
                    <Skeleton className="h-64 w-full rounded-xl" />
                    <Skeleton className="h-48 w-full rounded-xl" />
                </div>
            </div>
        );
    }

    if (isError || !prontuario) {
        return (
            <div className="space-y-10 pb-12">
                <Header title="Prontuário não encontrado" />
                <Card className="border-red-200 bg-red-50">
                    <CardContent className="pt-10 text-center">
                        <p className="text-xl mb-8">Não foi possível carregar o registro clínico.</p>
                        <Link href="/dashboard/prontuarios">
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
        <RequireRole allowedRoles={[Papeis.ADMINISTRADOR_PRINCIPAL, Papeis.MEDICO, Papeis.ENFERMEIRO]}>
            <div className="space-y-10 pb-12">
                <Header
                    title={`Prontuário Clínico #${prontuario.id.slice(0, 8)}`}
                    description={`Registro de ${prontuario.paciente_nome}`}
                    actionLabel="Voltar"
                    actionHref="/dashboard/prontuarios"
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3">
                                <User className="h-6 w-6 text-blue-600" />
                                Paciente
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-xl font-semibold">{prontuario.paciente_nome}</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3">
                                <Stethoscope className="h-6 w-6 text-green-600" />
                                Profissional
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-xl font-semibold">{prontuario.profissional_nome}</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3">
                                <Calendar className="h-6 w-6 text-purple-600" />
                                Data do Registro
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-xl font-semibold">{formatDate(prontuario.createdAt)}</p>
                            {prontuario.cid10 && (
                                <p className="text-sm text-muted-foreground mt-2">
                                    <strong>CID-10:</strong> {prontuario.cid10}
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <Card className="mt-8">
                    <CardHeader>
                        <CardTitle>Evolução Clínica</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="bg-muted/30 border rounded-xl p-8">
                            <p className="whitespace-pre-wrap text-lg leading-relaxed">
                                {prontuario.descricao || 'Nenhuma descrição registrada.'}
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-end gap-4">
                    <Button asChild size="lg">
                        <Link href={`/dashboard/prontuarios/${id}/pdf`}>
                            <FileDown className="mr-2 h-5 w-5" />
                            Baixar PDF
                        </Link>
                    </Button>
                    <Link href={`/dashboard/prontuarios/${id}/editar`}>
                        <Button size="lg">
                            <Edit className="mr-2 h-5 w-5" />
                            Editar Prontuário
                        </Button>
                    </Link>
                </div>
            </div>
        </RequireRole>
    );
}