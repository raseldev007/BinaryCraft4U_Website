"use client";

import { useState, useEffect, useCallback } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/Toast";
import { Heart, ShoppingCart, Trash2, ExternalLink } from "lucide-react";
import Link from "next/link";
import { formatBDT } from "@/lib/currency";

interface WishlistItem {
    _id: string;
    itemId: string;
    itemType: "product" | "service";
    title: string;
    price: number;
    image: string;
}

export default function WishlistPage() {
    const { token, isAuthenticated, isLoading } = useAuth();
    const { toast, success, error: showError } = useToast();
    const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchWishlist = useCallback(async () => {
        if (!token) return;
        setLoading(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/wishlist`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (data.success) setWishlist(data.wishlist || []);
        } catch { showError("Failed to load wishlist"); }
        finally { setLoading(false); }
    }, [token, showError]);

    useEffect(() => { if (!isLoading) fetchWishlist(); }, [isLoading, fetchWishlist]);

    const removeItem = async (id: string) => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/wishlist/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (data.success) {
                setWishlist(prev => prev.filter(w => w._id !== id));
                success("Removed from wishlist");
            }
        } catch { showError("Failed to remove item"); }
    };

    const addToCart = async (item: WishlistItem) => {
        if (!token) return showError("Please login to add to cart");
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart`, {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({
                    itemId: item.itemId,
                    itemType: item.itemType,
                    title: item.title,
                    price: item.price,
                    quantity: 1,
                    image: item.image,
                }),
            });
            const data = await res.json();
            if (data.success) success(`${item.title} added to cart!`);
            else showError(data.message || "Failed to add to cart");
        } catch { showError("Network error"); }
    };

    // Suppress unused warning
    void toast;

    if (!isLoading && !isAuthenticated) {
        return (
            <div className="flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-1 pt-20 flex items-center justify-center">
                    <div className="text-center p-10">
                        <Heart style={{ width: "4rem", height: "4rem", margin: "0 auto 1rem", color: "rgba(239,68,68,0.4)" }} />
                        <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--color-text-primary)", marginBottom: "0.5rem" }}>Please Login</h2>
                        <p style={{ color: "var(--color-text-muted)", marginBottom: "1.5rem" }}>Login to view and manage your wishlist.</p>
                        <Link href="/login" style={{ padding: "0.75rem 2rem", background: "linear-gradient(135deg,#3b82f6,#8b5cf6)", color: "white", borderRadius: "10px", fontWeight: 600, textDecoration: "none" }}>
                            Login
                        </Link>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1 pt-20">
                <section className="py-12 max-w-[1200px] mx-auto px-6">
                    <div style={{ marginBottom: "2rem" }}>
                        <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
                            <Heart style={{ width: "24px", height: "24px", color: "#ef4444", fill: "#ef4444" }} />
                            <h1 style={{ fontSize: "2rem", fontWeight: 900, color: "var(--color-text-primary)" }}>My Wishlist</h1>
                        </div>
                        <p style={{ color: "var(--color-text-muted)" }}>{wishlist.length} saved item{wishlist.length !== 1 ? "s" : ""}</p>
                    </div>

                    {loading ? (
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1.5rem" }}>
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="animate-shimmer" style={{ height: "300px", borderRadius: "20px" }} />
                            ))}
                        </div>
                    ) : wishlist.length === 0 ? (
                        <div style={{ textAlign: "center", padding: "6rem 0" }}>
                            <Heart style={{ width: "5rem", height: "5rem", margin: "0 auto 1.5rem", color: "rgba(239,68,68,0.2)", fill: "rgba(239,68,68,0.1)" }} />
                            <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--color-text-primary)", marginBottom: "0.5rem" }}>Your wishlist is empty</h3>
                            <p style={{ color: "var(--color-text-muted)", marginBottom: "2rem" }}>Save products and services you love for later.</p>
                            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
                                <Link href="/products" style={{ padding: "0.75rem 1.5rem", background: "linear-gradient(135deg,#3b82f6,#8b5cf6)", color: "white", borderRadius: "10px", fontWeight: 600, textDecoration: "none" }}>
                                    Browse Products
                                </Link>
                                <Link href="/services" style={{ padding: "0.75rem 1.5rem", background: "rgba(255,255,255,0.05)", color: "var(--color-text-primary)", border: "1px solid var(--color-border)", borderRadius: "10px", fontWeight: 600, textDecoration: "none" }}>
                                    View Services
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1.5rem" }}>
                            {wishlist.map((item, i) => (
                                <div
                                    key={item._id}
                                    className="glass feature-card animate-fadeInUp"
                                    style={{ borderRadius: "20px", overflow: "hidden", display: "flex", flexDirection: "column", animationDelay: `${i * 60}ms` }}
                                >
                                    <div style={{ height: "180px", overflow: "hidden", position: "relative", background: "linear-gradient(135deg, rgba(59,130,246,0.15), rgba(139,92,246,0.15))" }}>
                                        {item.image ? (
                                            <img src={item.image} alt={item.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                        ) : (
                                            <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                <Heart style={{ width: "3rem", height: "3rem", color: "rgba(239,68,68,0.3)" }} />
                                            </div>
                                        )}
                                        <span style={{ position: "absolute", top: "0.75rem", left: "0.75rem", fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", padding: "0.2rem 0.5rem", borderRadius: "9999px", backdropFilter: "blur(8px)", background: item.itemType === "product" ? "rgba(59,130,246,0.2)" : "rgba(139,92,246,0.2)", color: item.itemType === "product" ? "#3b82f6" : "#8b5cf6" }}>
                                            {item.itemType}
                                        </span>
                                        <button
                                            onClick={() => removeItem(item._id)}
                                            title="Remove from wishlist"
                                            style={{ position: "absolute", top: "0.75rem", right: "0.75rem", width: "32px", height: "32px", background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(8px)" }}
                                        >
                                            <Trash2 style={{ width: "14px", height: "14px", color: "#ef4444" }} />
                                        </button>
                                    </div>

                                    <div style={{ padding: "1.25rem", flex: 1, display: "flex", flexDirection: "column" }}>
                                        <h3 style={{ fontWeight: 700, color: "var(--color-text-primary)", marginBottom: "0.5rem", fontSize: "0.95rem", lineHeight: 1.4 }}>{item.title}</h3>
                                        <p style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--color-primary)", marginBottom: "1rem" }}>{formatBDT(item.price)}</p>
                                        <div style={{ display: "flex", gap: "0.5rem", marginTop: "auto" }}>
                                            <button
                                                onClick={() => addToCart(item)}
                                                style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "0.4rem", padding: "0.6rem", background: "linear-gradient(135deg,#3b82f6,#8b5cf6)", color: "white", border: "none", borderRadius: "8px", fontWeight: 600, fontSize: "0.8rem", cursor: "pointer" }}
                                            >
                                                <ShoppingCart style={{ width: "14px", height: "14px" }} /> Add to Cart
                                            </button>
                                            <Link
                                                href={`/${item.itemType}s/${item.itemId}`}
                                                style={{ padding: "0.6rem", background: "rgba(255,255,255,0.05)", border: "1px solid var(--color-border)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-text-muted)" }}
                                                title="View details"
                                            >
                                                <ExternalLink style={{ width: "14px", height: "14px" }} />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </main>
            <Footer />
        </div>
    );
}
