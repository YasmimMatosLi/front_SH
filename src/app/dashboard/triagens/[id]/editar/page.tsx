// src/app/dashboard/triagens/[id]/editar/page.tsx
'use client';

import {zodResolver} from '@hookform/resolvers/zod';
import {useForm} from 'react-hook-form';
import {z} from 'zod';
import {useTriagem, useUpdateTriagem} from '@/hooks/useTriagem';
import {toast} from 'sonner';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Header} from '@/components/Header';
import {UpdateTriagemSchema} from '@/schemas/triagem';
import {useRouter} from 'next/navigation';
import {LoadingSpinner} from '@/components/LoadingSpinner';
import {useEffect} from 'react';
import {Badge} from '@/components/ui/badge';
import {RequireRole} from "@/components/RequireRole";
import {Papeis} from "@/types";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {formatDate} from "@/lib/utils";
import {Textarea} from "@/components/ui/textarea";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import Link from "next/link";

export default function EditarTriagemPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const { data: triagem, isLoading } = useTriagem(params.id);
    const updateTriagem = useUpdateTriagem();

    const form = useForm<z.infer<typeof UpdateTriagemSchema>>({
        resolver: zodResolver(UpdateTriagemSchema),
        defaultValues: {
            queixaPrincipal: '',
            nivelGravidade: undefined,
            sinaisVitais: {
                pressaoArterialSistolica: undefined,
                pressaoArterialDiastolica: undefined,
                frequenciaCardiaca: undefined,
                frequenciaRespiratoria: undefined,
                temperatura: undefined,
                saturacaoOxigenio: undefined,
                nivelDor: undefined,
                estadoConsciente: undefined,
            },
        },
    });

    useEffect(() => {
        if (triagem) {
            form.reset({
                queixaPrincipal: triagem.queixa_principal,
                nivelGravidade: triagem.nivel_gravidade,
                sinaisVitais: {
                    pressaoArterialSistolica: triagem.sinais_vitais.pressaoArterialSistolica,
                    pressaoArterialDiastolica: triagem.sinais_vitais.pressaoArterialDiastolica,
                    frequenciaCardiaca: triagem.sinais_vitais.frequenciaCardiaca,
                    frequenciaRespiratoria: triagem.sinais_vitais.frequenciaRespiratoria,
                    temperatura: triagem.sinais_vitais.temperatura,
                    saturacaoOxigenio: triagem.sinais_vitais.saturacaoOxigenio,
                    nivelDor: triagem.sinais_vitais.nivelDor,
                    estadoConsciente: triagem.sinais_vitais.estadoConsciente,
                },
            });
        }
    }, [triagem, form]);

    function onSubmit(values: z.infer<typeof UpdateTriagemSchema>) {
        updateTriagem.mutate(
            { id: params.id, data: values },
            {
                onSuccess: () => {
                    toast.success('Triagem atualizada com sucesso!');
                    router.push(`/dashboard/triagens/${params.id}`);
                },
                onError: (error: Error) => {
                    toast.error(`Erro ao atualizar triagem: ${error.message}`);
                },
            }
        );
    }

    if (isLoading) return <LoadingSpinner />;
    if (!triagem) return <div>Triagem não encontrada</div>;

    const getRiscoBadge = (risco: string) => {
        const variants: Record<string, string> = {
            VERMELHO: 'bg-red-500',
            LARANJA: 'bg-orange-500',
            AMARELO: 'bg-yellow-500',
            VERDE: 'bg-green-500',
            AZUL: 'bg-blue-500',
        };
        return <Badge className={`${variants[risco] || 'bg-gray-500'} text-white`}>{risco}</Badge>;
    };

    return (
        <RequireRole allowedRoles={[Papeis.ADMINISTRADOR_PRINCIPAL, Papeis.ENFERMEIRO]}>
        <div className="space-y-8">
            <Header title={`Editar Triagem #${triagem.id}`} description="Atualize os dados da triagem" />

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        Informações da Triagem
                        {getRiscoBadge(triagem.nivel_gravidade)}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="mb-6 space-y-2">
                        <p><strong>Paciente:</strong> {triagem.paciente_nome}</p>
                        <p><strong>Enfermeiro:</strong> {triagem.enfermeiro_nome}</p>
                        <p><strong>Data:</strong> {formatDate(triagem.createdAt)}</p>
                    </div>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <FormField
                                control={form.control}
                                name="queixaPrincipal"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Queixa Principal</FormLabel>
                                        <FormControl>
                                            <Textarea className="min-h-24" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="nivelGravidade"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Classificação de Risco</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="VERMELHO">Vermelho - Emergência</SelectItem>
                                                <SelectItem value="LARANJA">Laranja - Muito Urgente</SelectItem>
                                                <SelectItem value="AMARELO">Amarelo - Urgente</SelectItem>
                                                <SelectItem value="VERDE">Verde - Pouco Urgente</SelectItem>
                                                <SelectItem value="AZUL">Azul - Não Urgente</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="space-y-6">
                                <h3 className="text-lg font-medium">Sinais Vitais</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="sinaisVitais.pressaoArterialSistolica"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>PA Sistólica</FormLabel>
                                                <FormControl>
                                                    <Input type="number" {...field} value={field.value ?? ''} onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)} />
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
                                                <FormLabel>PA Diastólica</FormLabel>
                                                <FormControl>
                                                    <Input type="number" {...field} value={field.value ?? ''} onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)} />
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
                                                <FormLabel>Frequência Cardíaca</FormLabel>
                                                <FormControl>
                                                    <Input type="number" {...field} value={field.value ?? ''} onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)} />
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
                                                <FormLabel>Frequência Respiratória</FormLabel>
                                                <FormControl>
                                                    <Input type="number" {...field} value={field.value ?? ''} onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)} />
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
                                                    <Input type="number" step="0.1" {...field} value={field.value ?? ''} onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)} />
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
                                                <FormLabel>Saturação de Oxigênio (%)</FormLabel>
                                                <FormControl>
                                                    <Input type="number" {...field} value={field.value ?? ''} onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)} />
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
                                                    <Input type="number" {...field} value={field.value ?? ''} onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)} />
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
                                                <FormLabel>Estado Consciente</FormLabel>
                                                <Select onValueChange={(value) => field.onChange(value === 'true')} value={String(field.value)}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="true">Consciente</SelectItem>
                                                        <SelectItem value="false">Inconsciente</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <Button type="submit" size="lg" disabled={updateTriagem.isPending}>
                                    {updateTriagem.isPending ? 'Atualizando...' : 'Salvar Alterações'}
                                </Button>
                                <Link href={`/dashboard/triagens/${params.id}`}>
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