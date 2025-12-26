// src/services/consultaService.ts
import { apiFetch } from '@/lib/api';
import { CreateConsultaInput, UpdateConsultaInput } from '@/schemas/consulta';
import { Consulta } from '@/types';

export const consultaService = {
    getAll: (): Promise<Consulta[]> => apiFetch('/consultas') as Promise<Consulta[]>,
    getById: (id: string): Promise<Consulta> => apiFetch(`/consultas/${id}`) as Promise<Consulta>,
    getByPaciente: (pacienteId: string): Promise<Consulta[]> =>
        apiFetch(`/consultas/pacientes/${pacienteId}`) as Promise<Consulta[]>,
    create: (data: CreateConsultaInput): Promise<Consulta> =>
        apiFetch('/consultas', {
            method: 'POST',
            body: JSON.stringify(data),
        }) as Promise<Consulta>,
    update: (id: string, data: UpdateConsultaInput): Promise<Consulta> =>
        apiFetch(`/consultas/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        }) as Promise<Consulta>,
};