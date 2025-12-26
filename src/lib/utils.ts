// src/lib/utils.ts
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCPF(cpf: string) {
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

export function formatTelefone(telefone: string) {
  return telefone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
}

export function formatDate(date: string) {
  return new Date(date).toLocaleDateString('pt-BR');
}