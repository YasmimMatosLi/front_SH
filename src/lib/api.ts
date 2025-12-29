// src/lib/api.ts
const API_URL = process.env.API_BASE_URL ?? 'http://localhost:3000/api';

if (!API_URL) {
    throw new Error('API_BASE_URL não definida');
}

export async function apiFetch<T>(
    endpoint: string,
    options: RequestInit & { public?: boolean } = {}
): Promise<T> {
    let token: string | undefined;

    if (!options.public) {
        if (typeof document === 'undefined') {
            // Server-side
            const { cookies } = await import('next/headers');
            token = (await cookies()).get('access_token')?.value;
        } else {
            // Client-side
            token = document.cookie
                .split('; ')
                .find(c => c.startsWith('access_token='))
                ?.split('=')[1];
        }
    }

    const res = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
            ...(token && { Authorization: `Bearer ${token}` }),
            'Content-Type': 'application/json',
            ...options.headers,
        },
    });

    if (res.status === 401 && !options.public) {
        if (typeof window !== 'undefined') {
            window.location.href = '/login';
        }
        throw new Error('Não autenticado');
    }

    if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.error || 'Erro');
    }

    return res.json();
}
