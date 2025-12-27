// src/lib/auth.ts
'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { LoginResponse, Papeis } from '@/types';

export async function loginAction(formData: FormData) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
        const error = await response.json();
        redirect(`/login?error=${encodeURIComponent(error.error || 'Credenciais inválidas')}`);
    }

    const result: LoginResponse = await response.json();
    const cookieStore = await cookies();

    // Deleta cookies antigos primeiro
    cookieStore.delete('access_token');
    cookieStore.delete('user_role');

    // Define novos cookies
    cookieStore.set('access_token', result.access_token, {
        httpOnly: false,
        sameSite: 'lax',
        path: '/',
        maxAge: result.expires_in || 3600,
    });

    cookieStore.set('user_role', result.papel, {
        httpOnly: false,
        sameSite: 'lax',
        path: '/',
        maxAge: result.expires_in || 3600,
    });

    redirect('/dashboard');
}

export async function getCurrentUser() {
    const cookieStore = await cookies();
    const token = cookieStore.get('access_token')?.value;
    const role = cookieStore.get('user_role')?.value as Papeis | undefined;

    if (!token || !role) {
        return null;
    }

    return { token, role };
}

export async function requireAuth() {
    const user = await getCurrentUser();
    if (!user) {
        redirect('/login');
    }
    return user;
}

export async function logoutAction() {
    const cookieStore = await cookies();
    cookieStore.delete('access_token');
    cookieStore.delete('user_role');
    redirect('/login?success=Logout realizado com sucesso');
}