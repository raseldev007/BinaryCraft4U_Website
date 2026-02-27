"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ArrowRight, Clock, User, BookOpen, Search } from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { getImageUrl } from "@/lib/utils";

interface BlogPost {
    _id: string;
    title: string;
    slug: string;
    excerpt: string;
    category: string;
    author: string;
    createdAt: string;
    featuredImage: string;
    isFeatured: boolean;
    tags: string[];
    views: number;
}

const CAT_COLORS: Record<string, string> = {
    Development: "rgba(59,130,246,0.15)",
    Design: "rgba(139,92,246,0.15)",
    Security: "rgba(239,68,68,0.15)",
    Business: "rgba(16,185,129,0.15)",
    General: "rgba(100,116,139,0.15)",
};

const CAT_TEXT: Record<string, string> = {
    Development: "#3b82f6",
    Design: "#8b5cf6",
    Security: "#ef4444",
    Business: "#10b981",
    General: "#64748b",
};

function formatDate(d: string) {
    return new Date(d).toLocaleDateString("en-BD", { year: "numeric", month: "short", day: "numeric" });
}

export default function BlogPage() {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [featured, setFeatured] = useState<BlogPost | null>(null);
    const [categories, setCategories] = useState<string[]>(["All"]);
    const [activeCategory, setActiveCategory] = useState("All");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    const fetchPosts = useCallback(async (cat: string, pg: number, q: string) => {
        setLoading(true);
        try {
            const params = new URLSearchParams({ page: String(pg), limit: "9" });
            if (cat && cat !== "All") params.append("category", cat);
            if (q) params.append("search", q);
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blog?${params}`);
            const data = await res.json();
            if (data.success) {
                setPosts(data.blogs || []);
                setTotalPages(data.pages || 1);
                if (data.categories) setCategories(["All", ...data.categories]);
            }
        } catch (err) {
            console.error("Failed to fetch blogs:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchFeatured = useCallback(async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blog?featured=true&limit=1`);
            const data = await res.json();
            if (data.success && data.blogs?.length > 0) setFeatured(data.blogs[0]);
        } catch { /* ignore */ }
    }, []);

    useEffect(() => {
        fetchFeatured();
    }, [fetchFeatured]);

    useEffect(() => {
        const t = setTimeout(() => { fetchPosts(activeCategory, page, search); }, search ? 400 : 0);
        return () => clearTimeout(t);
    }, [activeCategory, page, search, fetchPosts]);

    const nonFeaturedPosts = posts.filter(p => p._id !== featured?._id);

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1 pt-20">
                {/* Hero */}
                <section className="relative pt-24 pb-16 border-b border-border text-center overflow-hidden" style={{ background: "rgba(17,24,39,0.3)" }}>
                    <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at top, rgba(59,130,246,0.08), transparent 60%)" }} />
                    <div className="max-w-2xl mx-auto px-6 relative z-10 animate-fadeInUp">
                        <div className="section-label mb-5 mx-auto" style={{ display: "inline-flex" }}>
                            <BookOpen className="w-3 h-3" /> Blog
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black mb-4">
                            Insights & <span className="gradient-text">Updates</span>
                        </h1>
                        <p style={{ color: "var(--color-text-muted)", fontSize: "1.1rem" }}>
                            Web development, design trends, and tech news from the Binary Craft team.
                        </p>
                    </div>
                </section>

                <section className="py-16">
                    <div className="max-w-[1200px] mx-auto px-6">
                        {/* Featured */}
                        {featured && (
                            <div className="glass rounded-2xl overflow-hidden mb-12 group" style={{ border: "1px solid var(--color-border)", transition: "border-color 0.3s" }}>
                                <div className="md:grid md:grid-cols-2">
                                    <div style={{ height: "280px", overflow: "hidden" }}>
                                        {featured.featuredImage ? (
                                            <img src={getImageUrl(featured.featuredImage)} alt={featured.title} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.7s" }} className="group-hover:scale-105" />
                                        ) : (
                                            <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg, rgba(59,130,246,0.2), rgba(139,92,246,0.2))", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                <BookOpen style={{ width: "4rem", height: "4rem", color: "rgba(59,130,246,0.5)" }} />
                                            </div>
                                        )}
                                    </div>
                                    <div style={{ padding: "2.5rem", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
                                            <span style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", padding: "0.25rem 0.6rem", borderRadius: "9999px", background: CAT_COLORS[featured.category] || "rgba(100,116,139,0.15)", color: CAT_TEXT[featured.category] || "#64748b" }}>
                                                {featured.category}
                                            </span>
                                            <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--color-primary)", background: "rgba(59,130,246,0.1)", padding: "0.25rem 0.6rem", borderRadius: "9999px", border: "1px solid rgba(59,130,246,0.2)" }}>⭐ Featured</span>
                                        </div>
                                        <h2 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "1rem", color: "var(--color-text-primary)", lineHeight: 1.3 }}>{featured.title}</h2>
                                        <p style={{ color: "var(--color-text-secondary)", lineHeight: 1.7, marginBottom: "1.5rem", fontSize: "0.95rem" }}>{featured.excerpt}</p>
                                        <div style={{ display: "flex", alignItems: "center", gap: "1rem", fontSize: "0.75rem", color: "var(--color-text-muted)", marginBottom: "1.5rem" }}>
                                            <span style={{ display: "flex", alignItems: "center", gap: "4px" }}><User style={{ width: "12px", height: "12px" }} />{featured.author}</span>
                                            <span>{formatDate(featured.createdAt)}</span>
                                        </div>
                                        <Link href={`/blog/${featured.slug}`} style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", color: "var(--color-primary)", fontWeight: 700, textDecoration: "none" }}>
                                            Read Article <ArrowRight style={{ width: "16px", height: "16px" }} />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Search */}
                        <div style={{ position: "relative", marginBottom: "1.5rem", maxWidth: "360px" }}>
                            <Search style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", width: "16px", height: "16px", color: "var(--color-text-muted)" }} />
                            <input
                                type="text" value={search} onChange={e => setSearch(e.target.value)}
                                placeholder="Search articles..."
                                style={{ width: "100%", paddingLeft: "40px", paddingRight: "12px", paddingTop: "10px", paddingBottom: "10px", background: "rgba(255,255,255,0.05)", border: "1px solid var(--color-border)", borderRadius: "50px", color: "var(--color-text-primary)", fontSize: "0.875rem", outline: "none", boxSizing: "border-box" }}
                            />
                        </div>

                        {/* Category Tabs */}
                        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "2rem", flexWrap: "wrap" }}>
                            {categories.map(cat => (
                                <button key={cat} onClick={() => { setActiveCategory(cat); setPage(1); }}
                                    style={{ padding: "0.4rem 1rem", borderRadius: "9999px", fontSize: "0.875rem", fontWeight: 600, cursor: "pointer", border: "1px solid", transition: "all 0.2s", background: activeCategory === cat ? "linear-gradient(135deg, #3b82f6, #8b5cf6)" : "rgba(255,255,255,0.04)", borderColor: activeCategory === cat ? "transparent" : "var(--color-border)", color: activeCategory === cat ? "white" : "var(--color-text-muted)" }}>
                                    {cat}
                                </button>
                            ))}
                        </div>

                        {/* Post Grid */}
                        {loading ? (
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.5rem" }}>
                                {[...Array(6)].map((_, i) => (
                                    <div key={i} className="animate-shimmer" style={{ height: "320px", borderRadius: "16px", background: "rgba(255,255,255,0.04)" }} />
                                ))}
                            </div>
                        ) : nonFeaturedPosts.length === 0 ? (
                            <div style={{ textAlign: "center", padding: "5rem 0", color: "var(--color-text-muted)" }}>
                                <BookOpen style={{ width: "4rem", height: "4rem", margin: "0 auto 1rem", opacity: 0.3 }} />
                                <p style={{ fontSize: "1.1rem" }}>No articles found{activeCategory !== "All" ? ` in "${activeCategory}"` : ""}.</p>
                            </div>
                        ) : (
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.5rem" }}>
                                {nonFeaturedPosts.map((post, i) => (
                                    <div key={post._id} className="glass rounded-2xl flex flex-col relative group overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:border-primary/40 hover:shadow-[0_20px_60px_rgba(59,130,246,0.15)] animate-fadeInUp" style={{ animationDelay: `${i * 60}ms` }}>
                                        <div style={{ height: "200px", overflow: "hidden", position: "relative" }} className="border-b border-white/5">
                                            {post.featuredImage ? (
                                                <img src={getImageUrl(post.featuredImage)} alt={post.title} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s" }} className="group-hover:scale-105" />
                                            ) : (
                                                <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg, rgba(59,130,246,0.15), rgba(139,92,246,0.15))", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                    <BookOpen style={{ width: "2.5rem", height: "2.5rem", color: "rgba(59,130,246,0.4)" }} />
                                                </div>
                                            )}
                                            <div style={{ position: "absolute", top: "0.75rem", left: "0.75rem" }}>
                                                <span style={{ fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", padding: "0.2rem 0.5rem", borderRadius: "9999px", backdropFilter: "blur(8px)", background: CAT_COLORS[post.category] || "rgba(100,116,139,0.2)", color: CAT_TEXT[post.category] || "#64748b" }}>
                                                    {post.category}
                                                </span>
                                            </div>
                                        </div>
                                        <div style={{ padding: "1.25rem", flex: 1, display: "flex", flexDirection: "column" }}>
                                            <h3 className="font-bold text-white text-lg leading-tight mb-2 group-hover:text-primary transition-colors">{post.title}</h3>
                                            <p className="text-sm text-text-secondary leading-relaxed mb-4 flex-1">{post.excerpt}</p>
                                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "0.7rem", color: "var(--color-text-muted)", paddingTop: "0.75rem", borderTop: "1px solid var(--color-border)" }}>
                                                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                                                    <span style={{ display: "flex", alignItems: "center", gap: "4px" }}><User style={{ width: "10px", height: "10px" }} />{post.author}</span>
                                                    <span style={{ display: "flex", alignItems: "center", gap: "4px" }}><Clock style={{ width: "10px", height: "10px" }} />{formatDate(post.createdAt)}</span>
                                                </div>
                                            </div>
                                            <Link href={`/blog/${post.slug}`} style={{ marginTop: "0.75rem", display: "inline-flex", alignItems: "center", color: "var(--color-primary)", fontWeight: 700, fontSize: "0.85rem", textDecoration: "none" }}>
                                                Read More <ArrowRight style={{ width: "14px", height: "14px", marginLeft: "4px" }} />
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem", marginTop: "3rem" }}>
                                {[...Array(totalPages)].map((_, i) => (
                                    <button key={i} onClick={() => setPage(i + 1)}
                                        style={{ width: "36px", height: "36px", borderRadius: "8px", fontWeight: 600, fontSize: "0.875rem", cursor: "pointer", border: "1px solid", transition: "all 0.2s", background: page === i + 1 ? "linear-gradient(135deg, #3b82f6, #8b5cf6)" : "rgba(255,255,255,0.04)", borderColor: page === i + 1 ? "transparent" : "var(--color-border)", color: page === i + 1 ? "white" : "var(--color-text-muted)" }}>
                                        {i + 1}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
