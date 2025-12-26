// src/queries/iaQueries.ts
import { iaService } from '@/services/iaService';

export const iaKeys = {
    relatorios: ['ia', 'relatorios'] as const,
    surto: (unidadeSaudeId?: string) => [...iaKeys.relatorios, 'surto', unidadeSaudeId ?? 'global'] as const,
    recorrente: (pacienteId: string) => [...iaKeys.relatorios, 'recorrente', pacienteId] as const,
    triagens: (unidadeSaudeId: string) => [...iaKeys.relatorios, 'triagens', unidadeSaudeId] as const,
};

export const iaQueries = {
    relatorios: (limit = 20) => ({
        queryKey: iaKeys.relatorios,
        queryFn: () => iaService.getRelatorios(limit),
        staleTime: 1000 * 60 * 10,
    }),
    surto: (unidadeSaudeId?: string) => ({
        queryKey: iaKeys.surto(unidadeSaudeId),
        queryFn: () => iaService.gerarSurto(unidadeSaudeId),
        staleTime: 0, // sempre fresco
    }),
    recorrente: (pacienteId: string) => ({
        queryKey: iaKeys.recorrente(pacienteId),
        queryFn: () => iaService.analisarRecorrente(pacienteId),
        staleTime: 0,
    }),
    triagens: (unidadeSaudeId: string) => ({
        queryKey: iaKeys.triagens(unidadeSaudeId),
        queryFn: () => iaService.gerarTriagens(unidadeSaudeId),
        staleTime: 0,
    }),
};