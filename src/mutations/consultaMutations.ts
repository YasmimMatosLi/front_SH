// src/mutations/consultaMutations.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { consultaService } from '@/services/consultaService';
import { consultaKeys } from '@/queries/consultaQueries';

export const useCreateConsultaMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: consultaService.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: consultaKeys.all });
        },
    });
};

export const useUpdateConsultaMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) => consultaService.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: consultaKeys.all });
        },
    });
};