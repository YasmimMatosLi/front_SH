const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export async function apiFetch<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {

    const token = document.cookie
        .split('; ')
        .find(c => c.startsWith('access_token='))
        ?.split('=')[1];

    const res = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
            ...(token && { Authorization: `Bearer ${token}` }),
            'Content-Type': 'application/json',
            ...options.headers,
        },
    });

    if (res.status === 401) {
        window.location.href = '/login';
        throw new Error('Não autenticado');
    }

    if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.error || 'Erro');
    }

    return res.json();
}
