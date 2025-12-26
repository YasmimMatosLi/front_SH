// src/schemas/paciente.ts
import { z } from 'zod';
import { Escolaridade, RacaCor, Sexo } from '@/types';

const onlyDigits = (value: unknown) =>
    typeof value === 'string' ? value.replace(/\D/g, '') : value;

const GRUPOS_RISCO = ['IDOSO', 'GESTANTE', 'DIABETICO', 'HIPERTENSO', 'IMUNOSSUPRIMIDO', 'CRIANCA', 'OBESO', 'ASMATICO'] as const;

const EnderecoSchema = z.object({
    logradouro: z.string().min(1, 'Logradouro é obrigatório'),
    numero: z.string().min(1, 'Número é obrigatório'),
    bairro: z.string().min(1, 'Bairro é obrigatório'),
    cidade: z.string().min(1, 'Cidade é obrigatória'),
    estado: z.string().min(1, 'Estado é obrigatório'),
    cep: z.string().regex(/^\d{8}$/, 'CEP deve ter 8 dígitos'),
    complemento: z.string().optional(),
});

export const CreatePacienteSchema = z.object({
    nome: z.string().min(3),

    cpf: z
        .string()
        .regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'CPF inválido'),
    telefone: z
        .string()
        .regex(/^\(\d{2}\)\s?\d{4,5}-\d{4}$/, 'Telefone inválido'),
    cns: z.string().regex(/^\d{15}$/),
    dataNascimento: z.string().date(),
    sexo: z.nativeEnum(Sexo),
    racaCor: z.nativeEnum(RacaCor),
    escolaridade: z.nativeEnum(Escolaridade),
    endereco: EnderecoSchema,
    email: z.string().email().optional().or(z.literal('')),
    gruposRisco: z.array(z.enum(GRUPOS_RISCO)).optional(),
    consentimentoLGPD: z.literal(true),
});


export const UpdatePacienteSchema = CreatePacienteSchema.partial().omit({ consentimentoLGPD: true });

export type CreatePacienteInput = z.infer<typeof CreatePacienteSchema>;
export type UpdatePacienteInput = z.infer<typeof UpdatePacienteSchema>;