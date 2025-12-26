// src/mutations/medicoMutations.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { medicoService } from '@/services/medicoService';
import { medicoKeys } from '@/queries/medicoQueries';

export const useCreateMedicoMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: medicoService.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: medicoKeys.all });
        },
    });
};

export const useUpdateMedicoMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) => medicoService.update(id, data),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: medicoKeys.all });
            queryClient.invalidateQueries({ queryKey: medicoKeys.detail(variables.id) });
        },
    });
};

export const useDeleteMedicoMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: medicoService.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: medicoKeys.all });
        },
    });
};