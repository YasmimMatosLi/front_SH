// src/queries/unidadeSaudeQueries.ts
import { unidadeSaudeService } from '@/services/unidadeSaudeService';

export const unidadeSaudeKeys = {
    all: ['unidades-saude'] as const,
    lists: () => [...unidadeSaudeKeys.all, 'list'] as const,
    details: () => [...unidadeSaudeKeys.all, 'detail'] as const,
    detail: (id: string) => [...unidadeSaudeKeys.details(), id] as const,
    funcionarios: (id: string) => [...unidadeSaudeKeys.detail(id), 'funcionarios'] as const,
};

export const unidadeSaudeQueries = {
    all: () => ({
        queryKey: unidadeSaudeKeys.all,
        queryFn: unidadeSaudeService.getAll,
        staleTime: 1000 * 60 * 5,
    }),
    detail: (id: string) => ({
        queryKey: unidadeSaudeKeys.detail(id),
        queryFn: () => unidadeSaudeService.getById(id),
        staleTime: 1000 * 60 * 10,
    }),
    funcionarios: (id: string) => ({
        queryKey: unidadeSaudeKeys.funcionarios(id),
        queryFn: () => unidadeSaudeService.getFuncionarios(id),
        staleTime: 1000 * 60 * 5,
    }),
};