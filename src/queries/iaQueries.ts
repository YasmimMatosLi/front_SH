import { iaService } from '@/services/iaService';
import { RelatorioIAItem, RelatorioIAResponse, RelatoriosIAResponse } from "@/types/relatorio-ia";

export const iaKeys = {
    relatorios: (limit?: number) => ['ia', 'relatorios', limit ?? 'all'] as const,
    relatorio: (id: string) => ['ia', 'relatorios', id] as const,
    surto: (unidadeSaudeId?: string) => ['ia', 'relatorios', 'surto', unidadeSaudeId ?? 'global'] as const,
    recorrente: (pacienteId: string) => ['ia', 'relatorios', 'recorrente', pacienteId] as const,
    triagens: (unidadeSaudeId: string) => ['ia', 'relatorios', 'triagens', unidadeSaudeId] as const,
};

export const iaQueries = {
    relatorios: (limit = 20) => ({
        queryKey: iaKeys.relatorios(limit),
        queryFn: () => iaService.getRelatorios(limit),
        select: (data: RelatoriosIAResponse) => data.relatorios,
        staleTime: 1000 * 60 * 10,
    }),
    relatorio: (id: string) => ({
        queryKey: iaKeys.relatorio(id),
        queryFn: () => iaService.getRelatorioById(id),
        select: (data: RelatorioIAResponse) => data.relatorio,
        staleTime: 1000 * 60 * 15,
    }),
    surto: (unidadeSaudeId?: string) => ({
        queryKey: iaKeys.surto(unidadeSaudeId),
        queryFn: () => iaService.gerarSurto(unidadeSaudeId),
        staleTime: 0,
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