// src/services/triagemService.ts
import { apiFetch } from '@/lib/api';
import { CreateTriagemInput, UpdateTriagemInput } from '@/schemas/triagem';
import { Triagem } from '@/types';

export const triagemService = {
    getAll: (): Promise<Triagem[]> => apiFetch('/triagens') as Promise<Triagem[]>,
    getById: (id: string): Promise<Triagem> => apiFetch(`/triagens/${id}`) as Promise<Triagem>,
    getByPaciente: (pacienteId: string): Promise<Triagem[]> =>
        apiFetch(`/triagens/pacientes/${pacienteId}`) as Promise<Triagem[]>,
    create: (data: CreateTriagemInput): Promise<Triagem> =>
        apiFetch('/triagens', {
            method: 'POST',
            body: JSON.stringify(data),
        }) as Promise<Triagem>,
    update: (id: string, data: UpdateTriagemInput): Promise<Triagem> =>
        apiFetch(`/triagens/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        }) as Promise<Triagem>,
};