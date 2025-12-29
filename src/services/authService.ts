// src/services/authService.ts
import { apiFetch } from '@/lib/api';
import { LoginResponse, CurrentUser } from '@/types';

export const authService = {
    login: (email: string, password: string): Promise<LoginResponse> =>
        apiFetch('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        }) as Promise<LoginResponse>,

    registerAdmin: (data: any): Promise<any> =>
        apiFetch('/auth/register-admin', {
            method: 'POST',
            body: JSON.stringify(data),
        }) as Promise<any>,

    forgotPassword: (email: string): Promise<any> =>
        apiFetch('/auth/forgot-password', {
            method: 'POST',
            body: JSON.stringify({ email }),
            public: true,
        }) as Promise<any>,

    logout: (): Promise<void> =>
        apiFetch('/auth/logout', { method: 'POST' }).catch(() => {}) as Promise<void>,

    me: (): Promise<CurrentUser> =>
        apiFetch('/auth/me', { method: 'GET' }) as Promise<CurrentUser>,
};