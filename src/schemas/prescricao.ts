// src/schemas/prescricao.ts
import { z } from 'zod';

export const CreatePrescricaoSchema = z.object({
    pacienteId: z.string().uuid(),
    unidadeSaudeId: z.string().uuid(),
    detalhesPrescricao: z.string().min(10, 'Detalhes devem ter pelo menos 10 caracteres'),
    cid10: z.string().regex(/^[A-Z]\d{2}(\.\d{1,2})?$/, 'CID-10 inválido'),
});

export const UpdatePrescricaoSchema = z.object({
    detalhesPrescricao: z.string().min(10).optional(),
    cid10: z.string().regex(/^[A-Z]\d{2}(\.\d{1,2})?$/).optional(),
});

export type CreatePrescricaoInput = z.infer<typeof CreatePrescricaoSchema>;
export type UpdatePrescricaoInput = z.infer<typeof UpdatePrescricaoSchema>;