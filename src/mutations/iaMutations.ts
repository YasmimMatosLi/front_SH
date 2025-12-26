// src/mutations/iaMutations.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { iaService } from '@/services/iaService';
import { iaKeys } from '@/queries/iaQueries';

export const useGerarSurtoMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: iaService.gerarSurto,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: iaKeys.relatorios });
        },
    });
};

export const useAnalisarRecorrenteMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: iaService.analisarRecorrente,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: iaKeys.relatorios });
        },
    });
};

export const useGerarTriagensMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: iaService.gerarTriagens,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: iaKeys.relatorios });
        },
    });
};