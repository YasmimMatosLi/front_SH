// src/app/dashboard/prescricoes/[id]/editar/page.tsx
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { usePrescricao, useUpdatePrescricao } from '@/hooks/usePrescricao';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from '@/components/Header';
import { UpdatePrescricaoSchema } from '@/schemas/prescricao';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useEffect } from 'react';
import { formatDate } from '@/lib/utils';
import {Papeis} from "@/types";
import {RequireRole} from "@/components/RequireRole";

export default function EditarPrescricaoPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const { data: prescricao, isLoading } = usePrescricao(params.id);
    const updatePrescricao = useUpdatePrescricao();

    const form = useForm<z.infer<typeof UpdatePrescricaoSchema>>({
        resolver: zodResolver(UpdatePrescricaoSchema),
        defaultValues: {
            detalhesPrescricao: '',
            cid10: '',
        },
    });

    useEffect(() => {
        if (prescricao) {
            form.reset({
                detalhesPrescricao: prescricao.detalhes_prescricao,
                cid10: prescricao.cid10 || '',
            });
        }
    }, [prescricao, form]);

    function onSubmit(values: z.infer<typeof UpdatePrescricaoSchema>) {
        updatePrescricao.mutate(
            { id: params.id, data: values },
            {
                onSuccess: () => {
                    toast.success('Prescrição atualizada com sucesso!');
                    router.push(`/dashboard/prescricoes/${params.id}`);
                },
                onError: (error: Error) => {
                    toast.error(`Erro ao atualizar: ${error.message}`);
                },
            }
        );
    }

    if (isLoading) return <LoadingSpinner />;
    if (!prescricao) return <div className="text-center py-12">Prescrição não encontrada</div>;

    return (
        <RequireRole allowedRoles={[Papeis.ADMINISTRADOR_PRINCIPAL, Papeis.MEDICO]}>
        <div className="space-y-8">
            <Header
                title={`Editar Prescrição #${prescricao.id.slice(0, 8)}`}
                description="Atualize a prescrição médica"
            />

            <Card>
                <CardHeader>
                    <CardTitle>Informações da Prescrição</CardTitle>
                    <div className="space-y-2 text-sm text-muted-foreground mt-4">
                        <p><strong>Paciente:</strong> {prescricao.paciente_nome}</p>
                        <p><strong>Médico:</strong> {prescricao.medico_nome}</p>
                        <p><strong>Data:</strong> {formatDate(prescricao.data_criacao)}</p>
                        {prescricao.cid10 && <p><strong>CID-10 Atual:</strong> {prescricao.cid10}</p>}
                    </div>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <FormField
                                control={form.control}
                                name="detalhesPrescricao"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Prescrição Médica</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Ex: Amoxicilina 500mg, 1 cápsula a cada 8 horas por 7 dias. Paracetamol 750mg em caso de febre."
                                                className="min-h-64 text-lg leading-relaxed"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="cid10"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>CID-10</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Ex: J45 ou J45.9"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="flex gap-4">
                                <Button type="submit" size="lg" disabled={updatePrescricao.isPending}>
                                    {updatePrescricao.isPending ? 'Atualizando...' : 'Salvar Alterações'}
                                </Button>
                                <Link href={`/dashboard/prescricoes/${params.id}`}>
                                    <Button variant="outline" size="lg">Cancelar</Button>
                                </Link>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
        </RequireRole>
    );
}