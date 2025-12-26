// src/queries/triagemQueries.ts
import { triagemService } from '@/services/triagemService';

export const triagemKeys = {
    all: ['triagens'] as const,
    lists: () => [...triagemKeys.all, 'list'] as const,
    details: () => [...triagemKeys.all, 'detail'] as const,
    detail: (id: string) => [...triagemKeys.details(), id] as const,
    byPaciente: (pacienteId: string) => [...triagemKeys.all, 'paciente', pacienteId] as const,
};

export const triagemQueries = {
    all: () => ({
        queryKey: triagemKeys.all,
        queryFn: triagemService.getAll,
        staleTime: 1000 * 60 * 2,
    }),
    detail: (id: string) => ({
        queryKey: triagemKeys.detail(id),
        queryFn: () => triagemService.getById(id),
        staleTime: 1000 * 60 * 10,
    }),
    byPaciente: (pacienteId: string) => ({
        queryKey: triagemKeys.byPaciente(pacienteId),
        queryFn: () => triagemService.getByPaciente(pacienteId),
        staleTime: 1000 * 60 * 2,
    }),
};