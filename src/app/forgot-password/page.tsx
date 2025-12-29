'use client';

// src/app/forgot-password/page.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { FormError } from '@/components/FormError';
import { FormSuccess } from '@/components/FormSuccess';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { authService } from '@/services/authService';

export default function ForgotPasswordPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const message = searchParams.get('message');
    const error = searchParams.get('error');

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 flex items-center justify-center p-4">
            <Card className="w-full max-w-md shadow-2xl border-0">
                <CardHeader className="space-y-4 text-center">
                    <div className="mx-auto w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-3xl font-bold text-white">HI</span>
                    </div>

                    <CardTitle className="text-3xl font-bold text-foreground">
                        Recuperar Senha
                    </CardTitle>

                    <p className="text-lg text-muted-foreground">
                        Informe seu email para receber o link de redefinição
                    </p>
                </CardHeader>

                <CardContent className="space-y-6">
                    {message && <FormSuccess message={message} />}
                    {error && <FormError message={error} />}

                    <form
                        className="space-y-6"
                        onSubmit={async (e) => {
                            e.preventDefault();

                            const formData = new FormData(e.currentTarget);
                            const email = formData.get('email') as string;

                            try {
                                await authService.forgotPassword(email);
                                router.push(
                                    `/forgot-password?message=${encodeURIComponent(
                                        'Se o email existir, você receberá um link de recuperação.'
                                    )}`
                                );
                            } catch {
                                router.push(
                                    `/forgot-password?error=${encodeURIComponent(
                                        'Não foi possível processar a solicitação. Tente novamente.'
                                    )}`
                                );
                            }
                        }}
                    >
                        <div className="space-y-2">
                            <Label htmlFor="email">Email cadastrado</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="seu@email.com"
                                required
                                className="h-12 text-lg"
                            />
                        </div>

                        <div className="flex flex-col gap-4">
                            <Button
                                type="submit"
                                size="lg"
                                className="w-full h-12 text-lg font-semibold"
                            >
                                Enviar link de recuperação
                            </Button>

                            <Link href="/login">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="lg"
                                    className="w-full h-12 text-lg"
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
