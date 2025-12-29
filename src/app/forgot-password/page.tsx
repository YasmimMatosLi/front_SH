// src/app/forgot-password/page.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
    title: 'Recuperar Senha - Hospital IA',
    description: 'Receba um link para redefinir sua senha de acesso ao sistema',
};

export default async function ForgotPasswordPage({
                                                     searchParams,
                                                 }: {
    searchParams: Promise<{ message?: string; error?: string }>;
}) {
    const { message, error } = await searchParams;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-white flex items-center justify-center p-6">
            <Card className="w-full max-w-md shadow-2xl border-0 overflow-hidden bg-white/95 backdrop-blur">
                {/* Header com gradiente azul/teal premium */}
                <div className="bg-gradient-to-r from-blue-600 to-teal-600 px-10 py-12 text-center">
                    <div className="mx-auto w-24 h-24 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                        <span className="text-5xl font-bold text-white">HI</span>
                    </div>
                    <CardTitle className="text-3xl font-bold text-white mt-8">
                        Recuperar Senha
                    </CardTitle>
                    <p className="text-blue-100 text-lg mt-4 max-w-sm mx-auto">
                        Informe seu email para receber o link de redefinição
                    </p>
                </div>

                <CardContent className="pt-10 pb-12 px-10 space-y-8">
                    {/* Mensagens de feedback */}
                    {message && <FormSuccess message={decodeURIComponent(message)} />}
                    {error && <FormError message={decodeURIComponent(error)} />}

                    {/* Formulário - lógica 100% preservada */}
                    <form
                        action={async (formData: FormData) => {
                            'use server';
                            const email = formData.get('email') as string;

                            try {
                                await authService.forgotPassword(email);
                                redirect(`/forgot-password?message=${encodeURIComponent('Se o email existir, você receberá um link de recuperação.')}`);
                            } catch (err) {
                                const errorMessage = err instanceof Error ? err.message : 'Não foi possível processar a solicitação. Tente novamente.';
                                redirect(`/forgot-password?error=${encodeURIComponent(errorMessage)}`);
                            }
                        }}
                        className="space-y-7"
                    >
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-base font-medium">
                                Email cadastrado
                            </Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="seu@email.com"
                                required
                                className="h-12 text-base border-gray-300 focus:border-blue-500 transition-colors"
                            />
                        </div>

                        <div className="space-y-4 pt-4">
                            <Button
                                type="submit"
                                size="lg"
                                className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 shadow-lg transition-all"
                            >
                                Enviar link de recuperação
                            </Button>

                            <Link href="/login" className="block text-center">
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="w-full h-12 text-base border-gray-300 hover:bg-gray-50"
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