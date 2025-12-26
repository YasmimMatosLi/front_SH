// src/hooks/useEnfermeiro.ts
import { useQuery } from '@tanstack/react-query';
import { enfermeiroQueries } from '@/queries/enfermeiroQueries';
import { useCreateEnfermeiroMutation, useUpdateEnfermeiroMutation, useDeleteEnfermeiroMutation } from '@/mutations/enfermeiroMutations';

export const useEnfermeiros = () => useQuery(enfermeiroQueries.all());
export const useEnfermeiro = (id: string) => useQuery(enfermeiroQueries.detail(id));

export const useCreateEnfermeiro = () => useCreateEnfermeiroMutation();
export const useUpdateEnfermeiro = () => useUpdateEnfermeiroMutation();
export const useDeleteEnfermeiro = () => useDeleteEnfermeiroMutation();