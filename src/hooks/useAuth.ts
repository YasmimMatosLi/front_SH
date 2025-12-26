'use client';

import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { CurrentUser } from '@/types';
import { meQuery } from '@/queries/authQueries';

export const useCurrentUser = () => {
    const queryClient = useQueryClient();

    const query = useQuery<CurrentUser | null, Error>({
        queryKey: meQuery.queryKey,
        queryFn: meQuery.queryFn,
        staleTime: meQuery.staleTime,
        refetchOnWindowFocus: meQuery.refetchOnWindowFocus,
    });

    useEffect(() => {
        if (query.error) {
            queryClient.clear();
        }
    }, [query.error, queryClient]);

    return query;
};
