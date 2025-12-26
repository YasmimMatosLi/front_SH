// src/queries/consultaQueries.ts
import { consultaService } from '@/services';

export const consultaKeys = {
    all: ['consultas'] as const,
    lists: () => [...consultaKeys.all, 'list'] as const,
    details: () => [...consultaKeys.all, 'detail'] as const,
    detail: (id: string) => [...consultaKeys.details(), id] as const,
    byPaciente: (pacienteId: string) => [...consultaKeys.all, 'paciente', pacienteId] as const,
};

export const consultaQueries = {
    all: () => ({
        queryKey: consultaKeys.all,
        queryFn: consultaService.getAll,
        staleTime: 1000 * 60 * 2,
    }),
    detail: (id: string) => ({
        queryKey: consultaKeys.detail(id),
        queryFn: () => consultaService.getById(id),
        staleTime: 1000 * 60 * 10,
    }),
    byPaciente: (pacienteId: string) => ({
        queryKey: consultaKeys.byPaciente(pacienteId),
        queryFn: () => consultaService.getByPaciente(pacienteId),
        staleTime: 1000 * 60 * 2,
    }),
};