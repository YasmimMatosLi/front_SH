// src/types/enums.ts
export enum Papeis {
    SELECIONE = 'SELECIONE',
    ADMINISTRADOR_PRINCIPAL = 'ADMINISTRADOR_PRINCIPAL',
    MEDICO = 'MEDICO',
    ENFERMEIRO = 'ENFERMEIRO',
}

export const GrupoRisco = {
    IDOSO: 'IDOSO',
    GESTANTE: 'GESTANTE',
    DIABETICO: 'DIABETICO',
    HIPERTENSO: 'HIPERTENSO',
    IMUNOSSUPRIMIDO: 'IMUNOSSUPRIMIDO',
    CRIANCA: 'CRIANCA',
    OBESO: 'OBESO',
    ASMATICO: 'ASMATICO',
} as const;

export enum NivelGravidade {
    SELECIONE = 'SELECIONE',
    VERMELHO = 'VERMELHO',
    LARANJA = 'LARANJA',
    AMARELO = 'AMARELO',
    VERDE = 'VERDE',
    AZUL = 'AZUL',
}

export enum Sexo {
    SELECIONE = 'SELECIONE',
    MASCULINO = 'MASCULINO',
    FEMININO = 'FEMININO',
    OUTRO = 'OUTRO',
}

export enum RacaCor {
    SELECIONE = 'SELECIONE',
    BRANCA = 'BRANCA',
    PRETA = 'PRETA',
    PARDA = 'PARDA',
    AMARELA = 'AMARELA',
    INDIGENA = 'INDIGENA',
    NAO_DECLARADO = 'NAO_DECLARADO',
}

export enum Escolaridade {
    SELECIONE = 'SELECIONE',
    FUNDAMENTAL = 'FUNDAMENTAL',
    MEDIO = 'MEDIO',
    SUPERIOR = 'SUPERIOR',
    POS_GRADUACAO = 'POS_GRADUACAO',
    SEM_ESCOLARIDADE = 'SEM_ESCOLARIDADE',
}

export enum TipoUnidadeSaude {
    SELECIONE = 'SELECIONE',
    HOSPITAL = 'HOSPITAL',
    UPA = 'UPA',
    UBS = 'UBS',
}

export type GrupoRisco = keyof typeof GrupoRisco;