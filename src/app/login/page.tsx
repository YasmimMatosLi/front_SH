import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { FormError } from '@/components/FormError';
import { FormSuccess } from '@/components/FormSuccess';
import Link from 'next/link';
import { Metadata } from 'next';
import { loginAction } from '@/lib/auth';

export const metadata: Metadata = {
    title: 'Login - Hospital IA',
    description: 'Acesse o sistema inteligente de gestão hospitalar',
};

export default async function LoginPage({
                                            searchParams,
                                        }: {
    searchParams: Promise<{ error?: string; success?: string }>;
}) {
    const { error, success } = await searchParams;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-white flex items-center justify-center p-6">
            <Card className="w-full max-w-md shadow-2xl border-0 overflow-hidden bg-white/95 backdrop-blur">
                <div className="bg-gradient-to-r from-blue-600 to-teal-600 px-10 py-12 text-center">
                    <div className="mx-auto w-24 h-24 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                        <span className="text-5xl font-bold text-white">HI</span>
                    </div>
                    <CardTitle className="text-3xl font-bold text-white mt-8">
                        Hospital IA
                    </CardTitle>
                    <CardDescription className="text-blue-100 text-lg mt-3">
                        Sistema Inteligente de Gestão Hospitalar
                    </CardDescription>
                </div>

                <CardContent className="pt-10 pb-12 px-10 space-y-8">
                    {error && <FormError message={decodeURIComponent(error)} />}
                    {success && <FormSuccess message={decodeURIComponent(success)} />}

                    <form action={loginAction} className="space-y-7">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-base font-medium">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="seu@email.com"
                                required
                                className="h-12 text-base border-gray-300 focus:border-blue-500"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-base font-medium">Senha</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="••••••••"
                                required
                                className="h-12 text-base"
                            />
                        </div>

                        <Button
                            type="submit"
                            size="lg"
                            className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 shadow-lg"
                        >
                            Entrar no Sistema
                        </Button>
                    </form>

                    <div className="space-y-4 text-center text-sm">
                        <Link href="/forgot-password" className="text-blue-600 hover:underline block font-medium">
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