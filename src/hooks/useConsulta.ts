// src/hooks/useConsulta.ts
import { useQuery } from '@tanstack/react-query';
import { consultaQueries } from '@/queries/consultaQueries';
import { useCreateConsultaMutation, useUpdateConsultaMutation } from '@/mutations/consultaMutations';

export const useConsultas = () => useQuery(consultaQueries.all());
export const useConsulta = (id: string) => useQuery(consultaQueries.detail(id));
export const useConsultasPorPaciente = (pacienteId: string) => useQuery(consultaQueries.byPaciente(pacienteId));

export const useCreateConsulta = () => useCreateConsultaMutation();
export const useUpdateConsulta = () => useUpdateConsultaMutation();