// src/mutations/unidadeSaudeMutations.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { unidadeSaudeService } from '@/services/unidadeSaudeService';
import { unidadeSaudeKeys } from '@/queries/unidadeSaudeQueries';

export const useCreateUnidadeMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: unidadeSaudeService.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: unidadeSaudeKeys.all });
        },
    });
};

export const useUpdateUnidadeMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) => unidadeSaudeService.update(id, data),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: unidadeSaudeKeys.all });
            queryClient.invalidateQueries({ queryKey: unidadeSaudeKeys.detail(variables.id) });
        },
    });
};

export const useDeleteUnidadeMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: unidadeSaudeService.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: unidadeSaudeKeys.all });
        },
    });
};

export const useAssociarFuncionarioMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ unidadeId, funcionarioId }: { unidadeId: string; funcionarioId: string }) =>
            unidadeSaudeService.associarFuncionario(unidadeId, funcionarioId),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: unidadeSaudeKeys.funcionarios(variables.unidadeId) });
        },
    });
};