import { apiFetch } from '@/lib/api';
import { RelatorioIAResponse, RelatoriosIAResponse, RelatorioIAItem } from '@/types/relatorio-ia';

export const iaService = {
    gerarSurto: (unidadeSaudeId?: string): Promise<RelatorioIAItem> => {
        const params = unidadeSaudeId ? `?unidade_saude_id=${unidadeSaudeId}` : '';
        return apiFetch(`/ia/surto${params}`) as Promise<RelatorioIAItem>;
    },
    analisarRecorrente: (pacienteId: string): Promise<RelatorioIAItem> =>
        apiFetch(`/ia/paciente/${pacienteId}/recorrente`) as Promise<RelatorioIAItem>,
    gerarTriagens: (unidadeSaudeId: string): Promise<RelatorioIAItem> =>
        apiFetch(`/ia/triagens/${unidadeSaudeId}`) as Promise<RelatorioIAItem>,
    getRelatorios: (limit = 20): Promise<RelatoriosIAResponse> =>
        apiFetch(`/ia/relatorios?limit=${limit}`),
    getRelatorioById: (id: string): Promise<RelatorioIAResponse> =>
        apiFetch(`/ia/relatorios/${id}`),
};