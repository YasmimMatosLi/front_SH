'use client';

import {zodResolver} from '@hookform/resolvers/zod';
import {useForm} from 'react-hook-form';
import {z} from 'zod';
import {useCreateConsulta} from '@/hooks/useConsulta';
import {usePacientes} from '@/hooks/usePaciente';
import {useCurrentUser} from '@/hooks/useAuth'; // <--- NOVO
import {RequireRole} from '@/components/RequireRole'; // <--- PROTEÇÃO
import {toast} from 'sonner';
import {Button} from '@/components/ui/button';
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from '@/components/ui/form';
import {Input} from '@/components/ui/input';
import {Textarea} from '@/components/ui/textarea';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Header} from '@/components/Header';
import {CreateConsultaSchema} from '@/schemas/consulta';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {useEffect} from 'react';
import {Papeis} from "@/types";

export default function CriarConsultaPage() {
    const router = useRouter();
    const createConsulta = useCreateConsulta();
    const { data: pacientes } = usePacientes();
    const { data: user, isLoading: loadingUser } = useCurrentUser();

    const form = useForm<z.infer<typeof CreateConsultaSchema>>({
        resolver: zodResolver(CreateConsultaSchema),
        defaultValues: {
            pacienteId: '',
            unidadeSaudeId: '',
            observacoes: '',
            cid10: '',
        },
    });

    // Preenche automaticamente médico e unidade do usuário logado
    useEffect(() => {
        if (user) {
            if (user.unidadeSaudeId) {
                form.setValue('unidadeSaudeId', user.unidadeSaudeId);
            }
        }
    }, [user, form]);

    function onSubmit(values: z.infer<typeof CreateConsultaSchema>) {
        createConsulta.mutate(values, {
            onSuccess: () => {
                toast.success('Consulta criada com sucesso!');
                router.push('/dashboard/consultas');
            },
            onError: (error: Error) => {
                toast.error(`Erro ao criar consulta: ${error.message}`);
            },
        });
    }

    if (loadingUser) {
        return <div className="text-center py-12">Carregando perfil do médico...</div>;
    }

    return (
        <RequireRole allowedRoles={[Papeis.MEDICO]}>
            <div className="space-y-8">
                <Header
                    title="Nova Consulta"
                    description="Registre uma nova consulta médica"
                />

                <Card>
                    <CardHeader>
                        <CardTitle>Dados da Consulta</CardTitle>
                        {user && (
                            <p className="text-sm text-muted-foreground mt-2">
                                Médico: <strong>{user.nome}</strong> |
                                Unidade: <strong>{user.unidadeSaudeNome || 'Automática'}</strong>
                            </p>
                        )}
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                </div>

                                <FormField
                                    control={form.control}
                                    name="observacoes"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Observações</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Descreva os sintomas, diagnóstico e tratamento..."
                                                    className="min-h-32"
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
                                            <FormLabel>CID-10 (opcional)</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Ex: A09.9" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="flex gap-4">
                                    <Button type="submit" size="lg" disabled={createConsulta.isPending}>
                                        {createConsulta.isPending ? 'Criando...' : 'Registrar Consulta'}
                                    </Button>
                                    <Link href="/dashboard/consultas">
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