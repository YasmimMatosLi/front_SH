// src/types/relatorio-ia.ts
export interface RelatorioIA {
    id: string;
    tipo: string;
    conteudo: string;
    dados_agregados?: Record<string, unknown>;
    unidade_saude_id?: string;
    criado_por?: string;
    criado_em: string;
}