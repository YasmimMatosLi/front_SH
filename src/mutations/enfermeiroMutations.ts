// src/mutations/enfermeiroMutations.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { enfermeiroService } from '@/services/enfermeiroService';
import { enfermeiroKeys } from '@/queries/enfermeiroQueries';

export const useCreateEnfermeiroMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: enfermeiroService.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: enfermeiroKeys.all });
        },
    });
};

export const useUpdateEnfermeiroMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) => enfermeiroService.update(id, data),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: enfermeiroKeys.all });
            queryClient.invalidateQueries({ queryKey: enfermeiroKeys.detail(variables.id) });
        },
    });
};

export const useDeleteEnfermeiroMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: enfermeiroService.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: enfermeiroKeys.all });
        },
    });
};