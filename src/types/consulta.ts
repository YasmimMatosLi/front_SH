// src/types/consulta.ts
export interface Consulta {
    id: string;
    createdAt: string;
    pacienteId: string;
    profissionalId: string;
    unidadeSaudeId: string;
    data_consulta: string;
    observacoes: string;
    cid10?: string | null;
    paciente_nome?: string;
    medicoNome?: string;
}