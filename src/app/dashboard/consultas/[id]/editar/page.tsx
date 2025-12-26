// src/app/dashboard/consultas/[id]/editar/page.tsx
'use client';

import {zodResolver} from '@hookform/resolvers/zod';
import {useForm} from 'react-hook-form';
import {z} from 'zod';
import {useConsulta, useUpdateConsulta} from '@/hooks/useConsulta';
import {toast} from 'sonner';
import {Button} from '@/components/ui/button';
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from '@/components/ui/form';
import {Input} from '@/components/ui/input';
import {Textarea} from '@/components/ui/textarea';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Header} from '@/components/Header';
import {UpdateConsultaSchema} from '@/schemas/consulta';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {LoadingSpinner} from '@/components/LoadingSpinner';
import {useEffect} from 'react';
import {formatDate} from "@/lib/utils";
import {RequireRole} from "@/components/RequireRole";
import {Papeis} from "@/types";

export default function EditarConsultaPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const { data: consulta, isLoading } = useConsulta(params.id);
    const updateConsulta = useUpdateConsulta();

    const form = useForm<z.infer<typeof UpdateConsultaSchema>>({
        resolver: zodResolver(UpdateConsultaSchema),
        defaultValues: {
            observacoes: '',
            cid10: '',
        },
    });

    useEffect(() => {
        if (consulta) {
            form.reset({
                observacoes: consulta.observacoes,
                cid10: consulta.cid10 || '',
            });
        }
    }, [consulta, form]);

    function onSubmit(values: z.infer<typeof UpdateConsultaSchema>) {
        updateConsulta.mutate(
            { id: params.id, data: values },
            {
                onSuccess: () => {
                    toast.success('Consulta atualizada com sucesso!');
                    router.push(`/dashboard/consultas/${params.id}`);
                },
                onError: (error) => {
                    toast.error(`Erro ao atualizar consulta: ${error.message}`);
                },
            }
        );
    }

    if (isLoading) return <LoadingSpinner />;
    if (!consulta) return <div>Consulta não encontrada</div>;

    return (
        <RequireRole allowedRoles={[Papeis.ADMINISTRADOR_PRINCIPAL, Papeis.MEDICO]}>
        <div className="space-y-8">
            <Header title={`Editar Consulta #${consulta.id}`} description="Atualize os dados da consulta" />

            <Card>
                <CardHeader>
                    <CardTitle>Editar Consulta</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="mb-6 space-y-2">
                        <p><strong>Paciente:</strong> {consulta.pacienteNome}</p>
                        <p><strong>Médico:</strong> {consulta.medicoNome}</p>
                        <p><strong>Data:</strong> {formatDate(consulta.data)}</p>
                    </div>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <FormField
                                control={form.control}
                                name="observacoes"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Observações</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Atualize os sintomas, diagnóstico e tratamento..."
                                                className="min-h-40"
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
                                            <Input placeholder="Ex: A09.9" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="flex gap-4">
                                <Button type="submit" size="lg" disabled={updateConsulta.isPending}>
                                    {updateConsulta.isPending ? 'Atualizando...' : 'Salvar Alterações'}
                                </Button>
                                <Link href={`/dashboard/consultas/${params.id}`}>
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