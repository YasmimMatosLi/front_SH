'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import {LoginResponse, Papeis} from '@/types';

// src/lib/auth.ts
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
        throw new Error(error.error || 'Credenciais inválidas');
    }

    const result: LoginResponse = await response.json();

    const cookieStore = await cookies();

    cookieStore.set('access_token', result.access_token, {
        httpOnly: false,
        sameSite: 'lax',
        path: '/',
        maxAge: result.expires_in || 3600,
    });

    cookieStore.set('user_role', result.papel, {
        sameSite: 'strict',
        maxAge: result.expires_in || 3600,
        path: '/',
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
    redirect('/login');
}