// src/app/login/page.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SubmitButton } from '@/components/SubmitButton';
import { FormError } from '@/components/FormError';
import { FormSuccess } from '@/components/FormSuccess';
import { loginAction } from '@/lib/auth';
import Link from 'next/link';
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Login - Hospital IA',
    description: 'Acesse o sistema inteligente de gestão hospitalar',
};

// REMOVA o async e o await searchParams
// Use busca direta via URL (Client Component implícito via form)

export default function LoginPage() {
    // Lê os parâmetros diretamente da URL (Next.js faz isso automaticamente no client)
    const searchParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
    const error = searchParams.get('error');
    const success = searchParams.get('success');

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 flex items-center justify-center p-4">
            <Card className="w-full max-w-md shadow-2xl border-0">
                <CardHeader className="space-y-4 text-center">
                    <div className="mx-auto w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-3xl font-bold text-white">HI</span>
                    </div>
                    <CardTitle className="text-3xl font-bold text-foreground">Hospital IA</CardTitle>
                    <CardDescription className="text-lg">
                        Sistema Inteligente de Gestão Hospitalar
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                    {error && <FormError message={decodeURIComponent(error)} />}
                    {success && <FormSuccess message={decodeURIComponent(success)} />}

                    {/* FORM SEM WRAPPER — ACTION DIRETO */}
                    <form action={loginAction} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="seu@email.com"
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

                        <SubmitButton />
                    </form>

                    <div className="space-y-3 text-center text-sm">
                        <Link href="/forgot-password" className="text-blue-600 hover:underline block">
                            Esqueci minha senha
                        </Link>
                        <p className="text-muted-foreground">
                            Primeiro acesso?{' '}
                            <Link href="/register-admin" className="text-blue-600 hover:underline font-medium">
                                Criar administrador
                            </Link>
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}