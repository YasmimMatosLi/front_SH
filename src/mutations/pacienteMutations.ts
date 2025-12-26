// src/mutations/pacienteMutations.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { pacienteService } from '@/services/pacienteService';
import { pacienteKeys } from '@/queries/pacienteQueries';

export const useCreatePacienteMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: pacienteService.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: pacienteKeys.all });
        },
    });
};

export const useUpdatePacienteMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) => pacienteService.update(id, data),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: pacienteKeys.all });
            queryClient.invalidateQueries({ queryKey: pacienteKeys.detail(variables.id) });
        },
    });
};

export const useDeletePacienteMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: pacienteService.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: pacienteKeys.all });
        },
    });
};