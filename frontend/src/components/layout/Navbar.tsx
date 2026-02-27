"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/Button";
import {
    ShoppingCart,
    User as UserIcon,
    LogOut,
    LayoutDashboard,
    Settings,
    Package,
    ShieldAlert,
    Menu,
    X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect, useRef } from "react";

const NAV_LINKS = [
    { name: "Home", href: "/" },
    { name: "Services", href: "/services" },
    { name: "Products", href: "/products" },
    { name: "About", href: "/about" },
    { name: "Blog", href: "/blog" },
    { name: "Contact", href: "/contact" },
];

export function Navbar() {
    const pathname = usePathname();
    const { user, isAuthenticated, logout, isAdmin, isLoading } = useAuth();
    const [cartCount, setCartCount] = useState(0);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const userMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const checkCart = () => {
            const currentCart = JSON.parse(localStorage.getItem("bc_cart_local") || "[]");
            setCartCount(currentCart.length);
        };
        checkCart();
        window.addEventListener("storage", checkCart);
        const interval = setInterval(checkCart, 1000);
        return () => {
            window.removeEventListener("storage", checkCart);
            clearInterval(interval);
        };
    }, []);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setMobileMenuOpen(false);
        setUserMenuOpen(false);
    }, [pathname]);

    // Close user dropdown on outside click
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
                setUserMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    return (
        <>
            <nav
                className={cn(
                    "fixed top-0 w-full z-50 transition-all duration-300",
                    scrolled
                        ? "glass-panel border-b border-border shadow-2xl"
                        : "bg-transparent border-b border-transparent"
                )}
            >
                <div className="max-w-[1400px] mx-auto px-6 h-20 flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 group">
                        <img
                            src="/logo.png"
                            alt="Binary Craft Logo"
                            className="w-10 h-10 object-contain drop-shadow-[0_0_15px_rgba(59,130,246,0.3)] group-hover:drop-shadow-[0_0_30px_rgba(59,130,246,0.5)] transition-all duration-300"
                        />
                        <span className="font-bold text-lg hidden sm:block tracking-tight">
                            Binary Craft
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-8">
                        {NAV_LINKS.map((link) => {
                            const isActive =
                                pathname === link.href ||
                                (pathname.startsWith(link.href) && link.href !== "/");
                            return (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className={cn(
                                        "text-[14px] font-medium transition-all duration-200 relative py-1",
                                        isActive
                                            ? "text-white"
                                            : "text-text-muted hover:text-white"
                                    )}
                                >
                                    {link.name}
                                    {isActive && (
                                        <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-accent rounded-full" />
                                    )}
                                </Link>
                            );
                        })}
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-3">
                        {/* Cart */}
                        <Link
                            href={isAuthenticated ? "/cart" : "/login?redirect=/cart"}
                            className="relative p-2 text-text-muted hover:text-primary transition-colors"
                        >
                            <ShoppingCart className="w-5 h-5" />
                            {cartCount > 0 && (
                                <span className="absolute top-0 right-0 w-4 h-4 bg-danger rounded-full text-[10px] font-bold flex items-center justify-center text-white">
                                    {cartCount > 9 ? "9+" : cartCount}
                                </span>
                            )}
                        </Link>

                        <div className="h-5 w-px bg-border hidden sm:block" />

                        {/* Auth */}
                        {!isLoading && (
                            isAuthenticated ? (
                                <div className="relative" ref={userMenuRef}>
                                    <button
                                        onClick={() => setUserMenuOpen(!userMenuOpen)}
                                        className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-primary hover:text-white hover:from-primary/40 hover:to-accent/40 transition-all cursor-pointer border border-primary/30"
                                    >
                                        <UserIcon className="w-4 h-4" />
                                    </button>

                                    {userMenuOpen && (
                                        <div className="absolute right-0 mt-3 w-60 glass-panel border border-border rounded-2xl shadow-2xl py-2 flex flex-col z-50">
                                            <div className="px-4 py-3 border-b border-border/50 mb-1">
                                                <p className="font-bold text-sm text-white">{user?.name}</p>
                                                <p className="text-xs text-text-muted truncate mt-0.5">{user?.email}</p>
                                            </div>
                                            {[
                                                { href: "/dashboard", icon: <LayoutDashboard className="w-4 h-4" />, label: "Dashboard" },
                                                { href: "/profile", icon: <Settings className="w-4 h-4" />, label: "Profile" },
                                                { href: "/order-history", icon: <Package className="w-4 h-4" />, label: "My Orders" },
                                            ].map(item => (
                                                <Link
                                                    key={item.href}
                                                    href={item.href}
                                                    onClick={() => setUserMenuOpen(false)}
                                                    className="px-4 py-2.5 text-sm text-text-secondary hover:text-primary hover:bg-primary/5 transition-colors flex items-center gap-2.5"
                                                >
                                                    {item.icon} {item.label}
                                                </Link>
                                            ))}
                                            {isAdmin && (
                                                <Link
                                                    href="/admin"
                                                    onClick={() => setUserMenuOpen(false)}
                                                    className="px-4 py-2.5 text-sm text-primary hover:text-white hover:bg-primary/10 transition-colors flex items-center gap-2.5 font-semibold"
                                                >
                                                    <ShieldAlert className="w-4 h-4" /> Admin Panel
                                                </Link>
                                            )}
                                            <div className="border-t border-border/50 my-1" />
                                            <button
                                                onClick={() => { setUserMenuOpen(false); logout(); }}
                                                className="px-4 py-2.5 text-sm text-danger/80 hover:text-danger hover:bg-danger/5 text-left flex items-center gap-2.5 w-full transition-colors"
                                            >
                                                <LogOut className="w-4 h-4" /> Sign Out
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="hidden sm:flex items-center gap-2">
                                    <Link href="/login">
                                        <Button variant="ghost" size="sm">Login</Button>
                                    </Link>
                                    <Link href="/register">
                                        <Button size="sm" className="shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                                            Get Started
                                        </Button>
                                    </Link>
                                </div>
                            )
                        )}

                        {/* Hamburger (mobile) */}
                        <button
                            className="md:hidden p-2 text-text-muted hover:text-white transition-colors"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            aria-label="Toggle menu"
                        >
                            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden glass-panel border-t border-border">
                        <div className="max-w-[1400px] mx-auto px-6 py-4 flex flex-col gap-1">
                            {NAV_LINKS.map((link) => {
                                const isActive = pathname === link.href || (pathname.startsWith(link.href) && link.href !== "/");
                                return (
                                    <Link
                                        key={link.name}
                                        href={link.href}
                                        className={cn(
                                            "px-4 py-3 rounded-xl text-[15px] font-medium transition-all",
                                            isActive
                                                ? "bg-primary/10 text-primary border border-primary/20"
                                                : "text-text-muted hover:text-white hover:bg-white/5"
                                        )}
                                    >
                                        {link.name}
                                    </Link>
                                );
                            })}
                            {!isAuthenticated && (
                                <div className="flex gap-3 pt-3 border-t border-border mt-2">
                                    <Link href="/login" className="flex-1">
                                        <Button variant="outline" className="w-full">Login</Button>
                                    </Link>
                                    <Link href="/register" className="flex-1">
                                        <Button className="w-full">Get Started</Button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </nav>
        </>
    );
}
