// src/mutations/triagemMutations.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { triagemService } from '@/services/triagemService';
import { triagemKeys } from '@/queries/triagemQueries';

export const useCreateTriagemMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: triagemService.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: triagemKeys.all });
        },
    });
};

export const useUpdateTriagemMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) => triagemService.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: triagemKeys.all });
        },
    });
};