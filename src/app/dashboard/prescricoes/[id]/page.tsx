// src/app/dashboard/prescricoes/[id]/page.tsx
import { usePrescricao } from '@/hooks/usePrescricao';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';
import { FileDown, User, Stethoscope, Calendar, Pill } from 'lucide-react';
import Link from 'next/link';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import {Metadata} from "next";
import {Papeis} from "@/types";
import {RequireRole} from "@/components/RequireRole";

type Props = {
    params: { id: string };
};

export const metadata: Metadata = {
    title: 'Detalhes da Prescrição - Hospital IA',
};

export default function PrescricaoDetalhesPage({ params }: Props) {
    const { data: prescricao, isLoading } = usePrescricao(params.id);

    if (isLoading) return <LoadingSpinner />;

    if (!prescricao) return <div className="text-center py-12 text-muted-foreground">Prescrição não encontrada</div>;

    return (
        <RequireRole allowedRoles={[Papeis.ADMINISTRADOR_PRINCIPAL, Papeis.MEDICO]}>
        <div className="space-y-8">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold">Prescrição #{prescricao.id.slice(0, 8)}</h1>
                    <p className="text-muted-foreground mt-2">Detalhes da prescrição médica</p>
                </div>
                <div className="flex gap-3">
                    <Button asChild>
                        <Link href={`/dashboard/prescricoes/${prescricao.id}/pdf`}>
                            <FileDown className="mr-2 h-4 w-4" />
                            Baixar PDF
                        </Link>
                    </Button>
                    <Link href={`/dashboard/prescricoes/${prescricao.id}/editar`}>
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
                        <p className="font-medium text-lg">{prescricao.paciente_nome}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Stethoscope className="w-5 h-5" />
                            Médico Responsável
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="font-medium text-lg">{prescricao.medico_nome}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Calendar className="w-5 h-5" />
                            Data da Prescrição
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="font-medium">{formatDate(prescricao.data_criacao)}</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Pill className="w-5 h-5" />
                        Prescrição Médica
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="bg-muted/30 border rounded-lg p-6">
                        <p className="whitespace-pre-wrap text-lg leading-relaxed font-medium">
                            {prescricao.detalhes_prescricao}
                        </p>
                    </div>
                    {prescricao.cid10 && (
                        <p className="mt-4 text-sm text-muted-foreground">
                            <strong>CID-10:</strong> {prescricao.cid10}
                        </p>
                    )}
                </CardContent>
            </Card>
        </div>
        </RequireRole>
    );
}