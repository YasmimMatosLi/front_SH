// src/app/dashboard/medicos/[id]/editar/page.tsx
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useMedico, useUpdateMedico } from '@/hooks/useMedico';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from '@/components/Header';
import { UpdateMedicoSchema } from '@/schemas/medico';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useEffect } from 'react';
import {Input} from "@/components/ui/input";
import {Papeis} from "@/types";
import {RequireRole} from "@/components/RequireRole";

export default function EditarMedicoPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const { data: medico, isLoading } = useMedico(params.id);
    const updateMedico = useUpdateMedico();

    const form = useForm<z.infer<typeof UpdateMedicoSchema>>({
        resolver: zodResolver(UpdateMedicoSchema),
        defaultValues: {
            nome: '',
            crm: '',
        },
    });

    useEffect(() => {
        if (medico) {
            form.reset({
                nome: medico.nome,
                crm: medico.crm,
            });
        }
    }, [medico, form]);

    function onSubmit(values: z.infer<typeof UpdateMedicoSchema>) {
        updateMedico.mutate(
            { id: params.id, data: values },
            {
                onSuccess: () => {
                    toast.success('Médico atualizado com sucesso!');
                    router.push(`/dashboard/medicos/${params.id}`);
                },
                onError: (error) => {
                    toast.error(`Erro ao atualizar médico: ${error.message}`);
                },
            }
        );
    }

    if (isLoading) return <LoadingSpinner />;
    if (!medico) return <div>Médico não encontrado</div>;

    return (
        <RequireRole allowedRoles={[Papeis.ADMINISTRADOR_PRINCIPAL]}>
        <div className="space-y-8">
            <Header title={`Editar ${medico.nome}`} description="Atualize os dados do médico" />

            <Card>
                <CardHeader>
                    <CardTitle>Dados do Médico</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <FormField
                                control={form.control}
                                name="nome"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nome completo</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="crm"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>CRM</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="flex gap-4">
                                <Button type="submit" size="lg" disabled={updateMedico.isPending}>
                                    {updateMedico.isPending ? 'Atualizando...' : 'Salvar Alterações'}
                                </Button>
                                <Link href={`/dashboard/medicos/${params.id}`}>
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