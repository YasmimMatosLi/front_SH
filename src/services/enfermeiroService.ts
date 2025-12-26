// src/services/enfermeiroService.ts
import { apiFetch } from '@/lib/api';
import { CreateEnfermeiroInput, UpdateEnfermeiroInput } from '@/schemas/enfermeiro';
import { Enfermeiro } from '@/types';

export const enfermeiroService = {
    getAll: (): Promise<Enfermeiro[]> => apiFetch('/enfermeiros') as Promise<Enfermeiro[]>,
    getById: (id: string): Promise<Enfermeiro> => apiFetch(`/enfermeiros/${id}`) as Promise<Enfermeiro>,
    create: (data: CreateEnfermeiroInput): Promise<Enfermeiro> =>
        apiFetch('/enfermeiros', {
            method: 'POST',
            body: JSON.stringify(data),
        }) as Promise<Enfermeiro>,
    update: (id: string, data: UpdateEnfermeiroInput): Promise<Enfermeiro> =>
        apiFetch(`/enfermeiros/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        }) as Promise<Enfermeiro>,
    delete: (id: string): Promise<void> =>
        apiFetch(`/enfermeiros/${id}`, { method: 'DELETE' }) as Promise<void>,
};