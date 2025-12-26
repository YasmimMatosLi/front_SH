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
    pacienteNome?: string;
    medicoNome?: string;
}