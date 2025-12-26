// src/app/dashboard/pacientes/[id]/editar/page.tsx
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { usePaciente, useUpdatePaciente } from '@/hooks/usePaciente';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from '@/components/Header';
import { UpdatePacienteSchema } from '@/schemas/paciente';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useEffect } from 'react';
import {Escolaridade, GrupoRisco, Papeis, RacaCor, Sexo} from "@/types";
import {RequireRole} from "@/components/RequireRole";
import {Input} from "@/components/ui/input";
import {formatCPF, formatTelefone} from "@/lib/utils";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Checkbox} from "@/components/ui/checkbox";

const gruposRiscoOptions: GrupoRisco[] = [
    GrupoRisco.IDOSO,
    GrupoRisco.GESTANTE,
    GrupoRisco.DIABETICO,
    GrupoRisco.HIPERTENSO,
    GrupoRisco.IMUNOSSUPRIMIDO,
    GrupoRisco.CRIANCA,
    GrupoRisco.OBESO,
    GrupoRisco.ASMATICO,
] as const;

export default function EditarPacientePage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const { data: paciente, isLoading } = usePaciente(params.id);
    const updatePaciente = useUpdatePaciente();

    const form = useForm<z.infer<typeof UpdatePacienteSchema>>({
        resolver: zodResolver(UpdatePacienteSchema),
        defaultValues: {
            nome: '',
            cpf: '',
            cns: '',
            dataNascimento: '',
            sexo: Sexo.SELECIONE,
            racaCor: RacaCor.SELECIONE,
            escolaridade: Escolaridade.SELECIONE,
            telefone: '',
            email: '',
            gruposRisco: [],
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
        if (paciente) {
            form.reset({
                nome: paciente.nome,
                cpf: paciente.cpf,
                cns: paciente.cns,
                dataNascimento: new Date(paciente.dataNascimento).toISOString().split('T')[0],
                sexo: paciente.sexo,
                racaCor: paciente.racaCor,
                escolaridade: paciente.escolaridade,
                telefone: paciente.telefone,
                email: paciente.email || '',
                gruposRisco: paciente.gruposRisco as GrupoRisco[],
                endereco: paciente.endereco,
            });
        }
    }, [paciente, form]);

    function onSubmit(values: z.infer<typeof UpdatePacienteSchema>) {
        updatePaciente.mutate(
            { id: params.id, data: values },
            {
                onSuccess: () => {
                    toast.success('Paciente atualizado com sucesso!');
                    router.push(`/dashboard/pacientes/${params.id}`);
                },
                onError: (error) => {
                    toast.error(`Erro ao atualizar paciente: ${error.message}`);
                },
            }
        );
    }

    if (isLoading) return <LoadingSpinner />;
    if (!paciente) return <div>Paciente não encontrado</div>;

    return (
        <RequireRole allowedRoles={[Papeis.ADMINISTRADOR_PRINCIPAL, Papeis.MEDICO, Papeis.ENFERMEIRO]}>
        <div className="space-y-8">
            <Header
                title={`Editar ${paciente.nome}`}
                description="Atualize os dados do paciente"
            />

            <Card>
                <CardHeader>
                    <CardTitle>Dados do Paciente</CardTitle>
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
                                            <FormLabel>Nome completo</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Nome completo" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="cpf"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>CPF</FormLabel>
                                            <FormControl>
                                                <Input placeholder="000.000.000-00" {...field} onChange={(e) => field.onChange(formatCPF(e.target.value))} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="cns"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>CNS</FormLabel>
                                            <FormControl>
                                                <Input placeholder="CNS" {...field} />
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
                                                <Input placeholder="(00) 00000-0000" {...field} onChange={(e) => field.onChange(formatTelefone(e.target.value))} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email (opcional)</FormLabel>
                                            <FormControl>
                                                <Input type="email" placeholder="email@exemplo.com" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="dataNascimento"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Data de Nascimento</FormLabel>
                                            <FormControl>
                                                <Input type="date" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="sexo"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Sexo</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Selecione" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="MASCULINO">Masculino</SelectItem>
                                                    <SelectItem value="FEMININO">Feminino</SelectItem>
                                                    <SelectItem value="OUTRO">Outro</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="racaCor"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Raça/Cor</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Selecione" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="BRANCA">Branca</SelectItem>
                                                    <SelectItem value="PRETA">Preta</SelectItem>
                                                    <SelectItem value="PARDA">Parda</SelectItem>
                                                    <SelectItem value="AMARELA">Amarela</SelectItem>
                                                    <SelectItem value="INDIGENA">Indígena</SelectItem>
                                                    <SelectItem value="NAO_DECLARADO">Não declarado</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="escolaridade"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Escolaridade</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Selecione" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="SEM_ESCOLARIDADE">Sem escolaridade</SelectItem>
                                                    <SelectItem value="FUNDAMENTAL">Fundamental</SelectItem>
                                                    <SelectItem value="MEDIO">Médio</SelectItem>
                                                    <SelectItem value="SUPERIOR">Superior</SelectItem>
                                                    <SelectItem value="POS_GRADUACAO">Pós-graduação</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Endereço */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium">Endereço</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="endereco.logradouro"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Logradouro</FormLabel>
                                                <FormControl>
                                                    <Input {...field} />
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
                                                    <Input {...field} />
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
                                                    <Input {...field} />
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
                                                    <Input {...field} />
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
                                                <FormLabel>Estado (UF)</FormLabel>
                                                <FormControl>
                                                    <Input maxLength={2} {...field} />
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
                                                    <Input {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            {/* Grupos de Risco */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium">Grupos de Risco</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {gruposRiscoOptions.map((grupo: GrupoRisco) => (
                                        <FormField
                                            key={grupo}
                                            control={form.control}
                                            name="gruposRisco"
                                            render={({ field }) => (
                                                <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                                                    <FormControl>
                                                        <Checkbox
                                                            checked={field.value?.includes(grupo)}
                                                            onCheckedChange={(checked) => {
                                                                const current = field.value || [];
                                                                const updated = checked ? [...current, grupo] : current.filter((g) => g !== grupo);
                                                                field.onChange(updated);
                                                            }}
                                                        />
                                                    </FormControl>
                                                    <FormLabel className="font-normal">{grupo}</FormLabel>
                                                </FormItem>
                                            )}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <Button type="submit" size="lg" disabled={updatePaciente.isPending}>
                                    {updatePaciente.isPending ? 'Atualizando...' : 'Salvar Alterações'}
                                </Button>
                                <Link href={`/dashboard/pacientes/${params.id}`}>
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