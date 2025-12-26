// src/queries/medicoQueries.ts
import { medicoService } from '@/services/medicoService';

export const medicoKeys = {
    all: ['medicos'] as const,
    lists: () => [...medicoKeys.all, 'list'] as const,
    details: () => [...medicoKeys.all, 'detail'] as const,
    detail: (id: string) => [...medicoKeys.details(), id] as const,
};

export const medicoQueries = {
    all: () => ({
        queryKey: medicoKeys.all,
        queryFn: medicoService.getAll,
        staleTime: 1000 * 60 * 5,
    }),
    detail: (id: string) => ({
        queryKey: medicoKeys.detail(id),
        queryFn: () => medicoService.getById(id),
        staleTime: 1000 * 60 * 10,
    }),
};