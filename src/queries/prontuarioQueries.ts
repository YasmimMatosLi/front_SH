// src/queries/prontuarioQueries.ts
import { prontuarioService } from '@/services/prontuarioService';

export const prontuarioKeys = {
    all: ['prontuarios'] as const,
    lists: () => [...prontuarioKeys.all, 'list'] as const,
    details: () => [...prontuarioKeys.all, 'detail'] as const,
    detail: (id: string) => [...prontuarioKeys.details(), id] as const,
    byPaciente: (pacienteId: string) => [...prontuarioKeys.all, 'paciente', pacienteId] as const,
};

export const prontuarioQueries = {
    all: () => ({
        queryKey: prontuarioKeys.all,
        queryFn: prontuarioService.getAll,
        staleTime: 1000 * 60 * 2,
    }),
    detail: (id: string) => ({
        queryKey: prontuarioKeys.detail(id),
        queryFn: () => prontuarioService.getById(id),
        staleTime: 1000 * 60 * 10,
    }),
    byPaciente: (pacienteId: string) => ({
        queryKey: prontuarioKeys.byPaciente(pacienteId),
        queryFn: () => prontuarioService.getByPaciente(pacienteId),
        staleTime: 1000 * 60 * 2,
    }),
};