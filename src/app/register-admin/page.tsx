// src/app/register-admin/page.tsx
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { FormError } from '@/components/FormError';
import { FormSuccess } from '@/components/FormSuccess';
import { authService } from '@/services/authService';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Criar Administrador - Hospital IA',
    description: 'Crie o primeiro administrador do sistema',
};

// Server Action — mantém exatamente a mesma lógica que estava funcionando no client
async function registerAdminAction(formData: FormData) {
    'use server';

    const data = {
        nome: formData.get('nome') as string,
        email: formData.get('email') as string,
        password: formData.get('password') as string,
        adminSecret: formData.get('adminSecret') as string,
    };

    try {
        await authService.registerAdmin(data);
        redirect('/login?success=Administrador criado com sucesso! Faça login.');
    } catch (err: any) {
        const errorMessage = err.message || 'Erro ao criar administrador. Verifique a chave secreta.';
        redirect(`/register-admin?error=${encodeURIComponent(errorMessage)}`);
    }
}

export default async function RegisterAdminPage({
                                                    searchParams,
                                                }: {
    searchParams: Promise<{ message?: string; error?: string }>;
}) {
    const { message, error } = await searchParams;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-white flex items-center justify-center p-6">
            <Card className="w-full max-w-lg shadow-2xl border-0 overflow-hidden bg-white/95 backdrop-blur">
                <div className="bg-gradient-to-r from-blue-600 to-teal-600 px-10 py-12 text-center">
                    <div className="mx-auto w-24 h-24 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                        <span className="text-5xl font-bold text-white">HI</span>
                    </div>
                    <CardTitle className="text-3xl font-bold text-white mt-8">
                        Criar Primeiro Administrador
                    </CardTitle>
                    <CardDescription className="text-blue-100 text-lg mt-3 max-w-md mx-auto">
                        Configure o acesso principal do sistema Hospital IA
                    </CardDescription>
                </div>

                <CardContent className="pt-10 pb-12 px-10 space-y-8">
                    {message && <FormSuccess message={decodeURIComponent(message)} />}
                    {error && <FormError message={decodeURIComponent(error)} />}

                    <form action={registerAdminAction} className="space-y-7">
                        <div className="space-y-2">
                            <Label htmlFor="nome" className="text-base font-medium">
                                Nome completo
                            </Label>
                            <Input
                                id="nome"
                                name="nome"
                                type="text"
                                placeholder="Dr(a). Nome Sobrenome"
                                required
                                className="h-12 text-base border-gray-300 focus:border-blue-500"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-base font-medium">
                                Email institucional
                            </Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="admin@hospitalia.com"
                                required
                                className="h-12 text-base"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-base font-medium">
                                Senha segura
                            </Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="Mínimo 8 caracteres"
                                required
                                className="h-12 text-base"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="adminSecret" className="text-base font-medium">
                                Chave secreta (ADMIN_SECRET)
                            </Label>
                            <Input
                                id="adminSecret"
                                name="adminSecret"
                                type="password"
                                placeholder="Do arquivo .env do backend"
                                required
                                className="h-12 text-base font-mono"
                            />
                            <p className="text-sm text-muted-foreground">
                                Esta chave está configurada no backend
                            </p>
                        </div>

                        <div className="pt-6 space-y-4">
                            <Button
                                type="submit"
                                size="lg"
                                className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 shadow-lg"
                            >
                                Criar Administrador
                            </Button>

                            <Link href="/login" className="block text-center">
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="w-full h-12 text-base"
                                >
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