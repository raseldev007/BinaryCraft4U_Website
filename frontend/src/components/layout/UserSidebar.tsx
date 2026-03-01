"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import { LayoutDashboard, User, ShoppingCart, Package, Lock, Globe, Settings, LogOut, Store, Menu, X, ShieldAlert } from "lucide-react";
import { useState } from "react";

const navItems = [
    { section: "Main" },
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "My Profile", href: "/profile", icon: User },
    { name: "Cart", href: "/cart", icon: ShoppingCart },
    { section: "Orders" },
    { name: "Order History", href: "/order-history", icon: Package },
    { section: "Account" },
    { name: "Change Password", href: "/profile#security", icon: Lock },
    { name: "Visit Website", href: "/", icon: Globe },
    { section: "Other" },
    { name: "Browse Services", href: "/services", icon: Settings },
    { name: "Browse Products", href: "/products", icon: Store },
];

export function UserSidebar() {
    const pathname = usePathname();
    const { user, logout } = useAuth();
    const [mobileOpen, setMobileOpen] = useState(false);

    const initial = user?.name ? user.name.charAt(0).toUpperCase() : "?";

    return (
        <>
            {/* Mobile Toggle Button */}
            <button
                className="lg:hidden fixed top-4 right-4 z-50 p-2 rounded-xl bg-bg-card border border-border text-white shadow-xl"
                onClick={() => setMobileOpen(!mobileOpen)}
            >
                {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Sidebar background overlay for mobile */}
            {mobileOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Sidebar Content */}
            <aside className={cn(
                "fixed top-0 left-0 bottom-0 z-40 w-72 flex flex-col glass-panel border-r border-border transition-transform duration-300 shadow-2xl overflow-y-auto",
                mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
            )}>
                <div className="p-8 pb-6 border-b border-border/50">
                    <Link href="/" className="flex items-center gap-3">
                        <img
                            src="/logo.png"
                            alt="BinaryNexa Logo"
                            className="w-12 h-12 object-contain drop-shadow-[0_0_15px_rgba(59,130,246,0.3)] shrink-0"
                        />
                        <div className="flex flex-col items-start gap-2">
                            <div>
                                <div className="font-black text-lg leading-none tracking-tight">BinaryNexa</div>
                                <div className="text-[10px] text-primary font-bold uppercase tracking-widest mt-1">User Panel</div>
                            </div>
                            {user?.role === 'admin' && (
                                <Link href="/admin" className="flex items-center gap-1.5 text-xs font-bold text-danger hover:text-white bg-danger/10 hover:bg-danger/40 px-3 py-1.5 rounded-lg transition-all border border-danger/20 shadow-[0_0_10px_rgba(239,68,68,0.1)] w-full justify-center group shrink-0">
                                    <ShieldAlert className="w-3.5 h-3.5 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
                                    Switch to Admin Panel
                                </Link>
                            )}
                        </div>
                    </Link>
                </div>

                <div className="px-5 py-6">
                    <div className="glass p-4 rounded-xl flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center font-bold text-white shadow-[0_0_15px_rgba(59,130,246,0.3)] shrink-0">
                            {initial}
                        </div>
                        <div className="overflow-hidden">
                            <div className="font-bold text-sm truncate">{user?.name || "Loading..."}</div>
                            <div className="text-xs text-text-muted truncate mt-0.5">{user?.email || "..."}</div>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 px-4 space-y-1 overflow-y-auto pb-4 custom-scrollbar">
                    {navItems.map((item, idx) => {
                        if (item.section) {
                            return (
                                <div key={idx} className="text-[10px] font-bold uppercase tracking-[0.15em] text-text-muted px-4 pb-2 pt-6">
                                    {item.section}
                                </div>
                            );
                        }

                        const Icon = item.icon!;
                        const isActive = pathname === item.href;

                        return (
                            <Link
                                key={idx}
                                href={item.href!}
                                onClick={() => setMobileOpen(false)}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200 group",
                                    isActive
                                        ? "bg-primary/10 text-primary"
                                        : "text-text-secondary hover:bg-white/5 hover:text-white"
                                )}
                            >
                                <Icon className={cn(
                                    "w-5 h-5 transition-transform duration-200",
                                    isActive ? "scale-110" : "opacity-70 group-hover:opacity-100 group-hover:scale-110"
                                )} />
                                <span>{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-6 mt-auto border-t border-border/50">
                    <button
                        onClick={logout}
                        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-danger/10 text-danger hover:bg-danger/20 font-bold transition-colors"
                    >
                        <LogOut className="w-5 h-5" /> Logout
                    </button>
                </div>
            </aside>
        </>
    );
}
