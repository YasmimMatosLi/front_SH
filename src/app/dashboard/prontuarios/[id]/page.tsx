// src/app/dashboard/prontuarios/[id]/page.tsx
import { useProntuario } from '@/hooks/useProntuario';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';
import { FileDown, User, Stethoscope, Calendar } from 'lucide-react';
import Link from 'next/link';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import {Metadata} from "next";
import { RequireRole } from "@/components/RequireRole";
import {Papeis} from "@/types";

type Props = {
    params: { id: string };
};

export const metadata: Metadata = {
    title: 'Detalhes do Prontuário - Hospital IA',
};

export default function ProntuarioDetalhesPage({ params }: Props) {
    const { data: prontuario, isLoading } = useProntuario(params.id);

    if (isLoading) return <LoadingSpinner />;

    if (!prontuario) return <div className="text-center py-12 text-muted-foreground">Registro não encontrado</div>;

    return (
        <RequireRole allowedRoles={[Papeis.ADMINISTRADOR_PRINCIPAL, Papeis.MEDICO, Papeis.ENFERMEIRO]}>
        <div className="space-y-8">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold">Prontuário Clínico</h1>
                    <p className="text-muted-foreground mt-2">Registro de atendimento do paciente</p>
                </div>
                <div className="flex gap-3">
                    <Button asChild>
                        <Link href={`/dashboard/prontuarios/${prontuario.id}/pdf`}>
                            <FileDown className="mr-2 h-4 w-4" />
                            Baixar PDF
                        </Link>
                    </Button>
                    <Link href={`/dashboard/prontuarios/${prontuario.id}/editar`}>
                        <Button>Editar</Button>
                    </Link>
                </div>
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
                        <p className="font-medium text-lg">{prontuario.paciente_nome}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Stethoscope className="w-5 h-5" />
                            Profissional
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="font-medium text-lg">{prontuario.profissional_nome}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Calendar className="w-5 h-5" />
                            Data do Registro
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="font-medium">{formatDate(prontuario.createdAt)}</p>
                        {prontuario.cid10 && <p className="text-sm text-muted-foreground mt-2">CID-10: {prontuario.cid10}</p>}
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Evolução Clínica</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="bg-muted/30 border rounded-lg p-6">
                        <p className="whitespace-pre-wrap text-lg leading-relaxed">
                            {prontuario.descricao}
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
        </RequireRole>
    );
}