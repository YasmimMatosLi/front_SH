// src/hooks/usePaciente.ts
import { useQuery } from '@tanstack/react-query';
import { pacienteQueries } from '@/queries/pacienteQueries';
import { useCreatePacienteMutation, useUpdatePacienteMutation, useDeletePacienteMutation } from '@/mutations/pacienteMutations';

export const usePacientes = () => useQuery(pacienteQueries.all());
export const usePaciente = (id: string) => useQuery(pacienteQueries.detail(id));
export const usePacienteHistorico = (id: string) => useQuery(pacienteQueries.historico(id));

export const useCreatePaciente = () => useCreatePacienteMutation();
export const useUpdatePaciente = () => useUpdatePacienteMutation();
export const useDeletePaciente = () => useDeletePacienteMutation();