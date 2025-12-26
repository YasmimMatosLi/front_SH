// src/services/prescricaoService.ts
import { apiFetch } from '@/lib/api';
import { CreatePrescricaoInput, UpdatePrescricaoInput } from '@/schemas/prescricao';
import { Prescricao } from '@/types';

export const prescricaoService = {
    getAll: (): Promise<Prescricao[]> => apiFetch('/prescricoes') as Promise<Prescricao[]>,
    getById: (id: string): Promise<Prescricao> => apiFetch(`/prescricoes/${id}`) as Promise<Prescricao>,
    getByPaciente: (pacienteId: string): Promise<Prescricao[]> =>
        apiFetch(`/prescricoes/pacientes/${pacienteId}`) as Promise<Prescricao[]>,
    create: (data: CreatePrescricaoInput): Promise<Prescricao> =>
        apiFetch('/prescricoes', {
            method: 'POST',
            body: JSON.stringify(data),
        }) as Promise<Prescricao>,
    update: (id: string, data: UpdatePrescricaoInput): Promise<Prescricao> =>
        apiFetch(`/prescricoes/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        }) as Promise<Prescricao>,
    getPDF: (id: string): Promise<Blob> =>
        apiFetch(`/prescricoes/${id}/pdf`, { headers: { Accept: 'application/pdf' } }) as Promise<Blob>,
};