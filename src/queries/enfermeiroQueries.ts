// src/queries/enfermeiroQueries.ts
import { enfermeiroService } from '@/services/enfermeiroService';

export const enfermeiroKeys = {
    all: ['enfermeiros'] as const,
    lists: () => [...enfermeiroKeys.all, 'list'] as const,
    details: () => [...enfermeiroKeys.all, 'detail'] as const,
    detail: (id: string) => [...enfermeiroKeys.details(), id] as const,
};

export const enfermeiroQueries = {
    all: () => ({
        queryKey: enfermeiroKeys.all,
        queryFn: enfermeiroService.getAll,
        staleTime: 1000 * 60 * 5,
    }),
    detail: (id: string) => ({
        queryKey: enfermeiroKeys.detail(id),
        queryFn: () => enfermeiroService.getById(id),
        staleTime: 1000 * 60 * 10,
    })
};