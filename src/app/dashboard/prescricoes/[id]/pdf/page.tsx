// src/app/dashboard/prescricoes/[id]/pdf/page.tsx
import { usePrescricao } from '@/hooks/usePrescricao';
import { jsPDF } from 'jspdf';
import { formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {FileDown} from "lucide-react";
import {Papeis} from "@/types";
import {RequireRole} from "@/components/RequireRole";

type Props = {
    params: { id: string };
};

export default function PrescricaoPDFPage({ params }: Props) {
    const { data: prescricao, isLoading } = usePrescricao(params.id);

    const generatePDF = () => {
        const doc = new jsPDF();

        // Cabeçalho
        doc.setFontSize(20);
        doc.text('Hospital IA', 105, 25, { align: 'center' });
        doc.setFontSize(16);
        doc.text('Prescrição Médica', 105, 35, { align: 'center' });
        doc.setFontSize(11);
        doc.text(`Emitida em: ${formatDate(new Date().toISOString())}`, 105, 45, { align: 'center' });

        // Linha separadora
        doc.setLineWidth(0.5);
        doc.line(20, 50, 190, 50);

        // Dados do paciente e médico
        doc.setFontSize(12);
        doc.text(`Paciente: ${prescricao?.paciente_nome || 'Não informado'}`, 20, 65);
        doc.text(`Médico: ${prescricao?.medico_nome || 'Não informado'}`, 20, 75);
        doc.text(`Data: ${formatDate(prescricao!.detalhes_prescricao)}`, 20, 85);
        if (prescricao?.cid10) {
            doc.text(`CID-10: ${prescricao.cid10}`, 20, 95);
        }

        // Prescrição principal
        doc.setFontSize(14);
        doc.text('Prescrição:', 20, 115);
        doc.setFontSize(12);
        const splitText = doc.splitTextToSize(prescricao?.detalhes_prescricao || 'Sem prescrição registrada', 170);
        doc.text(splitText, 20, 125);

        // Rodapé com assinatura
        const finalY = 125 + splitText.length * 7 + 20;
        doc.setFontSize(11);
        doc.text('Assinatura do Médico:', 20, finalY);
        doc.line(20, finalY + 5, 190, finalY + 5);
        doc.text(`${prescricao?.medico_nome}`, 20, finalY + 15);

        // Nome do arquivo
        doc.save(`prescricao_${prescricao?.id.slice(0, 8)}.pdf`);
    };

    if (isLoading) return <LoadingSpinner />;
    if (!prescricao) return <div className="text-center py-12">Prescrição não encontrada</div>;

    return (
        <RequireRole allowedRoles={[Papeis.ADMINISTRADOR_PRINCIPAL, Papeis.MEDICO]}>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-8">
            <Card className="w-full max-w-2xl shadow-2xl">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl">Prescrição Médica</CardTitle>
                    <p className="text-muted-foreground mt-2">
                        Paciente: <strong>{prescricao.paciente_nome}</strong> |
                        Médico: <strong>{prescricao.medico_nome}</strong>
                    </p>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="bg-muted/30 border rounded-lg p-6">
                        <p className="whitespace-pre-wrap text-lg leading-relaxed">
                            {prescricao.detalhes_prescricao}
                        </p>
                        {prescricao.cid10 && (
                            <p className="mt-4 text-sm font-medium">
                                CID-10: {prescricao.cid10}
                            </p>
                        )}
                    </div>

                    <div className="text-center">
                        <Button onClick={generatePDF} size="lg" className="px-12">
                            <FileDown className="mr-2 h-5 w-5" />
                            Baixar PDF
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
        </RequireRole>
    );
}