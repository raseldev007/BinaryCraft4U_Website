import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ArrowLeft, Clock, User, Eye } from "lucide-react";
import Link from "next/link";

interface BlogPost {
    _id: string;
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    category: string;
    author: string;
    createdAt: string;
    featuredImage: string;
    tags: string[];
    views: number;
}

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://binarycraft4u-backend.onrender.com/api";

async function getBlog(slug: string): Promise<BlogPost | null> {
    try {
        const res = await fetch(`${apiUrl}/blog/${slug}`, { next: { revalidate: 3600 } });
        if (!res.ok) return null;
        const data = await res.json();
        return data.success ? data.blog : null;
    } catch {
        return null;
    }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const blog = await getBlog(slug);
    if (!blog) return { title: "Blog Post Not Found" };
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://binarycraft4u.vercel.app";
    return {
        title: blog.title,
        description: blog.excerpt || blog.title,
        openGraph: {
            title: blog.title,
            description: blog.excerpt || blog.title,
            type: "article",
            images: blog.featuredImage ? [{ url: blog.featuredImage, width: 1200, height: 630 }] : [],
        },
        twitter: { card: "summary_large_image", title: blog.title, description: blog.excerpt },
        alternates: { canonical: `${baseUrl}/blog/${slug}` },
    };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const blog = await getBlog(slug);
    if (!blog) return notFound();

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://binarycraft4u.vercel.app";
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: blog.title,
        description: blog.excerpt,
        author: { "@type": "Person", name: blog.author },
        datePublished: blog.createdAt,
        image: blog.featuredImage || `${baseUrl}/og-image.png`,
        publisher: { "@type": "Organization", name: "Binary Craft", url: baseUrl },
    };

    return (
        <div className="flex flex-col min-h-screen">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <Navbar />
            <main className="flex-1 pt-20">
                {/* Hero Image */}
                {blog.featuredImage && (
                    <div style={{ height: "360px", overflow: "hidden", position: "relative" }}>
                        <img src={blog.featuredImage} alt={blog.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 40%, var(--color-bg-primary))" }} />
                    </div>
                )}

                <div className="max-w-[800px] mx-auto px-6 py-12">
                    {/* Back */}
                    <Link href="/blog" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", color: "var(--color-text-muted)", textDecoration: "none", marginBottom: "2rem", fontSize: "0.9rem" }}>
                        <ArrowLeft style={{ width: "16px", height: "16px" }} /> Back to Blog
                    </Link>

                    {/* Meta */}
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem", flexWrap: "wrap" }}>
                        <span style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", padding: "0.2rem 0.6rem", borderRadius: "9999px", background: "rgba(59,130,246,0.15)", color: "#3b82f6" }}>{blog.category}</span>
                        {blog.tags.map(t => (
                            <span key={t} style={{ fontSize: "0.7rem", padding: "0.2rem 0.6rem", borderRadius: "9999px", background: "rgba(255,255,255,0.05)", color: "var(--color-text-muted)", border: "1px solid var(--color-border)" }}>{t}</span>
                        ))}
                    </div>

                    <h1 style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 900, color: "var(--color-text-primary)", lineHeight: 1.25, marginBottom: "1.5rem" }}>
                        {blog.title}
                    </h1>

                    <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", fontSize: "0.8rem", color: "var(--color-text-muted)", marginBottom: "2.5rem", paddingBottom: "2.5rem", borderBottom: "1px solid var(--color-border)" }}>
                        <span style={{ display: "flex", alignItems: "center", gap: "6px" }}><User style={{ width: "14px", height: "14px" }} />{blog.author}</span>
                        <span style={{ display: "flex", alignItems: "center", gap: "6px" }}><Clock style={{ width: "14px", height: "14px" }} />{new Date(blog.createdAt).toLocaleDateString("en-BD", { year: "numeric", month: "long", day: "numeric" })}</span>
                        {blog.views > 0 && <span style={{ display: "flex", alignItems: "center", gap: "6px" }}><Eye style={{ width: "14px", height: "14px" }} />{blog.views.toLocaleString()} views</span>}
                    </div>

                    {/* Excerpt */}
                    {blog.excerpt && (
                        <p style={{ fontSize: "1.1rem", color: "var(--color-text-secondary)", lineHeight: 1.8, marginBottom: "2rem", fontStyle: "italic", paddingLeft: "1rem", borderLeft: "3px solid var(--color-primary)" }}>
                            {blog.excerpt}
                        </p>
                    )}

                    {/* Content */}
                    <article
                        style={{ color: "var(--color-text-secondary)", lineHeight: 1.9, fontSize: "1rem" }}
                        dangerouslySetInnerHTML={{ __html: blog.content }}
                    />

                    {/* Footer */}
                    <div style={{ marginTop: "4rem", paddingTop: "2rem", borderTop: "1px solid var(--color-border)", textAlign: "center" }}>
                        <p style={{ color: "var(--color-text-muted)", fontSize: "0.875rem", marginBottom: "1rem" }}>
                            Found this helpful? Share it with your team! 🚀
                        </p>
                        <Link href="/blog" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem 1.75rem", background: "linear-gradient(135deg,#3b82f6,#8b5cf6)", color: "white", borderRadius: "10px", fontWeight: 600, textDecoration: "none" }}>
                            <ArrowLeft style={{ width: "16px", height: "16px" }} /> More Articles
                        </Link>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
