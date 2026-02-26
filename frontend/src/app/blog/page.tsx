"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ArrowRight, Clock, User, BookOpen } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const BLOG_POSTS = [
    {
        id: 1, title: "10 Best Practices for Next.js App Router",
        excerpt: "Learn how to fully leverage the Server Components and routing capabilities of Next.js 14+, including layouts, parallel routes, and dynamic segments.",
        category: "Development", author: "Md Rasel", date: "Feb 24, 2026", readTime: "5 min",
        image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
        featured: true,
    },
    {
        id: 2, title: "Why Glassmorphism is Here to Stay",
        excerpt: "A deep dive into the UI trend that's dominating SaaS platforms and developer tools in 2026.",
        category: "Design", author: "Md Rasel", date: "Feb 20, 2026", readTime: "4 min",
        image: "https://images.unsplash.com/photo-1618761714954-0b8cd0026356?auto=format&fit=crop&w=800&q=80",
        featured: false,
    },
    {
        id: 3, title: "Securing Your Express APIs in 2026",
        excerpt: "Essential security headers, rate limiting, and JWT best practices for modern web apps.",
        category: "Security", author: "Md Rasel", date: "Feb 15, 2026", readTime: "7 min",
        image: "https://images.unsplash.com/photo-1562813733-b31f71025d54?auto=format&fit=crop&w=800&q=80",
        featured: false,
    },
    {
        id: 4, title: "MongoDB Atlas Optimization Guide",
        excerpt: "Indexing strategies, aggregation pipelines, and connection pooling tips for production workloads.",
        category: "Development", author: "Md Rasel", date: "Feb 10, 2026", readTime: "8 min",
        image: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=800&q=80",
        featured: false,
    },
];

const CATEGORIES = ["All", "Development", "Design", "Security"];

const CAT_COLORS: Record<string, string> = {
    Development: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    Design: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    Security: "bg-red-500/10 text-red-400 border-red-500/20",
};

export default function BlogPage() {
    const [activeCategory, setActiveCategory] = useState("All");
    const featured = BLOG_POSTS.find((p) => p.featured);
    const filtered = BLOG_POSTS.filter(
        (p) => !p.featured && (activeCategory === "All" || p.category === activeCategory)
    );

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />

            <main className="flex-1 pt-20">
                {/* Hero */}
                <section className="relative pt-24 pb-16 bg-bg-secondary/30 border-b border-border text-center overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.08),transparent_60%)]" />
                    <div className="max-w-2xl mx-auto px-6 relative z-10 animate-fadeInUp">
                        <div className="section-label mb-5 mx-auto">
                            <BookOpen className="w-3 h-3" />
                            Blog
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black mb-4">
                            Insights &{" "}
                            <span className="gradient-text">Updates</span>
                        </h1>
                        <p className="text-text-muted text-lg">
                            Web development, design trends, and tech news from the Binary Craft team.
                        </p>
                    </div>
                </section>

                <section className="py-16">
                    <div className="max-w-[1200px] mx-auto px-6">
                        {/* Featured Post */}
                        {featured && (
                            <div className="glass rounded-2xl overflow-hidden mb-12 group hover:border-primary/30 transition-all">
                                <div className="md:grid md:grid-cols-2">
                                    <div className="h-64 md:h-auto overflow-hidden">
                                        <img src={featured.image} alt={featured.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                    </div>
                                    <div className="p-8 md:p-10 flex flex-col justify-center">
                                        <div className="flex items-center gap-3 mb-4">
                                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${CAT_COLORS[featured.category] || ""}`}>
                                                {featured.category}
                                            </span>
                                            <span className="text-xs text-primary font-bold bg-primary/10 px-2 py-1 rounded-full border border-primary/20">Featured</span>
                                        </div>
                                        <h2 className="text-2xl md:text-3xl font-black mb-4 group-hover:text-primary transition-colors">{featured.title}</h2>
                                        <p className="text-text-secondary leading-relaxed mb-6">{featured.excerpt}</p>
                                        <div className="flex items-center gap-4 text-xs text-text-muted mb-6">
                                            <span className="flex items-center gap-1"><User className="w-3 h-3" /> {featured.author}</span>
                                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {featured.readTime} read</span>
                                            <span>{featured.date}</span>
                                        </div>
                                        <Link href={`/blog/${featured.id}`} className="inline-flex items-center gap-2 text-primary font-bold hover:text-white transition-colors group/link">
                                            Read Article <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Category Tabs */}
                        <div className="flex gap-2 mb-8 flex-wrap">
                            {CATEGORIES.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${activeCategory === cat
                                            ? "bg-primary text-white shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                                            : "glass text-text-muted hover:text-white"
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>

                        {/* Post Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filtered.map((post, i) => (
                                <div
                                    key={post.id}
                                    className="glass rounded-2xl overflow-hidden group flex flex-col hover:border-primary/30 transition-all hover:-translate-y-1 animate-fadeInUp"
                                    style={{ animationDelay: `${i * 80}ms` }}
                                >
                                    <div className="h-44 overflow-hidden relative">
                                        <img src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                        <div className="absolute top-3 left-3">
                                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border backdrop-blur-md ${CAT_COLORS[post.category] || ""}`}>
                                                {post.category}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-5 flex-1 flex flex-col">
                                        <h3 className="text-base font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">{post.title}</h3>
                                        <p className="text-text-secondary text-sm leading-relaxed mb-4 flex-1 line-clamp-3">{post.excerpt}</p>
                                        <div className="flex items-center justify-between text-xs text-text-muted pt-4 border-t border-border/50">
                                            <div className="flex items-center gap-3">
                                                <span className="flex items-center gap-1"><User className="w-3 h-3" /> {post.author}</span>
                                                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {post.readTime}</span>
                                            </div>
                                        </div>
                                        <Link href={`/blog/${post.id}`} className="mt-4 flex items-center text-primary font-bold text-sm hover:text-white transition-colors group/link">
                                            Read More <ArrowRight className="w-4 h-4 ml-1 group-hover/link:translate-x-1 transition-transform" />
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
