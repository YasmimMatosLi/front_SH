// src/hooks/useIA.ts
import { useQuery } from '@tanstack/react-query';
import { iaQueries } from '@/queries/iaQueries';
import { useGerarSurtoMutation, useAnalisarRecorrenteMutation, useGerarTriagensMutation } from '@/mutations/iaMutations';

export const useRelatoriosIA = (limit = 20) => useQuery(iaQueries.relatorios(limit));
export const useGerarSurto = () => useGerarSurtoMutation();
export const useAnalisarRecorrente = () => useAnalisarRecorrenteMutation();
export const useGerarTriagens = () => useGerarTriagensMutation();