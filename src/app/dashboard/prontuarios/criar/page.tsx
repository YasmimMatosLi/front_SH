// src/app/dashboard/prontuarios/criar/page.tsx
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useCreateProntuario } from '@/hooks/useProntuario';
import { usePacientes } from '@/hooks/usePaciente';
import { useCurrentUser } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from '@/components/Header';
import { CreateProntuarioSchema } from '@/schemas/prontuario';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { RequireRole } from "@/components/RequireRole";
import {Papeis} from "@/types";

export default function CriarProntuarioPage() {
    const router = useRouter();
    const createProntuario = useCreateProntuario();
    const { data: pacientes } = usePacientes();
    const { data: user, isLoading: loadingUser } = useCurrentUser();

    const form = useForm<z.infer<typeof CreateProntuarioSchema>>({
        resolver: zodResolver(CreateProntuarioSchema),
        defaultValues: {
            pacienteId: '',
            descricao: '',
            cid10: '',
        },
    });

    useEffect(() => {
        if (user?.unidadeSaudeId) {
            form.setValue('unidadeSaudeId', user.unidadeSaudeId);
        }
    }, [user, form]);

    function onSubmit(values: z.infer<typeof CreateProntuarioSchema>) {
        createProntuario.mutate(values, {
            onSuccess: () => {
                toast.success('Prontuário criado com sucesso!');
                router.push('/dashboard/prontuarios');
            },
            onError: (error: Error) => {
                toast.error(`Erro: ${error.message}`);
            },
        });
    }

    if (loadingUser) return <div className="text-center py-12">Carregando...</div>;
    if (!user) return <div className="text-center py-12 text-red-600">Erro: usuário não autenticado</div>;

    return (
        <RequireRole allowedRoles={[Papeis.ADMINISTRADOR_PRINCIPAL, Papeis.MEDICO, Papeis.ENFERMEIRO]}>
        <div className="space-y-8">
            <Header title="Novo Prontuário" description="Registre uma nova entrada no prontuário clínico" />

            <Card>
                <CardHeader>
                    <CardTitle>Novo Registro Clínico</CardTitle>
                    <p className="text-sm text-muted-foreground">
                        Profissional: <strong>{user.nome}</strong> | Unidade: <strong>{user.unidadeSaudeNome || 'Não associada'}</strong>
                    </p>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <FormField
                                control={form.control}
                                name="pacienteId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Paciente</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecione o paciente" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {pacientes?.map((p) => (
                                                    <SelectItem key={p.id} value={p.id}>
                                                        {p.nome} (CPF: {p.cpf})
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="descricao"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Descrição Clínica / Evolução</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Ex: Paciente refere melhora dos sintomas após início do tratamento. Sem queixas adicionais. Exame físico normal..."
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
                                        <FormLabel>CID-10 Principal</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Ex: J45.9 (Asma não especificada)" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="flex gap-4">
                                <Button type="submit" size="lg" disabled={createProntuario.isPending}>
                                    {createProntuario.isPending ? 'Registrando...' : 'Salvar no Prontuário'}
                                </Button>
                                <Link href="/dashboard/prontuarios">
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