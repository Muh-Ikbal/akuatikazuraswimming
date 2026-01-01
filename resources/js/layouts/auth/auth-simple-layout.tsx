import { home } from '@/routes';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

interface AuthLayoutProps {
    name?: string;
    title?: string;
    description?: string;
}

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: PropsWithChildren<AuthLayoutProps>) {
    return (
        <div className="min-h-svh flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-primary/10 p-4">
            {/* Login Card */}
            <div className="w-full max-w-md">
                {/* Logo & Branding */}
                <div className="text-center mb-8">
                    <Link href={home()} className="inline-block">
                        <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-white shadow-lg flex items-center justify-center p-3 hover:shadow-xl transition-shadow">
                            <img
                                src="/logo.png"
                                alt="Akuatik Azura"
                                className="w-full h-full object-contain"
                            />
                        </div>
                    </Link>
                    <h1 className="text-2xl font-bold text-foreground">Akuatik Azura</h1>
                    <p className="text-sm text-muted-foreground mt-1">Swimming Course Management</p>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-2xl shadow-xl border border-border/50 p-8">
                    {/* Title */}
                    <div className="text-center mb-6">
                        <h2 className="text-xl font-semibold text-foreground">{title}</h2>
                        <p className="text-sm text-muted-foreground mt-1">{description}</p>
                    </div>

                    {/* Form Content */}
                    {children}
                </div>

                {/* Footer */}
                <p className="text-center text-xs text-muted-foreground mt-6">
                    © 2024 Akuatik Azura. All rights reserved.
                </p>
            </div>
        </div>
    );
}
