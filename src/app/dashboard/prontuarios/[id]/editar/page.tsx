// src/app/dashboard/prontuarios/[id]/editar/page.tsx
'use client';

import {zodResolver} from '@hookform/resolvers/zod';
import {useForm} from 'react-hook-form';
import {z} from 'zod';
import {useProntuario, useUpdateProntuario} from '@/hooks/useProntuario';
import {toast} from 'sonner';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Header} from '@/components/Header';
import {UpdateProntuarioSchema} from '@/schemas/prontuario';
import {useRouter} from 'next/navigation';
import {LoadingSpinner} from '@/components/LoadingSpinner';
import {useEffect} from 'react';
import {RequireRole} from "@/components/RequireRole";
import {Papeis} from "@/types";
import {Button} from "@/components/ui/button";
import {formatDate} from "@/lib/utils";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Textarea} from "@/components/ui/textarea";
import {Input} from "@/components/ui/input";
import Link from "next/link";

export default function EditarProntuarioPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const { data: prontuario, isLoading } = useProntuario(params.id);
    const updateProntuario = useUpdateProntuario();

    const form = useForm<z.infer<typeof UpdateProntuarioSchema>>({
        resolver: zodResolver(UpdateProntuarioSchema),
        defaultValues: {
            descricao: '',
            cid10: '',
        },
    });

    useEffect(() => {
        if (prontuario) {
            form.reset({
                descricao: prontuario.descricao,
                cid10: prontuario.cid10 || '',
            });
        }
    }, [prontuario, form]);

    function onSubmit(values: z.infer<typeof UpdateProntuarioSchema>) {
        updateProntuario.mutate(
            { id: params.id, data: values },
            {
                onSuccess: () => {
                    toast.success('Prontuário atualizado com sucesso!');
                    router.push(`/dashboard/prontuarios/${params.id}`);
                },
                onError: (error: Error) => {
                    toast.error(`Erro ao atualizar: ${error.message}`);
                },
            }
        );
    }

    if (isLoading) return <LoadingSpinner />;
    if (!prontuario) return <div>Registro não encontrado</div>;

    return (
        <RequireRole allowedRoles={[Papeis.ADMINISTRADOR_PRINCIPAL, Papeis.MEDICO, Papeis.ENFERMEIRO]}>
        <div className="space-y-8">
            <Header title="Editar Prontuário" description="Atualize o registro clínico do paciente" />

            <Card>
                <CardHeader>
                    <CardTitle>Registro Clínico</CardTitle>
                    <div className="space-y-2 text-sm text-muted-foreground mt-4">
                        <p><strong>Paciente:</strong> {prontuario.paciente_nome}</p>
                        <p><strong>Profissional:</strong> {prontuario.profissional_nome}</p>
                        <p><strong>Data:</strong> {formatDate(prontuario.createdAt)}</p>
                    </div>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <FormField
                                control={form.control}
                                name="descricao"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Evolução / Descrição Clínica</FormLabel>
                                        <FormControl>
                                            <Textarea
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
                                            <Input placeholder="Ex: J45.9" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="flex gap-4">
                                <Button type="submit" size="lg" disabled={updateProntuario.isPending}>
                                    {updateProntuario.isPending ? 'Atualizando...' : 'Salvar Alterações'}
                                </Button>
                                <Link href={`/dashboard/prontuarios/${params.id}`}>
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