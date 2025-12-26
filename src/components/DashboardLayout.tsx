// src/components/DashboardLayout.tsx
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { ClientPathname } from './ClientPathname';
import { requireAuth } from '@/lib/auth';
import { Papeis } from '@/types';

export default async function DashboardLayout({
                                                  children,
                                              }: {
    children: React.ReactNode;
}) {
    const user = await requireAuth();

    return (
        <div className="flex h-screen bg-gray-50">
            <ClientPathname>
                {(pathname) => <Sidebar role={user.role as Papeis} currentPath={pathname} />}
            </ClientPathname>

            <div className="flex-1 flex flex-col">
                <Header />
                <main className="flex-1 overflow-y-auto p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}