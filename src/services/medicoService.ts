// src/services/medicoService.ts
import { apiFetch } from '@/lib/api';
import { CreateMedicoInput, UpdateMedicoInput } from '@/schemas/medico';
import { Medico } from '@/types';

export const medicoService = {
    getAll: (): Promise<Medico[]> => apiFetch('/medicos') as Promise<Medico[]>,
    getById: (id: string): Promise<Medico> => apiFetch(`/medicos/${id}`) as Promise<Medico>,
    create: (data: CreateMedicoInput): Promise<Medico> =>
        apiFetch('/medicos', {
            method: 'POST',
            body: JSON.stringify(data),
        }) as Promise<Medico>,
    update: (id: string, data: UpdateMedicoInput): Promise<Medico> =>
        apiFetch(`/medicos/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        }) as Promise<Medico>,
    delete: (id: string): Promise<void> =>
        apiFetch(`/medicos/${id}`, { method: 'DELETE' }) as Promise<void>,
};