// src/schemas/prontuario.ts
import { z } from 'zod';

export const CreateProntuarioSchema = z.object({
    pacienteId: z.string().uuid(),
    unidadeSaudeId: z.string().uuid(),
    descricao: z.string().min(10, 'Descrição deve ter pelo menos 10 caracteres'),
    cid10: z.string().regex(/^[A-Z]\d{2}(\.\d{1,2})?$/, 'CID-10 inválido (ex: J45 ou J45.9)'),
});

export const UpdateProntuarioSchema = z.object({
    descricao: z.string().min(10, 'Descrição deve ter pelo menos 10 caracteres').optional(),
    cid10: z.string().regex(/^[A-Z]\d{2}(\.\d{1,2})?$/, 'CID-10 inválido').optional(),
});

export type CreateProntuarioInput = z.infer<typeof CreateProntuarioSchema>;
export type UpdateProntuarioInput = z.infer<typeof UpdateProntuarioSchema>;