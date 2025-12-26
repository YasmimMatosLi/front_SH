// src/app/providers.tsx
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ReactNode, useState } from 'react';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';

export function Providers({ children }: { children: ReactNode }) {
    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 1000 * 60 * 5,
                retry: 1,
                refetchOnWindowFocus: false,
            },
            mutations: {
                onError: (error: any) => {
                    const message = error.message || 'Erro inesperado';
                    toast.error(message);
                },
            },
        },
    }));

    return (
        <QueryClientProvider client={queryClient}>
            {children}
            <Toaster
                position="top-right"
                richColors
                closeButton
                toastOptions={{
                    classNames: {
                        toast: 'group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg',
                        description: 'group-[.toast]:text-muted-foreground',
                        actionButton: 'group-[.toast]:bg-primary group-[.toaster]:text-primary-foreground',
                        cancelButton: 'group-[.toast]:bg-muted group-[.toaster]:text-muted-foreground',
                    },
                }}
            />
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    );
}