'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useCreatePaciente } from '@/hooks/usePaciente';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCPF, formatTelefone } from '@/lib/utils';
import { CreatePacienteSchema } from '@/schemas/paciente';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Escolaridade, GrupoRisco, Papeis, RacaCor, Sexo } from '@/types';
import { RequireRole } from '@/components/RequireRole';
import { UserPlus, Home, AlertCircle } from 'lucide-react';

const gruposRiscoOptions: GrupoRisco[] = [
    GrupoRisco.IDOSO,
    GrupoRisco.GESTANTE,
    GrupoRisco.DIABETICO,
    GrupoRisco.HIPERTENSO,
    GrupoRisco.IMUNOSSUPRIMIDO,
    GrupoRisco.CRIANCA,
    GrupoRisco.OBESO,
    GrupoRisco.ASMATICO,
];

export default function CriarPacientePage() {
    const router = useRouter();
    const createPaciente = useCreatePaciente();

    const form = useForm<z.infer<typeof CreatePacienteSchema>>({
        resolver: zodResolver(CreatePacienteSchema),
        defaultValues: {
            nome: '',
            cpf: '',
            cns: '',
            dataNascimento: '',
            sexo: undefined, // forçamos undefined para obrigar seleção
            racaCor: undefined,
            escolaridade: undefined,
            endereco: {
                logradouro: '',
                numero: '',
                bairro: '',
                cidade: '',
                estado: '',
                cep: '',
            },
            telefone: '',
            email: '',
            gruposRisco: [],
            consentimentoLGPD: true,
        },
    });

    function onSubmit(values: z.infer<typeof CreatePacienteSchema>) {
        const payload = {
            ...values,
            cpf: values.cpf.replace(/\D/g, ''),
            telefone: values.telefone.replace(/\D/g, ''),
        };

        createPaciente.mutate(payload, {
            onSuccess: () => {
                toast.success('Paciente criado com sucesso!');
                router.push('/dashboard/pacientes');
            },
            onError: (error: Error) => {
                toast.error(`Erro ao criar paciente: ${error.message}`);
            },
        });
    }

    return (
        <RequireRole allowedRoles={[Papeis.ADMINISTRADOR_PRINCIPAL, Papeis.ENFERMEIRO]}>
            <div className="max-w-5xl mx-auto space-y-12 py-8">
                {/* Hero */}
                <div className="text-center space-y-4">
                    <div className="inline-flex items-center gap-3 rounded-full bg-blue-100 px-6 py-3 text-blue-800">
                        <UserPlus className="h-6 w-6" />
                        <span className="text-lg font-semibold">Novo Paciente</span>
                    </div>
                    <h1 className="text-4xl font-bold text-foreground">Cadastro de Paciente</h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Preencha todos os dados com atenção para garantir um atendimento completo e seguro.
                    </p>
                </div>

                {/* Formulário principal */}
                <Card className="shadow-xl">
                    <CardHeader>
                        <CardTitle className="text-2xl flex items-center gap-3">
                            <UserPlus className="h-7 w-7 text-blue-600" />
                            Informações do Paciente
                        </CardTitle>
                        <CardDescription>
                            Todos os campos marcados com * são obrigatórios.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
                                {/* Dados Pessoais */}
                                <div className="space-y-8">
                                    <h3 className="text-xl font-semibold flex items-center gap-3">
                                        <UserPlus className="h-6 w-6 text-blue-600" />
                                        Dados Pessoais
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <FormField
                                            control={form.control}
                                            name="nome"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Nome completo *</FormLabel>
                                                    <FormControl>
                                                        <Input className="h-12 text-base" placeholder="Nome completo" {...field} />
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
                                                    <FormLabel>CPF *</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            className="h-12 text-base"
                                                            placeholder="000.000.000-00"
                                                            {...field}
                                                            onChange={(e) => field.onChange(formatCPF(e.target.value))}
                                                        />
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
                                                    <FormLabel>CNS *</FormLabel>
                                                    <FormControl>
                                                        <Input className="h-12 text-base" placeholder="Número do Cartão SUS" {...field} />
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
                                                    <FormLabel>Telefone *</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            className="h-12 text-base"
                                                            placeholder="(00) 00000-0000"
                                                            {...field}
                                                            onChange={(e) => field.onChange(formatTelefone(e.target.value))}
                                                        />
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
                                                        <Input className="h-12 text-base" type="email" placeholder="email@exemplo.com" {...field} />
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
                                                    <FormLabel>Data de Nascimento *</FormLabel>
                                                    <FormControl>
                                                        <Input className="h-12 text-base" type="date" {...field} />
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
                                                    <FormLabel>Sexo *</FormLabel>
                                                    <Select onValueChange={field.onChange} value={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger className="h-12 text-base">
                                                                <SelectValue placeholder="Selecione o sexo" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value={Sexo.MASCULINO}>Masculino</SelectItem>
                                                            <SelectItem value={Sexo.FEMININO}>Feminino</SelectItem>
                                                            <SelectItem value={Sexo.OUTRO}>Outro</SelectItem>
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
                                                    <FormLabel>Raça/Cor *</FormLabel>
                                                    <Select onValueChange={field.onChange} value={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger className="h-12 text-base">
                                                                <SelectValue placeholder="Selecione a raça/cor" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value={RacaCor.BRANCA}>Branca</SelectItem>
                                                            <SelectItem value={RacaCor.PRETA}>Preta</SelectItem>
                                                            <SelectItem value={RacaCor.PARDA}>Parda</SelectItem>
                                                            <SelectItem value={RacaCor.AMARELA}>Amarela</SelectItem>
                                                            <SelectItem value={RacaCor.INDIGENA}>Indígena</SelectItem>
                                                            <SelectItem value={RacaCor.NAO_DECLARADO}>Não declarado</SelectItem>
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
                                                    <FormLabel>Escolaridade *</FormLabel>
                                                    <Select onValueChange={field.onChange} value={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger className="h-12 text-base">
                                                                <SelectValue placeholder="Selecione a escolaridade" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value={Escolaridade.SEM_ESCOLARIDADE}>Sem escolaridade</SelectItem>
                                                            <SelectItem value={Escolaridade.FUNDAMENTAL}>Fundamental</SelectItem>
                                                            <SelectItem value={Escolaridade.MEDIO}>Médio</SelectItem>
                                                            <SelectItem value={Escolaridade.SUPERIOR}>Superior</SelectItem>
                                                            <SelectItem value={Escolaridade.POS_GRADUACAO}>Pós-graduação</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>

                                {/* Endereço */}
                                <div className="space-y-8">
                                    <h3 className="text-xl font-semibold flex items-center gap-3">
                                        <Home className="h-6 w-6 text-blue-600" />
                                        Endereço
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <FormField
                                            control={form.control}
                                            name="endereco.logradouro"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Logradouro *</FormLabel>
                                                    <FormControl>
                                                        <Input className="h-12 text-base" {...field} />
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
                                                    <FormLabel>Número *</FormLabel>
                                                    <FormControl>
                                                        <Input className="h-12 text-base" {...field} />
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
                                                    <FormLabel>Bairro *</FormLabel>
                                                    <FormControl>
                                                        <Input className="h-12 text-base" {...field} />
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
                                                    <FormLabel>Cidade *</FormLabel>
                                                    <FormControl>
                                                        <Input className="h-12 text-base" {...field} />
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
                                                    <FormLabel>Estado (UF) *</FormLabel>
                                                    <FormControl>
                                                        <Input className="h-12 text-base" maxLength={2} placeholder="DF" {...field} />
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
                                                    <FormLabel>CEP *</FormLabel>
                                                    <FormControl>
                                                        <Input className="h-12 text-base" placeholder="70000-000" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>

                                {/* Grupos de Risco */}
                                <div className="space-y-8">
                                    <h3 className="text-xl font-semibold flex items-center gap-3">
                                        <AlertCircle className="h-6 w-6 text-orange-600" />
                                        Grupos de Risco (opcional)
                                    </h3>
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                        {gruposRiscoOptions.map((grupo) => (
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
                                                        <FormLabel className="font-normal cursor-pointer">
                                                            {grupo.replace(/_/g, ' ')}
                                                        </FormLabel>
                                                    </FormItem>
                                                )}
                                            />
                                        ))}
                                    </div>
                                </div>

                                {/* Consentimento LGPD */}
                                <FormField
                                    control={form.control}
                                    name="consentimentoLGPD"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-lg border p-4">
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                            <div className="space-y-1 leading-none">
                                                <FormLabel className="text-base font-medium">
                                                    Consentimento LGPD *
                                                </FormLabel>
                                                <FormDescription>
                                                    Declaro que o paciente foi informado e autorizou o tratamento de seus dados pessoais conforme a Lei Geral de Proteção de Dados (LGPD).
                                                </FormDescription>
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Botões */}
                                <div className="flex justify-end gap-4 pt-8">
                                    <Link href="/dashboard/pacientes">
                                        <Button type="button" variant="outline" size="lg">
                                            Cancelar
                                        </Button>
                                    </Link>
                                    <Button
                                        type="submit"
                                        size="lg"
                                        className="px-12"
                                        disabled={createPaciente.isPending}
                                    >
                                        {createPaciente.isPending ? 'Criando...' : 'Criar Paciente'}
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