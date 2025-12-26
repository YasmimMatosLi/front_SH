// src/components/Header.tsx
'use client';

import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useCurrentUser } from '@/hooks/useAuth';
import Link from "next/link";

interface HeaderProps {
    title?: string;
    description?: string;
    actionLabel?: string;
    actionHref?: string;
}

export function Header({ title = 'Bem-vindo de volta!', description, actionLabel, actionHref }: HeaderProps) {
    const { data: user, isLoading } = useCurrentUser();

    return (
        <header className="bg-white border-b border-border px-8 py-4">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-semibold text-foreground">{title}</h2>
                    {description && <p className="text-muted-foreground mt-1">{description}</p>}
                </div>

                <div className="flex items-center gap-4">
                    {actionLabel && actionHref && (
                        <Link href={actionHref}>
                            <Button>{actionLabel}</Button>
                        </Link>
                    )}

                    {/* Sininho (futuras notificações) */}
                    <Button variant="ghost" size="icon">
                        <Bell className="w-5 h-5" />
                    </Button>

                    {isLoading ? (
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse" />
                            <div className="space-y-2">
                                <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                                <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
                            </div>
                        </div>
                    ) : user ? (
                        <div className="flex items-center gap-3">
                            <Avatar>
                                <AvatarFallback className="bg-blue-600 text-white text-lg font-medium">
                                    {user.nome?.[0].toUpperCase() || 'U'}
                                </AvatarFallback>
                            </Avatar>
                            <div className="text-right">
                                <p className="font-medium text-foreground">
                                    {user.nome}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    {user.unidadeSaudeNome || 'Unidade não associada'}
                                </p>
                            </div>
                        </div>
                    ) : null}
                </div>
            </div>
        </header>
    );
}