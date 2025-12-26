'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useCreateTriagem } from '@/hooks/useTriagem';
import { usePacientes } from '@/hooks/usePaciente';
import { useCurrentUser } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from '@/components/Header';
import { CreateTriagemSchema } from '@/schemas/triagem';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { RequireRole } from '@/components/RequireRole';
import { Papeis } from '@/types';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { AlertCircle, Activity, Stethoscope, User } from 'lucide-react';

export default function CriarTriagemPage() {
    const router = useRouter();
    const createTriagem = useCreateTriagem();
    const { data: pacientes } = usePacientes();
    const { data: user, isLoading: loadingUser } = useCurrentUser();

    const form = useForm<z.infer<typeof CreateTriagemSchema>>({
        resolver: zodResolver(CreateTriagemSchema),
        defaultValues: {
            pacienteId: '',
            queixaPrincipal: '',
            sinaisVitais: {
                pressaoArterialSistolica: undefined,
                pressaoArterialDiastolica: undefined,
                frequenciaCardiaca: undefined,
                frequenciaRespiratoria: undefined,
                temperatura: undefined,
                saturacaoOxigenio: undefined,
                nivelDor: undefined,
                estadoConsciente: true,
            },
        },
    });

    useEffect(() => {
        if (user) {
            form.setValue('enfermeiroId', user.id);
            if (user.unidadeSaudeId) {
                form.setValue('unidadeSaudeId', user.unidadeSaudeId);
            }
        }
    }, [user, form]);

    function onSubmit(values: z.infer<typeof CreateTriagemSchema>) {
        createTriagem.mutate(values, {
            onSuccess: () => {
                toast.success('Triagem criada com sucesso!');
                router.push('/dashboard/triagens');
            },
            onError: (error: Error) => {
                toast.error(`Erro ao criar triagem: ${error.message}`);
            },
        });
    }

    if (loadingUser) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center space-y-4">
                    <Activity className="h-12 w-12 animate-pulse text-blue-600 mx-auto" />
                    <p className="text-lg text-muted-foreground">Carregando perfil do enfermeiro...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center space-y-4">
                    <AlertCircle className="h-12 w-12 text-red-600 mx-auto" />
                    <p className="text-lg text-red-600">Erro: usuário não autenticado</p>
                </div>
            </div>
        );
    }

    return (
        <RequireRole allowedRoles={[Papeis.ENFERMEIRO]}>
            <div className="max-w-5xl mx-auto space-y-8 py-8">
                {/* Cabeçalho */}
                <div className="text-center space-y-4">
                    <div className="inline-flex items-center gap-3 rounded-full bg-blue-100 px-6 py-3 text-blue-800">
                        <Activity className="h-6 w-6" />
                        <span className="text-lg font-semibold">Nova Triagem</span>
                    </div>
                    <h1 className="text-4xl font-bold text-foreground">Registro de Triagem</h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Registre os sinais vitais e a queixa principal do paciente para classificação automática de risco
                    </p>
                </div>

                {/* Informações do enfermeiro */}
                <Card className="border-blue-200 bg-blue-50">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-3 text-blue-900">
                            <User className="h-6 w-6" />
                            Responsável pela Triagem
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <p className="text-sm text-blue-700">Enfermeiro(a)</p>
                                <p className="text-lg font-semibold text-blue-900">{user.nome}</p>
                            </div>
                            <div>
                                <p className="text-sm text-blue-700">Unidade de Saúde</p>
                                <p className="text-lg font-semibold text-blue-900">
                                    {user.unidadeSaudeNome || 'Não associada'}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Formulário principal */}
                <Card className="shadow-xl">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-3">
                            <Stethoscope className="h-6 w-6 text-green-600" />
                            Dados da Triagem
                        </CardTitle>
                        <CardDescription>
                            Preencha todos os campos com atenção. A classificação de risco será calculada automaticamente.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
                                {/* Paciente */}
                                <FormField
                                    control={form.control}
                                    name="pacienteId"
                                    render={({ field }) => (
                                        <FormItem className="max-w-md">
                                            <FormLabel className="text-lg">Paciente</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="h-12 text-base">
                                                        <SelectValue placeholder="Selecione o paciente" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {pacientes?.map((p) => (
                                                        <SelectItem key={p.id} value={p.id}>
                                                            <div className="flex flex-col">
                                                                <span className="font-medium">{p.nome}</span>
                                                                <span className="text-sm text-muted-foreground">CPF: {p.cpf}</span>
                                                            </div>
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Queixa Principal */}
                                <FormField
                                    control={form.control}
                                    name="queixaPrincipal"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-lg">Queixa Principal</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Ex: Dor de cabeça intensa, náusea, febre alta, vômitos frequentes..."
                                                    className="min-h-40 text-base resize-none"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Sinais Vitais */}
                                <div className="space-y-8">
                                    <h3 className="text-2xl font-semibold flex items-center gap-3">
                                        <Activity className="h-7 w-7 text-green-600" />
                                        Sinais Vitais
                                    </h3>

                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                        <FormField
                                            control={form.control}
                                            name="sinaisVitais.pressaoArterialSistolica"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>PA Sistólica (mmHg)</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            placeholder="120"
                                                            className="h-12 text-base"
                                                            {...field}
                                                            value={field.value ?? ''}
                                                            onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="sinaisVitais.pressaoArterialDiastolica"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>PA Diastólica (mmHg)</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            placeholder="80"
                                                            className="h-12 text-base"
                                                            {...field}
                                                            value={field.value ?? ''}
                                                            onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="sinaisVitais.frequenciaCardiaca"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Freq. Cardíaca (bpm)</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            placeholder="75"
                                                            className="h-12 text-base"
                                                            {...field}
                                                            value={field.value ?? ''}
                                                            onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="sinaisVitais.frequenciaRespiratoria"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Freq. Respiratória (mpm)</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            placeholder="16"
                                                            className="h-12 text-base"
                                                            {...field}
                                                            value={field.value ?? ''}
                                                            onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="sinaisVitais.temperatura"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Temperatura (°C)</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            step="0.1"
                                                            placeholder="36.5"
                                                            className="h-12 text-base"
                                                            {...field}
                                                            value={field.value ?? ''}
                                                            onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="sinaisVitais.saturacaoOxigenio"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Sat. O₂ (%)</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            placeholder="98"
                                                            className="h-12 text-base"
                                                            {...field}
                                                            value={field.value ?? ''}
                                                            onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="sinaisVitais.nivelDor"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Nível de Dor (0-10)</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            min="0"
                                                            max="10"
                                                            placeholder="3"
                                                            className="h-12 text-base"
                                                            {...field}
                                                            value={field.value ?? ''}
                                                            onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="sinaisVitais.estadoConsciente"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Estado de Consciência</FormLabel>
                                                    <FormControl>
                                                        <Select
                                                            onValueChange={(value) => field.onChange(value === 'true')}
                                                            value={String(field.value)}
                                                        >
                                                            <SelectTrigger className="h-12 text-base">
                                                                <SelectValue placeholder="Selecione o estado" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="true">Consciente</SelectItem>
                                                                <SelectItem value="false">Inconsciente</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>

                                {/* Botões */}
                                <div className="flex justify-end gap-4 pt-8">
                                    <Link href="/dashboard/triagens">
                                        <Button type="button" variant="outline" size="lg">
                                            Cancelar
                                        </Button>
                                    </Link>
                                    <Button
                                        type="submit"
                                        size="lg"
                                        className="px-12"
                                        disabled={createTriagem.isPending}
                                    >
                                        {createTriagem.isPending ? 'Registrando...' : 'Registrar Triagem'}
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </RequireRole>
    );
}