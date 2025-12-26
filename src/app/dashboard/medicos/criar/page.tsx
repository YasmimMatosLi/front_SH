// src/app/dashboard/medicos/criar/page.tsx
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Resolver } from 'react-hook-form';
import { z } from 'zod';
import { useCreateMedico } from '@/hooks/useMedico';
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
import { formatCPF, formatTelefone } from '@/lib/utils';
import { CreateMedicoSchema } from '@/schemas/medico';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {Sexo, RacaCor, Escolaridade, Papeis} from '@/types';
import {RequireRole} from "@/components/RequireRole";

export default function CriarMedicoPage() {
    const router = useRouter();
    const createMedico = useCreateMedico();

    const form = useForm<z.infer<typeof CreateMedicoSchema>>({
        resolver: zodResolver(CreateMedicoSchema) as Resolver<z.infer<typeof CreateMedicoSchema>>,
        defaultValues: {
            nome: '',
            cpf: '',
            cns: '',
            dataNascimento: '',
            sexo: Sexo.SELECIONE,
            racaCor: RacaCor.SELECIONE,
            escolaridade: Escolaridade.SELECIONE,
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
            senha: '',
            crm: '',
            dataContratacao: new Date().toISOString().split('T')[0],
        } as z.infer<typeof CreateMedicoSchema>,
    });


    function onSubmit(values: z.infer<typeof CreateMedicoSchema>) {
        createMedico.mutate(values, {
            onSuccess: () => {
                toast.success('Médico criado com sucesso!');
                router.push('/dashboard/medicos');
            },
            onError: (error) => {
                toast.error(`Erro ao criar médico: ${error.message}`);
            },
        });
    }

    return (
        <RequireRole allowedRoles={[Papeis.ADMINISTRADOR_PRINCIPAL]}>
        <div className="space-y-8">
            <Header
                title="Novo Médico"
                description="Cadastre um novo médico no sistema"
            />

            <Card>
                <CardHeader>
                    <CardTitle>Dados do Médico</CardTitle>
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
                                            <FormLabel>Email</FormLabel>
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

                                <FormField
                                    control={form.control}
                                    name="crm"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>CRM</FormLabel>
                                            <FormControl>
                                                <Input placeholder="12345-SP" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="flex gap-4">
                                <Button type="submit" size="lg" disabled={createMedico.isPending}>
                                    {createMedico.isPending ? 'Criando...' : 'Criar Médico'}
                                </Button>
                                <Link href="/dashboard/medicos">
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