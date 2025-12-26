// src/types/auth.ts
import { Papeis } from './enums';

export interface LoginResponse {
    access_token: string;
    refresh_token?: string;
    papel: Papeis;
    expires_in?: number;
    user_id?: string;
}

export interface CurrentUser {
    id: string;
    nome: string;
    email: string;
    papel: Papeis;
    unidadeSaudeId?: string;
    unidadeSaudeNome?: string;
}