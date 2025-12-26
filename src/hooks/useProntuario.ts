// src/hooks/useProntuario.ts
import { useQuery } from '@tanstack/react-query';
import { prontuarioQueries } from '@/queries/prontuarioQueries';
import { useCreateProntuarioMutation, useUpdateProntuarioMutation } from '@/mutations/prontuarioMutations';

export const useProntuarios = () => useQuery(prontuarioQueries.all());
export const useProntuario = (id: string) => useQuery(prontuarioQueries.detail(id));
export const useProntuariosPorPaciente = (pacienteId: string) => useQuery(prontuarioQueries.byPaciente(pacienteId));

export const useCreateProntuario = () => useCreateProntuarioMutation();
export const useUpdateProntuario = () => useUpdateProntuarioMutation();