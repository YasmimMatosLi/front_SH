// src/mutations/prontuarioMutations.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { prontuarioService } from '@/services/prontuarioService';
import { prontuarioKeys } from '@/queries/prontuarioQueries';

export const useCreateProntuarioMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: prontuarioService.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: prontuarioKeys.all });
        },
    });
};

export const useUpdateProntuarioMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) => prontuarioService.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: prontuarioKeys.all });
        },
    });
};