// src/app/dashboard/unidades/[id]/editar/page.tsx
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useUnidadeSaude, useUpdateUnidade } from '@/hooks/useUnidadeSaude';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from '@/components/Header';
import { UpdateUnidadeSaudeSchema } from '@/schemas/unidade-saude';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useEffect } from 'react';
import {Papeis, TipoUnidadeSaude} from '@/types';
import { RequireRole } from "@/components/RequireRole";

export default function EditarUnidadePage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const { data: unidade, isLoading } = useUnidadeSaude(params.id);
    const updateUnidade = useUpdateUnidade();

    const form = useForm<z.infer<typeof UpdateUnidadeSaudeSchema>>({
        resolver: zodResolver(UpdateUnidadeSaudeSchema),
        defaultValues: {
            nome: '',
            tipo: TipoUnidadeSaude.HOSPITAL,
            cnes: '',
            telefone: '',
            endereco: {
                logradouro: '',
                numero: '',
                bairro: '',
                cidade: '',
                estado: '',
                cep: '',
            },
        },
    });

    useEffect(() => {
        if (unidade) {
            form.reset({
                nome: unidade.nome,
                tipo: unidade.tipo,
                cnes: unidade.cnes,
                telefone: unidade.telefone,
                endereco: unidade.endereco,
            });
        }
    }, [unidade, form]);

    function onSubmit(values: z.infer<typeof UpdateUnidadeSaudeSchema>) {
        updateUnidade.mutate(
            { id: params.id, data: values },
            {
                onSuccess: () => {
                    toast.success('Unidade atualizada com sucesso!');
                    router.push(`/dashboard/unidades/${params.id}`);
                },
                onError: (error) => {
                    toast.error(`Erro ao atualizar unidade: ${error.message}`);
                },
            }
        );
    }

    if (isLoading) return <LoadingSpinner />;
    if (!unidade) return <div>Unidade não encontrada</div>;

    return (
        <RequireRole allowedRoles={[Papeis.ADMINISTRADOR_PRINCIPAL]}>
        <div className="space-y-8">
            <Header title={`Editar ${unidade.nome}`} description="Atualize os dados da unidade" />

            <Card>
                <CardHeader>
                    <CardTitle>Dados da Unidade</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="nome"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nome</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Nome da Unidade" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="tipo"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Tipo</FormLabel>
                                            <FormControl>
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Selecione o tipo" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {Object.values(TipoUnidadeSaude).map((tipo) => (
                                                            <SelectItem key={tipo} value={tipo}>
                                                                {tipo}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="cnes"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>CNES</FormLabel>
                                            <FormControl>
                                                <Input placeholder="CNES da Unidade" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="telefone"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Telefone</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Telefone da Unidade" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                {/* Campos de endereço */}
                                <FormField
                                    control={form.control}
                                    name="endereco.logradouro"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Logradouro</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Logradouro" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="endereco.numero"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Número</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Número" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="endereco.bairro"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Bairro</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Bairro" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="endereco.cidade"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Cidade</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Cidade" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="endereco.estado"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Estado</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Estado" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="endereco.cep"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>CEP</FormLabel>
                                            <FormControl>
                                                <Input placeholder="CEP" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="flex gap-4">
                                    <Button type="submit" size="lg" disabled={updateUnidade.isPending}>
                                        {updateUnidade.isPending ? 'Atualizando...' : 'Salvar Alterações'}
                                    </Button>
                                    <Link href={`/dashboard/unidades/${params.id}`}>
                                        <Button variant="outline" size="lg">Cancelar</Button>
                                    </Link>
                                </div>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
        </RequireRole>
    );
}