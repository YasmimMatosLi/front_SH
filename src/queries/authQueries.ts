// src/queries/authQueries.ts
import { authService } from '@/services/authService';

export const meQuery = {
    queryKey: ['auth', 'me'] as const,
    queryFn: () => authService.me(),
    staleTime: 1000 * 60 * 5, // 5 minutos
    refetchOnWindowFocus: true,
};