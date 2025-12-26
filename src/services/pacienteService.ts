// src/services/pacienteService.ts
import { apiFetch } from '@/lib/api';
import { CreatePacienteInput, UpdatePacienteInput } from '@/schemas/paciente';
import { Paciente } from '@/types';

export const pacienteService = {
    getAll: (): Promise<Paciente[]> => apiFetch('/pacientes') as Promise<Paciente[]>,
    getById: (id: string): Promise<Paciente> => apiFetch(`/pacientes/${id}`) as Promise<Paciente>,
    create: (data: CreatePacienteInput): Promise<Paciente> =>
        apiFetch('/pacientes', {
            method: 'POST',
            body: JSON.stringify(data),
        }) as Promise<Paciente>,
    update: (id: string, data: UpdatePacienteInput): Promise<Paciente> =>
        apiFetch(`/pacientes/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        }) as Promise<Paciente>,
    delete: (id: string): Promise<void> =>
        apiFetch(`/pacientes/${id}`, { method: 'DELETE' }) as Promise<void>,
    getHistorico: (id: string): Promise<any> =>
        apiFetch(`/pacientes/${id}/historico`) as Promise<any>,
};