// src/services/iaService.ts
import { apiFetch } from '@/lib/api';
import { RelatorioIA } from '@/types';

export const iaService = {
    gerarSurto: (unidadeSaudeId?: string): Promise<string> => {
        const params = unidadeSaudeId ? `?unidade_saude_id=${unidadeSaudeId}` : '';
        return apiFetch(`/ia/surto${params}`) as Promise<string>;
    },
    analisarRecorrente: (pacienteId: string): Promise<string> =>
        apiFetch(`/ia/paciente/${pacienteId}/recorrente`) as Promise<string>,
    gerarTriagens: (unidadeSaudeId: string): Promise<string> =>
        apiFetch(`/ia/triagens/${unidadeSaudeId}`) as Promise<string>,
    getRelatorios: (limit = 20): Promise<RelatorioIA[]> =>
        apiFetch(`/ia/relatorios?limit=${limit}`) as Promise<RelatorioIA[]>,
};