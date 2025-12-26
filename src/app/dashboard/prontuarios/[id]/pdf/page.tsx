// src/app/dashboard/prontuarios/[id]/pdf/page.tsx
import { useProntuario } from '@/hooks/useProntuario';
import { jsPDF } from 'jspdf';
import { formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {FileDown} from "lucide-react";
import { RequireRole } from "@/components/RequireRole";
import {Papeis} from "@/types";

type Props = {
    params: { id: string };
};

export default function ProntuarioPDFPage({ params }: Props) {
    const { data: prontuario, isLoading } = useProntuario(params.id);

    const generatePDF = () => {
        const doc = new jsPDF();

        // Cabeçalho
        doc.setFontSize(20);
        doc.text('Hospital IA', 105, 25, { align: 'center' });
        doc.setFontSize(16);
        doc.text('Prontuário Clínico', 105, 35, { align: 'center' });
        doc.setFontSize(11);
        doc.text(`Registro emitido em: ${formatDate(new Date().toISOString())}`, 105, 45, { align: 'center' });

        doc.setLineWidth(0.5);
        doc.line(20, 50, 190, 50);

        // Dados
        doc.setFontSize(12);
        doc.text(`Paciente: ${prontuario?.paciente_nome}`, 20, 65);
        doc.text(`Profissional: ${prontuario?.profissional_nome}`, 20, 75);
        doc.text(`Data do Registro: ${formatDate(prontuario!.createdAt)}`, 20, 85);
        if (prontuario?.cid10) {
            doc.text(`CID-10: ${prontuario.cid10}`, 20, 95);
        }

        // Evolução
        doc.setFontSize(14);
        doc.text('Evolução Clínica:', 20, 115);
        doc.setFontSize(12);
        const splitText = doc.splitTextToSize(prontuario?.descricao || 'Sem descrição registrada', 170);
        doc.text(splitText, 20, 125);

        // Assinatura
        const finalY = 125 + splitText.length * 7 + 30;
        doc.setFontSize(11);
        doc.text('Assinatura do Profissional:', 20, finalY);
        doc.line(20, finalY + 5, 190, finalY + 5);
        doc.text(prontuario?.profissional_nome || '', 20, finalY + 15);

        doc.save(`prontuario_${prontuario?.id.slice(0, 8)}.pdf`);
    };

    if (isLoading) return <LoadingSpinner />;
    if (!prontuario) return <div>Registro não encontrado</div>;

    return (
        <RequireRole allowedRoles={[Papeis.ADMINISTRADOR_PRINCIPAL, Papeis.MEDICO, Papeis.ENFERMEIRO]}>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-8">
            <Card className="w-full max-w-3xl shadow-2xl">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl">Prontuário Clínico</CardTitle>
                    <p className="text-muted-foreground mt-2">
                        Paciente: <strong>{prontuario.paciente_nome}</strong> |
                        Profissional: <strong>{prontuario.profissional_nome}</strong>
                    </p>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="bg-muted/30 border rounded-lg p-6">
                        <p className="whitespace-pre-wrap text-lg leading-relaxed">
                            {prontuario.descricao}
                        </p>
                        {prontuario.cid10 && (
                            <p className="mt-6 text-lg font-medium">
                                CID-10: {prontuario.cid10}
                            </p>
                        )}
                    </div>

                    <div className="text-center">
                        <Button onClick={generatePDF} size="lg" className="px-12">
                            <FileDown className="mr-2 h-5 w-5" />
                            Baixar PDF do Prontuário
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
        </RequireRole>
    );
}