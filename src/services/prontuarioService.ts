// src/services/prontuarioService.ts
import { apiFetch } from '@/lib/api';
import { CreateProntuarioInput, UpdateProntuarioInput } from '@/schemas/prontuario';
import { Prontuario } from '@/types';

export const prontuarioService = {
    getAll: (): Promise<Prontuario[]> => apiFetch('/prontuarios') as Promise<Prontuario[]>,
    getById: (id: string): Promise<Prontuario> => apiFetch(`/prontuarios/${id}`) as Promise<Prontuario>,
    getByPaciente: (pacienteId: string): Promise<Prontuario[]> =>
        apiFetch(`/prontuarios/pacientes/${pacienteId}`) as Promise<Prontuario[]>,
    create: (data: CreateProntuarioInput): Promise<Prontuario> =>
        apiFetch('/prontuarios', {
            method: 'POST',
            body: JSON.stringify(data),
        }) as Promise<Prontuario>,
    update: (id: string, data: UpdateProntuarioInput): Promise<Prontuario> =>
        apiFetch(`/prontuarios/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        }) as Promise<Prontuario>,
    getPDF: (id: string): Promise<Blob> =>
        apiFetch(`/prontuarios/${id}/pdf`, { headers: { Accept: 'application/pdf' } }) as Promise<Blob>,
};