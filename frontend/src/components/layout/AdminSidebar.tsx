"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Users, ShoppingBag, Box, Settings as Cogs, Mail, SlidersHorizontal, ExternalLink, LogOut, Menu, X, BookOpen, Bell } from "lucide-react";
import { useState } from "react";

const navItems = [
    { section: "Main" },
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { section: "Management" },
    { name: "User Base", href: "/admin/users", icon: Users },
    { name: "Order Flow", href: "/admin/orders", icon: ShoppingBag },
    { name: "Inventory", href: "/admin/products", icon: Box },
    { name: "Services", href: "/admin/services", icon: Cogs },
    { name: "Messages", href: "/admin/messages", icon: Mail },
    { section: "Content" },
    { name: "Blog", href: "/admin/blog", icon: BookOpen },
    { name: "Subscribers", href: "/admin/subscribers", icon: Bell },
    { section: "System" },
    { name: "Settings", href: "/admin/settings", icon: SlidersHorizontal },
    { name: "Public Site", href: "/", icon: ExternalLink },
];

export function AdminSidebar() {
    const pathname = usePathname();
    const { logout } = useAuth();
    const [mobileOpen, setMobileOpen] = useState(false);

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
                    <Link href="/admin" className="flex items-center gap-3">
                        <img
                            src="/logo.png"
                            alt="Binary Craft Logo"
                            className="w-12 h-12 object-contain drop-shadow-[0_0_15px_rgba(59,130,246,0.3)] shrink-0"
                        />
                        <div>
                            <div className="font-black text-lg tracking-tight">Binary Craft</div>
                            <div className="bg-gradient-to-r from-primary to-accent text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest mt-1 inline-block">
                                Admin Control
                            </div>
                        </div>
                    </Link>
                </div>

                <nav className="flex-1 px-4 space-y-1 py-6 overflow-y-auto custom-scrollbar">
                    {navItems.map((item, idx) => {
                        if (item.section) {
                            return (
                                <div key={idx} className="text-[10px] font-bold uppercase tracking-[0.15em] text-text-muted px-4 pb-2 pt-4 first:pt-0">
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
                                    isActive ? "scale-110 drop-shadow-[0_0_5px_rgba(59,130,246,0.5)]" : "opacity-70 group-hover:opacity-100 group-hover:scale-110"
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
