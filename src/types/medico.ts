// src/types/medico.ts
import { Endereco } from './endereco';
import { Sexo, RacaCor, Escolaridade } from './enums';

export interface Medico {
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