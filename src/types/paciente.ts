// src/types/paciente.ts
import { Endereco } from './endereco';
import { Sexo, RacaCor, Escolaridade } from './enums';

export interface Paciente {
    id: string;
    nome: string;
    cpf: string;
    cns: string;
    dataNascimento: string; // ISO string
    sexo: Sexo;
    racaCor: RacaCor;
    escolaridade: Escolaridade;
    endereco: Endereco;
    telefone: string;
    email?: string;
    gruposRisco: string[];
    consentimentoLGPD: boolean;
    criado_em?: string;
}