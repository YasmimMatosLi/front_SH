// src/types/triagem.ts
import { NivelGravidade } from './enums';

export interface SinaisVitais {
    pressaoArterialSistolica?: number;
    pressaoArterialDiastolica?: number;
    frequenciaCardiaca?: number;
    frequenciaRespiratoria?: number;
    temperatura?: number;
    saturacaoOxigenio?: number;
    nivelDor?: number;
    estadoConsciente?: boolean;
}

export interface Triagem {
    id: string;
    data_triagem: string;
    pacienteId: string;
    enfermeiroId: string;
    unidadeSaudeId: string;
    nivel_gravidade: NivelGravidade;
    sinais_vitais: SinaisVitais;
    queixa_principal: string;
    paciente_nome?: string;
    enfermeiro_nome?: string;
}