// src/schemas/triagem.ts
import { z } from 'zod';
import { NivelGravidade } from '@/types';

const SinaisVitaisSchema = z.object({
    pressaoArterialSistolica: z.number().optional(),
    pressaoArterialDiastolica: z.number().optional(),
    frequenciaCardiaca: z.number().optional(),
    frequenciaRespiratoria: z.number().optional(),
    temperatura: z.number().optional(),
    saturacaoOxigenio: z.number().min(0).max(100).optional(),
    nivelDor: z.number().min(0).max(10).optional(),
    estadoConsciente: z.boolean().optional(),
});

export const CreateTriagemSchema = z.object({
    pacienteId: z.string().uuid(),
    unidadeSaudeId: z.string().uuid(),
    enfermeiroId: z.string().uuid(),
    sinaisVitais: SinaisVitaisSchema,
    queixaPrincipal: z.string().min(3, 'Queixa principal deve ter pelo menos 3 caracteres'),
    nivelGravidade: z.nativeEnum(NivelGravidade).optional(), // pode ser calculado no backend
});

export const UpdateTriagemSchema = CreateTriagemSchema.partial();

export type CreateTriagemInput = z.infer<typeof CreateTriagemSchema>;
export type UpdateTriagemInput = z.infer<typeof UpdateTriagemSchema>;