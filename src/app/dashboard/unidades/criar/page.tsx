// src/app/dashboard/unidades/criar/page.tsx
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useCreateUnidade } from '@/hooks/useUnidadeSaude';
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
import { CreateUnidadeSaudeSchema } from '@/schemas/unidade-saude';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {Papeis, TipoUnidadeSaude} from '@/types';
import { RequireRole } from "@/components/RequireRole";

export default function CriarUnidadePage() {
    const router = useRouter();
    const createUnidade = useCreateUnidade();

    const form = useForm<z.infer<typeof CreateUnidadeSaudeSchema>>({
        resolver: zodResolver(CreateUnidadeSaudeSchema),
        defaultValues: {
            nome: '',
            tipo: TipoUnidadeSaude.HOSPITAL,
            cnes: '',
            telefone: '',
            servicosEssenciais: [],
            servicosAmpliados: [],
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

    function onSubmit(values: z.infer<typeof CreateUnidadeSaudeSchema>) {
        createUnidade.mutate(values, {
            onSuccess: () => {
                toast.success('Unidade criada com sucesso!');
                router.push('/dashboard/unidades');
            },
            onError: (error) => {
                toast.error(`Erro ao criar unidade: ${error.message}`);
            },
        });
    }

    return (
        <RequireRole allowedRoles={[Papeis.ADMINISTRADOR_PRINCIPAL]}>
        <div className="space-y-8">
            <Header
                title="Nova Unidade de Saúde"
                description="Cadastre uma nova unidade no sistema"
            />

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
                                            <FormLabel>Nome da Unidade</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Hospital Municipal" {...field} />
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
                                            <FormLabel>Tipo de Unidade</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Selecione" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value={TipoUnidadeSaude.HOSPITAL}>Hospital</SelectItem>
                                                    <SelectItem value={TipoUnidadeSaude.UPA}>UPA</SelectItem>
                                                    <SelectItem value={TipoUnidadeSaude.UBS}>UBS</SelectItem>
                                                </SelectContent>
                                            </Select>
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
                                                <Input placeholder="1234567" {...field} />
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
                                                <Input placeholder="(00) 00000-0000" {...field} />
                                            </FormControl>
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
                                                    <Input maxLength={2} placeholder="SP" {...field} />
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
                                                    <Input placeholder="00000000" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            {/* Serviços — simplificado (pode expandir com multi-select depois) */}
                            <div className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="servicosEssenciais"
                                    render={() => (
                                        <FormItem>
                                            <FormLabel>Serviços Essenciais (separados por vírgula)</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Clínica Geral, Pediatria, Urgência"
                                                    onChange={(e) => form.setValue('servicosEssenciais', e.target.value.split(',').map(s => s.trim()))}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="flex gap-4">
                                <Button type="submit" size="lg" disabled={createUnidade.isPending}>
                                    {createUnidade.isPending ? 'Criando...' : 'Criar Unidade'}
                                </Button>
                                <Link href="/dashboard/unidades">
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