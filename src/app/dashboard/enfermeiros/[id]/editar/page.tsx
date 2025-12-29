// src/app/dashboard/enfermeiros/[id]/editar/page.tsx
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useEnfermeiro, useUpdateEnfermeiro } from '@/hooks/useEnfermeiro';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from '@/components/Header';
import { UpdateEnfermeiroSchema } from '@/schemas/enfermeiro';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useEffect } from 'react';
import {Papeis} from "@/types";
import {RequireRole} from "@/components/RequireRole";

export default function EditarEnfermeiroPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const { data: enfermeiro, isLoading } = useEnfermeiro(params.id);
    const updateEnfermeiro = useUpdateEnfermeiro();

    const form = useForm<z.infer<typeof UpdateEnfermeiroSchema>>({
        resolver: zodResolver(UpdateEnfermeiroSchema),
        defaultValues: {
            nome: '',
            coren: '',
            dataContratacao: '',
        },
    });

    useEffect(() => {
        if (enfermeiro) {
            form.reset({
                nome: enfermeiro.nome,
                coren: enfermeiro.registroProfissional,
                dataContratacao: new Date(enfermeiro.dataContratacao).toISOString().split('T')[0],
            });
        }
    }, [enfermeiro, form]);

    function onSubmit(values: z.infer<typeof UpdateEnfermeiroSchema>) {
        updateEnfermeiro.mutate(
            { id: params.id, data: values },
            {
                onSuccess: () => {
                    toast.success('Enfermeiro atualizado com sucesso!');
                    router.push(`/dashboard/enfermeiros/${params.id}`);
                },
                onError: (error) => {
                    toast.error(`Erro ao atualizar enfermeiro: ${error.message}`);
                },
            }
        );
    }

    if (isLoading) return <LoadingSpinner />;
    if (!enfermeiro) return <div>Enfermeiro não encontrado</div>;

    return (
        <RequireRole allowedRoles={[Papeis.ADMINISTRADOR_PRINCIPAL]}>
        <div className="space-y-8">
            <Header title={`Editar ${enfermeiro.nome}`} description="Atualize os dados do enfermeiro" />

            <Card>
                <CardHeader>
                    <CardTitle>Dados do Enfermeiro</CardTitle>
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
                                name="coren"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>COREN</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="dataContratacao"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Data de Contratação</FormLabel>
                                        <FormControl>
                                            <Input type="date" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="flex gap-4">
                                <Button type="submit" size="lg" disabled={updateEnfermeiro.isPending}>
                                    {updateEnfermeiro.isPending ? 'Atualizando...' : 'Salvar Alterações'}
                                </Button>
                                <Link href={`/dashboard/enfermeiros/${params.id}`}>
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