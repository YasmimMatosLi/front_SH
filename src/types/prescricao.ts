// src/types/prescricao.ts
export interface Prescricao {
    id: string;
    paciente_id: string;
    profissional_id: string;
    unidade_saude_id: string;
    detalhes_prescricao: string;
    cid10: string;
    data_criacao: string;
    medico_nome?: string;
    paciente_nome?: string;
}