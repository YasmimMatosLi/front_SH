// src/hooks/useMedico.ts
import { useQuery } from '@tanstack/react-query';
import { medicoQueries } from '@/queries/medicoQueries';
import { useCreateMedicoMutation, useUpdateMedicoMutation, useDeleteMedicoMutation } from '@/mutations/medicoMutations';

export const useMedicos = () => useQuery(medicoQueries.all());
export const useMedico = (id: string) => useQuery(medicoQueries.detail(id));

export const useCreateMedico = () => useCreateMedicoMutation();
export const useUpdateMedico = () => useUpdateMedicoMutation();
export const useDeleteMedico = () => useDeleteMedicoMutation();