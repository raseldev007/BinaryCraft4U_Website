import { AdminSidebar } from "@/components/layout/AdminSidebar";
import AuthGuard from "@/components/auth/AuthGuard";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AuthGuard requireAdmin={true}>
            <div className="flex min-h-screen bg-bg-primary">
                <AdminSidebar />
                <main className="flex-1 lg:ml-72 flex flex-col min-w-0">
                    <div className="flex-1 p-6 md:p-10 max-w-[1400px] w-full mx-auto animate-fadeIn">
                        {children}
                    </div>
                </main>
            </div>
        </AuthGuard>
    );
}
