// src/types/unidade-saude.ts
import { Endereco } from './endereco';
import { TipoUnidadeSaude } from './enums';

export interface UnidadeSaude {
    id: string;
    nome: string;
    tipo: TipoUnidadeSaude;
    cnes: string;
    endereco: Endereco;
    telefone: string;
    servicosEssenciais: string[];
    servicosAmpliados: string[];
}