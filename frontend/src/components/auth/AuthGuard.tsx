"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function AuthGuard({
    children,
    requireAdmin = false,
}: {
    children: React.ReactNode;
    requireAdmin?: boolean;
}) {
    const { isAuthenticated, isLoading, isAdmin } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (isLoading) return;

        if (!isAuthenticated) {
            router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
            return;
        }

        if (requireAdmin && !isAdmin) {
            router.push("/dashboard");
            return;
        }
    }, [isLoading, isAuthenticated, isAdmin, router, pathname, requireAdmin]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-bg-primary">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                    <p className="text-text-muted text-sm font-medium animate-pulse">Verifying session...</p>
                </div>
            </div>
        );
    }

    // If we're done loading but not authenticated (and routing is happening), render null briefly
    if (!isAuthenticated) return null;

    if (requireAdmin && !isAdmin) return null;

    return <>{children}</>;
}
