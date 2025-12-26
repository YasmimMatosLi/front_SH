// src/mutations/authMutations.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '@/services/authService';
import {apiFetch} from "@/lib/api";

export const useLoginMutation = () => {
    const queryClient = useQueryClient();

    return useMutation<
        Awaited<ReturnType<typeof authService.login>>,
        unknown,
        { email: string; password: string }
    >({
        mutationFn: async ({ email, password }) => {
            return authService.login(email, password);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['auth'] });
        },
    });
};

export const useRegisterAdminMutation = () => {
    return useMutation({
        mutationFn: authService.registerAdmin,
    });
};

export const useForgotPasswordMutation = () => {
    return useMutation({
        mutationFn: async (email: string) => {
            return authService.forgotPassword(email);
        },
    });
}

export const useLogoutMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: authService.logout,
        onSuccess: () => {
            queryClient.clear();
            window.location.href = '/login';
        },
    });
};