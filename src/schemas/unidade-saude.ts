// src/schemas/unidade-saude.ts
import { z } from 'zod';
import { TipoUnidadeSaude } from '@/types';

const EnderecoSchema = z.object({
    logradouro: z.string().min(1),
    numero: z.string().min(1),
    bairro: z.string().min(1),
    cidade: z.string().min(1),
    estado: z.string().length(2),
    cep: z.string().regex(/^\d{8}$/),
});

export const CreateUnidadeSaudeSchema = z.object({
    nome: z.string().min(3),
    tipo: z.nativeEnum(TipoUnidadeSaude),
    cnes: z.string().regex(/^\d{7}$/, 'CNES deve ter 7 dígitos'),
    endereco: EnderecoSchema,
    telefone: z.string().regex(/^\d{10,11}$/),
    servicosEssenciais: z.array(z.string()).min(1),
    servicosAmpliados: z.array(z.string()).optional(),
});

export const UpdateUnidadeSaudeSchema = CreateUnidadeSaudeSchema.partial();

export type CreateUnidadeSaudeInput = z.infer<typeof CreateUnidadeSaudeSchema>;
export type UpdateUnidadeSaudeInput = z.infer<typeof UpdateUnidadeSaudeSchema>;