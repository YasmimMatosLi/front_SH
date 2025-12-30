import { useQuery } from '@tanstack/react-query';
import { iaQueries } from '@/queries/iaQueries';
import { useGerarSurtoMutation, useAnalisarRecorrenteMutation, useGerarTriagensMutation } from '@/mutations/iaMutations';

export const useRelatoriosIA = (limit = 20) => useQuery(iaQueries.relatorios(limit));
export const useRelatorioIA = (id: string) => useQuery(iaQueries.relatorio(id));
export const useGerarSurto = () => useGerarSurtoMutation();
export const useAnalisarRecorrente = () => useAnalisarRecorrenteMutation();
export const useGerarTriagens = () => useGerarTriagensMutation();