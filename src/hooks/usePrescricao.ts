// src/hooks/usePrescricao.ts
import { useQuery } from '@tanstack/react-query';
import { prescricaoQueries } from '@/queries/prescricaoQueries';
import { useCreatePrescricaoMutation, useUpdatePrescricaoMutation } from '@/mutations/prescricaoMutations';

export const usePrescricoes = () => useQuery(prescricaoQueries.all());
export const usePrescricao = (id: string) => useQuery(prescricaoQueries.detail(id));
export const usePrescricoesPorPaciente = (pacienteId: string) => useQuery(prescricaoQueries.byPaciente(pacienteId));

export const useCreatePrescricao = () => useCreatePrescricaoMutation();
export const useUpdatePrescricao = () => useUpdatePrescricaoMutation();