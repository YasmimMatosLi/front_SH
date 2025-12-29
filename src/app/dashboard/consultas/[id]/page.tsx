// src/app/dashboard/consultas/[id]/page.tsx
import {useConsulta} from '@/hooks/useConsulta';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {formatDate} from '@/lib/utils';
import {Calendar, FileText, Stethoscope, User} from 'lucide-react';
import Link from 'next/link';
import {LoadingSpinner} from '@/components/LoadingSpinner';
import {Metadata} from "next";
import {RequireRole} from "@/components/RequireRole";
import {Papeis} from "@/types";

type Props = {
    params: { id: string };
};

export const metadata: Metadata = {
    title: 'Detalhes da Consulta - Hospital IA',
};

export default function ConsultaDetalhesPage({ params }: Props) {
    const { data: consulta, isLoading } = useConsulta(params.id);

    if (isLoading) return <LoadingSpinner />;

    if (!consulta) return <div className="text-center py-12 text-muted-foreground">Consulta não encontrada</div>;

    return (
        <RequireRole allowedRoles={[Papeis.ADMINISTRADOR_PRINCIPAL, Papeis.MEDICO]}>
        <div className="space-y-8">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold">Consulta #{consulta.id}</h1>
                    <p className="text-muted-foreground mt-2">Detalhes da consulta médica</p>
                </div>
                <Link href={`/dashboard/consultas/${consulta.id}/editar`}>
                    <Button>Editar Consulta</Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Calendar className="w-5 h-5" />
                            Informações da Consulta
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <p className="text-sm text-muted-foreground">Data</p>
                            <p className="font-medium">{formatDate(consulta.data_consulta)}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">CID-10</p>
                            <p className="font-medium">{consulta.cid10 || 'Não informado'}</p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="w-5 h-5" />
                            Paciente
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="font-medium">{consulta.pacienteNome}</p>
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
                        <p className="font-medium">{consulta.medicoNome}</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FileText className="w-5 h-5" />
                        Observações
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="whitespace-pre-wrap">{consulta.observacoes || 'Nenhuma observação registrada'}</p>
                </CardContent>
            </Card>
        </div>
        </RequireRole>
    );
}