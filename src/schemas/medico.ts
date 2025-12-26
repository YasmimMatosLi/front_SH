// src/schemas/medico.ts
import { z } from 'zod';
import { Escolaridade, RacaCor, Sexo } from '@/types';

const EnderecoSchema = z.object({
    logradouro: z.string().min(1),
    numero: z.string().min(1),
    bairro: z.string().min(1),
    cidade: z.string().min(1),
    estado: z.string().min(1),
    cep: z.string().regex(/^\d{8}$/),
    complemento: z.string().optional(),
});

export const CreateMedicoSchema = z.object({
    nome: z.string().min(3),
    cpf: z.string().regex(/^\d{11}$/),
    cns: z.string().regex(/^\d{15}$/),
    dataNascimento: z.string().date(),
    sexo: z.nativeEnum(Sexo),
    racaCor: z.nativeEnum(RacaCor),
    escolaridade: z.nativeEnum(Escolaridade),
    endereco: EnderecoSchema,
    telefone: z.string().regex(/^\d{10,11}$/),
    email: z.string().email().optional().or(z.literal('')),
    senha: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
    crm: z.string().regex(/^\d{5,6}-[A-Z]{2}$/, 'CRM inválido (ex: 123456-SP)'),
    dataContratacao: z.string().date().optional().default(new Date().toISOString().split('T')[0]),
});

export const UpdateMedicoSchema = z.object({
    nome: z.string().min(3).optional(),
    crm: z.string().regex(/^\d{5,6}-[A-Z]{2}$/).optional(),
    dataContratacao: z.string().date().optional(),
});

export type CreateMedicoInput = z.infer<typeof CreateMedicoSchema>;
export type UpdateMedicoInput = z.infer<typeof UpdateMedicoSchema>;