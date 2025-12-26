// src/app/register-admin/page.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { FormError } from '@/components/FormError';
import { FormSuccess } from '@/components/FormSuccess';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Criar Administrador - Hospital IA',
    description: 'Crie o primeiro administrador do sistema',
};

export default function RegisterAdminPage({
                                              searchParams,
                                          }: {
    searchParams: { message?: string; error?: string };
}) {
    const message = searchParams.message;
    const error = searchParams.error;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 flex items-center justify-center p-4">
            <Card className="w-full max-w-md shadow-2xl border-0">
                <CardHeader className="space-y-4 text-center">
                    <div className="mx-auto w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-3xl font-bold text-white">HI</span>
                    </div>
                    <CardTitle className="text-3xl font-bold text-foreground">Criar Administrador</CardTitle>
                    <CardDescription className="text-lg">
                        Configure o primeiro administrador do sistema
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                    {/* Mensagens */}
                    {message && <FormSuccess message={decodeURIComponent(message)} />}
                    {error && <FormError message={decodeURIComponent(error)} />}

                    {/* Formulário */}
                    <form
                        action={async (formData: FormData) => {
                            'use server';
                            const nome = formData.get('nome') as string;
                            const email = formData.get('email') as string;
                            const password = formData.get('password') as string;
                            const adminSecret = formData.get('adminSecret') as string;

                            try {
                                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register-admin`, {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ nome, email, password, adminSecret }),
                                });

                                if (!response.ok) {
                                    const err = await response.json();
                                    new Error(err.error || 'Erro ao criar administrador');
                                }

                                redirect('/login?success=Administrador criado com sucesso! Faça login.');
                            } catch (err) {
                                const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
                                redirect(`/register-admin?error=${encodeURIComponent(errorMessage)}`);
                            }
                        }}
                        className="space-y-6"
                    >
                        <div className="space-y-2">
                            <Label htmlFor="nome">Nome completo</Label>
                            <Input
                                id="nome"
                                name="nome"
                                type="text"
                                placeholder="Nome do administrador"
                                required
                                className="h-12 text-lg"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="admin@hospitalia.com"
                                required
                                className="h-12 text-lg"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Senha</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="••••••••"
                                required
                                className="h-12 text-lg"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="adminSecret">Chave secreta do administrador</Label>
                            <Input
                                id="adminSecret"
                                name="adminSecret"
                                type="password"
                                placeholder="Digite a chave ADMIN_SECRET"
                                required
                                className="h-12 text-lg"
                            />
                            <p className="text-xs text-muted-foreground">
                                Esta chave foi definida no arquivo .env do backend (ADMIN_SECRET)
                            </p>
                        </div>

                        <div className="flex flex-col gap-4">
                            <Button type="submit" size="lg" className="w-full h-12 text-lg font-semibold">
                                Criar Administrador
                            </Button>

                            <Link href="/login">
                                <Button variant="outline" size="lg" className="w-full h-12 text-lg">
                                    ← Voltar ao login
                                </Button>
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}