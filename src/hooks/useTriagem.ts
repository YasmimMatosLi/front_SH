// src/hooks/useTriagem.ts
import { useQuery } from '@tanstack/react-query';
import { triagemQueries } from '@/queries/triagemQueries';
import { useCreateTriagemMutation, useUpdateTriagemMutation } from '@/mutations/triagemMutations';

export const useTriagens = () => useQuery(triagemQueries.all());
export const useTriagem = (id: string) => useQuery(triagemQueries.detail(id));
export const useTriagensPorPaciente = (pacienteId: string) => useQuery(triagemQueries.byPaciente(pacienteId));

export const useCreateTriagem = () => useCreateTriagemMutation();
export const useUpdateTriagem = () => useUpdateTriagemMutation();