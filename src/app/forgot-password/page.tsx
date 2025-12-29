'use client';

import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { FormError } from '@/components/FormError';
import { FormSuccess } from '@/components/FormSuccess';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { authService } from '@/services/authService';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';

export default function ForgotPasswordPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isLoading, setIsLoading] = useState(false);

    const message = searchParams.get('message');
    const error = searchParams.get('error');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        const email = new FormData(e.currentTarget).get('email') as string;

        try {
            await authService.forgotPassword(email);
            router.push(`/forgot-password?message=${encodeURIComponent('Se o email existir, você receberá um link de recuperação.')}`);
        } catch {
            router.push(`/forgot-password?error=${encodeURIComponent('Não foi possível processar a solicitação. Tente novamente.')}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-white flex items-center justify-center p-6">
            <Card className="w-full max-w-md shadow-2xl border-0 overflow-hidden bg-white/95 backdrop-blur">
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
                    {message && <FormSuccess message={decodeURIComponent(message)} />}
                    {error && <FormError message={decodeURIComponent(error)} />}

                    <form onSubmit={handleSubmit} className="space-y-7">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-base font-medium">Email cadastrado</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="seu@email.com"
                                required
                                disabled={isLoading}
                                className="h-12 text-base"
                            />
                        </div>

                        <Button
                            type="submit"
                            size="lg"
                            disabled={isLoading}
                            className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 shadow-lg"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                                    Enviando...
                                </>
                            ) : (
                                'Enviar link de recuperação'
                            )}
                        </Button>

                        <Link href="/login" className="block text-center">
                            <Button variant="outline" size="lg" disabled={isLoading} className="w-full h-12">
                                ← Voltar ao login
                            </Button>
                        </Link>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}