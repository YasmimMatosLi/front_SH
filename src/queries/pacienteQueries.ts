// src/queries/pacienteQueries.ts
import { pacienteService } from '@/services/pacienteService';

export const pacienteKeys = {
    all: ['pacientes'] as const,
    lists: () => [...pacienteKeys.all, 'list'] as const,
    details: () => [...pacienteKeys.all, 'detail'] as const,
    detail: (id: string) => [...pacienteKeys.details(), id] as const,
    historico: (id: string) => [...pacienteKeys.detail(id), 'historico'] as const,
};

export const pacienteQueries = {
    all: () => ({
        queryKey: pacienteKeys.all,
        queryFn: pacienteService.getAll,
        staleTime: 1000 * 60 * 5, // 5 minutos
    }),
    detail: (id: string) => ({
        queryKey: pacienteKeys.detail(id),
        queryFn: () => pacienteService.getById(id),
        staleTime: 1000 * 60 * 10, // 10 minutos
    }),
    historico: (id: string) => ({
        queryKey: pacienteKeys.historico(id),
        queryFn: () => pacienteService.getHistorico(id),
        staleTime: 1000 * 60 * 2, // 2 minutos
    }),
};