// src/services/unidadeSaudeService.ts
import { apiFetch } from '@/lib/api';
import { CreateUnidadeSaudeInput, UpdateUnidadeSaudeInput } from '@/schemas/unidade-saude';
import { UnidadeSaude } from '@/types';

export const unidadeSaudeService = {
    getAll: (): Promise<UnidadeSaude[]> => apiFetch('/unidades-saude') as Promise<UnidadeSaude[]>,
    getById: (id: string): Promise<UnidadeSaude> => apiFetch(`/unidades-saude/${id}`) as Promise<UnidadeSaude>,
    create: (data: CreateUnidadeSaudeInput): Promise<UnidadeSaude> =>
        apiFetch('/unidades-saude', {
            method: 'POST',
            body: JSON.stringify(data),
        }) as Promise<UnidadeSaude>,
    update: (id: string, data: UpdateUnidadeSaudeInput): Promise<UnidadeSaude> =>
        apiFetch(`/unidades-saude/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        }) as Promise<UnidadeSaude>,
    delete: (id: string): Promise<void> =>
        apiFetch(`/unidades-saude/${id}`, { method: 'DELETE' }) as Promise<void>,
    getFuncionarios: (id: string): Promise<any> =>
        apiFetch(`/unidades-saude/${id}/funcionarios`) as Promise<any>,
    associarFuncionario: (unidadeId: string, funcionarioId: string): Promise<void> =>
        apiFetch(`/unidades-saude/${unidadeId}/funcionarios/${funcionarioId}`, { method: 'POST' }) as Promise<void>,
};