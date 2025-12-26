// src/app/dashboard/prescricoes/criar/page.tsx
'use client';

import {zodResolver} from '@hookform/resolvers/zod';
import {useForm} from 'react-hook-form';
import {z} from 'zod';
import {useCreatePrescricao} from '@/hooks/usePrescricao';
import {useCurrentUser} from '@/hooks/useAuth';
import {toast} from 'sonner';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Header} from '@/components/Header';
import {CreatePrescricaoSchema} from '@/schemas/prescricao';
import {useRouter} from 'next/navigation';
import {useEffect} from 'react';
import {usePacientes} from '@/hooks/usePaciente'; // mantido para selecionar paciente
import {RequireRole} from "@/components/RequireRole";
import {Papeis} from "@/types";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Textarea} from "@/components/ui/textarea";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import Link from "next/link";

export default function CriarPrescricaoPage() {
    const router = useRouter();
    const createPrescricao = useCreatePrescricao();
    const { data: pacientes } = usePacientes(); // usado no select
    const { data: user, isLoading: loadingUser } = useCurrentUser();

    const form = useForm<z.infer<typeof CreatePrescricaoSchema>>({
        resolver: zodResolver(CreatePrescricaoSchema),
        defaultValues: {
            pacienteId: '',
            unidadeSaudeId: '',
            detalhesPrescricao: '',
            cid10: '',
        },
    });

    useEffect(() => {
        if (user?.unidadeSaudeId) {
            form.setValue('unidadeSaudeId', user.unidadeSaudeId);
        }
    }, [user, form]);

    function onSubmit(values: z.infer<typeof CreatePrescricaoSchema>) {
        createPrescricao.mutate(values, {
            onSuccess: () => {
                toast.success('Prescrição criada com sucesso!');
                router.push('/dashboard/prescricoes');
            },
            onError: (error: Error) => {
                toast.error(`Erro: ${error.message}`);
            },
        });
    }

    if (loadingUser) return <div className="text-center py-12">Carregando perfil do médico...</div>;
    if (!user) return <div className="text-center py-12 text-red-600">Erro: médico não autenticado</div>;

    return (
        <RequireRole allowedRoles={[Papeis.MEDICO]}>
        <div className="space-y-8">
            <Header title="Nova Prescrição" description="Emita uma nova prescrição médica" />

            <Card>
                <CardHeader>
                    <CardTitle>Dados da Prescrição</CardTitle>
                    <p className="text-sm text-muted-foreground">
                        Médico: <strong>{user.nome}</strong> | Unidade: <strong>{user.unidadeSaudeNome || 'Não associada'}</strong>
                    </p>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            {/* Seleção do Paciente */}
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

                            {/* Detalhes da Prescrição (texto livre) */}
                            <FormField
                                control={form.control}
                                name="detalhesPrescricao"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Prescrição</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Ex: Amoxicilina 500mg, 1 cápsula a cada 8 horas por 7 dias. Paracetamol 750mg em caso de febre."
                                                className="min-h-48"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* CID-10 */}
                            <FormField
                                control={form.control}
                                name="cid10"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>CID-10</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Ex: J45 ou J45.9" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="flex gap-4">
                                <Button type="submit" size="lg" disabled={createPrescricao.isPending}>
                                    {createPrescricao.isPending ? 'Emitindo...' : 'Emitir Prescrição'}
                                </Button>
                                <Link href="/dashboard/prescricoes">
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