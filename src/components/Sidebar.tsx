// src/components/Sidebar.tsx
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
    Home, Users, Stethoscope, Activity, FileText, Building2, Brain, LogOut, UserPlus, Pill, ClipboardList
} from 'lucide-react';
import { Papeis } from '@/types';
import { logoutAction } from "@/lib/auth";
import {useQueryClient} from "@tanstack/react-query";

const menuItems = [
    { href: '/dashboard', label: 'Dashboard', icon: Home, roles: ['ADMINISTRADOR_PRINCIPAL', 'MEDICO', 'ENFERMEIRO'] },
    { href: '/dashboard/pacientes', label: 'Pacientes', icon: Users, roles: ['ADMINISTRADOR_PRINCIPAL', 'MEDICO', 'ENFERMEIRO'] },
    { href: '/dashboard/consultas', label: 'Consultas', icon: ClipboardList, roles: ['ADMINISTRADOR_PRINCIPAL', 'MEDICO'] },
    { href: '/dashboard/triagens', label: 'Triagens', icon: Activity, roles: ['ADMINISTRADOR_PRINCIPAL', 'MEDICO', 'ENFERMEIRO'] },
    { href: '/dashboard/prescricoes', label: 'Prescrições', icon: Pill, roles: ['ADMINISTRADOR_PRINCIPAL', 'MEDICO'] },
    { href: '/dashboard/prontuarios', label: 'Prontuários', icon: FileText, roles: ['ADMINISTRADOR_PRINCIPAL', 'MEDICO', 'ENFERMEIRO'] },
    { href: '/dashboard/medicos', label: 'Médicos', icon: Stethoscope, roles: ['ADMINISTRADOR_PRINCIPAL'] },
    { href: '/dashboard/enfermeiros', label: 'Enfermeiros', icon: UserPlus, roles: ['ADMINISTRADOR_PRINCIPAL'] },
    { href: '/dashboard/unidades', label: 'Unidades de Saúde', icon: Building2, roles: ['ADMINISTRADOR_PRINCIPAL'] },
    { href: '/dashboard/ia', label: 'Inteligência Artificial', icon: Brain, roles: ['ADMINISTRADOR_PRINCIPAL', 'MEDICO'] },
];

interface SidebarProps {
    role: Papeis;
    currentPath: string;
}

export function Sidebar({ role, currentPath }: SidebarProps) {
    const router = useRouter();
    const queryClient = useQueryClient();
    const filteredItems = menuItems.filter(item => item.roles.includes(role));

    const handleLogout = async () => {
        try {
            // 1. Chama o server action para deletar cookies
            await logoutAction();

            // 2. Limpa TODO o cache do React Query
            queryClient.clear();

            // 3. Força reload completo da página
            window.location.href = '/login';
        } catch (error) {
            console.error('Erro no logout:', error);
            // Mesmo se der erro, força o reload
            window.location.href = '/login';
        }
    };

    return (
        <aside className="w-64 bg-gradient-to-b from-blue-900 to-blue-950 text-white flex flex-col h-screen">
            <div className="p-6 border-b border-blue-800">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                        <Brain className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold">Hospital IA</h1>
                        <p className="text-xs text-blue-200">Sistema Inteligente</p>
                    </div>
                </div>
            </div>

            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {filteredItems.map((item) => {
                    const Icon = item.icon;

                    const isActive =
                        item.href === '/dashboard'
                            ? currentPath === '/dashboard'
                            : currentPath.startsWith(item.href);

                    return (
                        <Link key={item.href} href={item.href}>
                            <div
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-all cursor-pointer",
                                    isActive
                                        ? "bg-blue-700 text-white shadow-md border border-blue-600"
                                        : "hover:bg-blue-800/50 text-blue-100"
                                )}
                            >
                                <Icon className="w-5 h-5" />
                                <span className="font-medium">{item.label}</span>
                            </div>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-blue-800">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-800/50 text-blue-100 transition-all"
                >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Sair do sistema</span>
                </button>
            </div>
        </aside>
    );
}