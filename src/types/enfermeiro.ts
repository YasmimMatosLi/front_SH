// src/types/enfermeiro.ts
import { Endereco } from './endereco';
import { Sexo, RacaCor, Escolaridade } from './enums';

export interface Enfermeiro {
    id: string;
    nome: string;
    cpf: string;
    cns: string;
    dataNascimento: string;
    sexo: Sexo;
    racaCor: RacaCor;
    escolaridade: Escolaridade;
    endereco: Endereco;
    telefone: string;
    email?: string;
    registroProfissional: string;
    dataContratacao: string;
}