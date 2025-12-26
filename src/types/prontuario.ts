// src/types/prontuario.ts
export interface Prontuario {
    id: string;
    createdAt: string;
    pacienteId: string;
    profissionalId: string;
    unidadeSaudeId: string;
    data: string;
    descricao: string;
    cid10: string;
    paciente_nome?: string;
    profissional_nome?: string;
}