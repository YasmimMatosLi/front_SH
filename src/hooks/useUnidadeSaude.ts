// src/hooks/useUnidadeSaude.ts
import { useQuery } from '@tanstack/react-query';
import { unidadeSaudeQueries } from '@/queries/unidadeSaudeQueries';
import { useCreateUnidadeMutation, useUpdateUnidadeMutation, useDeleteUnidadeMutation, useAssociarFuncionarioMutation } from '@/mutations/unidadeSaudeMutations';

export const useUnidadesSaude = () => useQuery(unidadeSaudeQueries.all());
export const useUnidadeSaude = (id: string) => useQuery(unidadeSaudeQueries.detail(id));
export const useFuncionariosUnidade = (id: string) => useQuery(unidadeSaudeQueries.funcionarios(id));

export const useCreateUnidade = () => useCreateUnidadeMutation();
export const useUpdateUnidade = () => useUpdateUnidadeMutation();
export const useDeleteUnidade = () => useDeleteUnidadeMutation();
export const useAssociarFuncionario = () => useAssociarFuncionarioMutation();