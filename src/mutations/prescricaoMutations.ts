// src/mutations/prescricaoMutations.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { prescricaoService } from '@/services/prescricaoService';
import { prescricaoKeys } from '@/queries/prescricaoQueries';

export const useCreatePrescricaoMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: prescricaoService.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: prescricaoKeys.all });
        },
    });
};

export const useUpdatePrescricaoMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) => prescricaoService.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: prescricaoKeys.all });
        },
    });
};