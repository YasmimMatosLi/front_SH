// src/app/dashboard/enfermeiros/criar/page.tsx
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import {Resolver, useForm} from 'react-hook-form';
import { z } from 'zod';
import { useCreateEnfermeiro } from '@/hooks/useEnfermeiro';
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
import { CreateEnfermeiroSchema } from '@/schemas/enfermeiro';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {Sexo, RacaCor, Escolaridade, Papeis} from '@/types';
import {RequireRole} from "@/components/RequireRole";

export default function CriarEnfermeiroPage() {
    const router = useRouter();
    const createEnfermeiro = useCreateEnfermeiro();

    const form = useForm<z.infer<typeof CreateEnfermeiroSchema>>({
        resolver: zodResolver(CreateEnfermeiroSchema) as Resolver<z.infer<typeof CreateEnfermeiroSchema>>,
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
            coren: '',
            dataContratacao: new Date().toISOString().split('T')[0],
        } as z.infer<typeof CreateEnfermeiroSchema>,
    });

    function onSubmit(values: z.infer<typeof CreateEnfermeiroSchema>) {
        createEnfermeiro.mutate(values, {
            onSuccess: () => {
                toast.success('Enfermeiro criado com sucesso!');
                router.push('/dashboard/enfermeiros');
            },
            onError: (error) => {
                toast.error(`Erro ao criar enfermeiro: ${error.message}`);
            },
        });
    }

    return (
        <RequireRole allowedRoles={[Papeis.ADMINISTRADOR_PRINCIPAL]}>
        <div className="space-y-8">
            <Header
                title="Novo Enfermeiro"
                description="Cadastre um novo enfermeiro no sistema"
            />

            <Card>
                <CardHeader>
                    <CardTitle>Dados do Enfermeiro</CardTitle>
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
                                    name="coren"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>COREN</FormLabel>
                                            <FormControl>
                                                <Input placeholder="123456-SP" {...field} />
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
                            </div>

                            <div className="flex gap-4">
                                <Button type="submit" size="lg" disabled={createEnfermeiro.isPending}>
                                    {createEnfermeiro.isPending ? 'Criando...' : 'Criar Enfermeiro'}
                                </Button>
                                <Link href="/dashboard/enfermeiros">
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