// src/queries/prescricaoQueries.ts
import { prescricaoService } from '@/services/prescricaoService';

export const prescricaoKeys = {
    all: ['prescricoes'] as const,
    lists: () => [...prescricaoKeys.all, 'list'] as const,
    details: () => [...prescricaoKeys.all, 'detail'] as const,
    detail: (id: string) => [...prescricaoKeys.details(), id] as const,
    byPaciente: (pacienteId: string) => [...prescricaoKeys.all, 'paciente', pacienteId] as const,
};

export const prescricaoQueries = {
    all: () => ({
        queryKey: prescricaoKeys.all,
        queryFn: prescricaoService.getAll,
        staleTime: 1000 * 60 * 2,
    }),
    detail: (id: string) => ({
        queryKey: prescricaoKeys.detail(id),
        queryFn: () => prescricaoService.getById(id),
        staleTime: 1000 * 60 * 10,
    }),
    byPaciente: (pacienteId: string) => ({
        queryKey: prescricaoKeys.byPaciente(pacienteId),
        queryFn: () => prescricaoService.getByPaciente(pacienteId),
        staleTime: 1000 * 60 * 2,
    }),
};