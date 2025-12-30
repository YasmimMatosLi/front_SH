export interface ResumoExecutivo {
    risco: 'Baixo' | 'Moderado' | 'Alto';
    conclusao: string;
    periodo: string;
}

export interface Indicadores {
    casos_respiratorios: number;
    consultas_totais: number;
    percentual: number;
    confiabilidade: 'alta' | 'media' | 'baixa';
}

export interface RelatorioIAItem {
    id: string;
    tipo: string;
    resumo: ResumoExecutivo;
    indicadores: Indicadores;
    recomendacoes: string[];
    conteudo: string;
    unidade_saude_id: string | null;
    criado_em: string;
    criado_por: string | null;
    dados_agregados?: any;
}

export interface RelatorioIAResponse {
    sucesso: boolean;
    relatorio: RelatorioIAItem;
}

export interface RelatoriosIAResponse {
    sucesso: boolean;
    relatorios: RelatorioIAItem[];
}