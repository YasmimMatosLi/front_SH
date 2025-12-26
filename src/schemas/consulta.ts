// src/schemas/consulta.ts
import { z } from 'zod';

export const CreateConsultaSchema = z.object({
    pacienteId: z.string().uuid(),
    unidadeSaudeId: z.string().uuid(),
    observacoes: z.string().min(10, 'Observações devem ter pelo menos 10 caracteres'),
    cid10: z.string().regex(/^[A-Z]\d{2}(\.\d{1,2})?$/, 'CID-10 inválido').optional(),
});

export const UpdateConsultaSchema = z.object({
    observacoes: z.string().min(10).optional(),
    cid10: z.string().regex(/^[A-Z]\d{2}(\.\d{1,2})?$/).optional(),
});

export type CreateConsultaInput = z.infer<typeof CreateConsultaSchema>;
export type UpdateConsultaInput = z.infer<typeof UpdateConsultaSchema>;