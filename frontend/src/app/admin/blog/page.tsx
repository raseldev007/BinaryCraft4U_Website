"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/Toast";
import { Plus, Edit, Trash2, Eye, EyeOff, Star, BookOpen } from "lucide-react";

interface Blog {
    _id: string;
    title: string;
    slug: string;
    category: string;
    author: string;
    published: boolean;
    isFeatured: boolean;
    views: number;
    createdAt: string;
}

interface BlogForm {
    title: string;
    excerpt: string;
    content: string;
    category: string;
    author: string;
    featuredImage: string;
    published: boolean;
    isFeatured: boolean;
}

const DEFAULT_FORM: BlogForm = { title: "", excerpt: "", content: "", category: "General", author: "Binary Craft Team", featuredImage: "", published: false, isFeatured: false };

export default function AdminBlogPage() {
    const { token } = useAuth();
    const { success, error: showError } = useToast();
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);
    const [form, setForm] = useState<BlogForm>(DEFAULT_FORM);
    const [saving, setSaving] = useState(false);

    const headers = { "Content-Type": "application/json", Authorization: `Bearer ${token}` };

    const fetchBlogs = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blog/admin/all`, { headers: { Authorization: `Bearer ${token}` } });
            const data = await res.json();
            if (data.success) setBlogs(data.blogs);
        } catch { showError("Failed to load blogs"); }
        finally { setLoading(false); }
    }, [token, showError]);

    useEffect(() => { fetchBlogs(); }, [fetchBlogs]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.title || !form.content) return showError("Title and content are required");
        setSaving(true);
        try {
            const url = editId ? `${process.env.NEXT_PUBLIC_API_URL}/blog/${editId}` : `${process.env.NEXT_PUBLIC_API_URL}/blog`;
            const method = editId ? "PUT" : "POST";
            const res = await fetch(url, { method, headers, body: JSON.stringify(form) });
            const data = await res.json();
            if (data.success) {
                success(editId ? "Blog updated!" : "Blog created!");
                setShowForm(false); setEditId(null); setForm(DEFAULT_FORM);
                fetchBlogs();
            } else { showError(data.message || "Failed to save"); }
        } catch { showError("Error saving blog"); }
        finally { setSaving(false); }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this blog post?")) return;
        try {
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blog/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
            success("Blog deleted");
            setBlogs(prev => prev.filter(b => b._id !== id));
        } catch { showError("Failed to delete"); }
    };

    const startEdit = (blog: Blog) => {
        setEditId(blog._id);
        setForm({ title: blog.title, excerpt: "", content: "", category: blog.category, author: blog.author, featuredImage: "", published: blog.published, isFeatured: blog.isFeatured });
        setShowForm(true);
    };

    return (
        <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2rem" }}>
                <div>
                    <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--color-text-primary)" }}>Blog Management</h1>
                    <p style={{ color: "var(--color-text-muted)", fontSize: "0.875rem", marginTop: "0.25rem" }}>Create and manage blog content</p>
                </div>
                <button onClick={() => { setShowForm(!showForm); setEditId(null); setForm(DEFAULT_FORM); }}
                    style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.6rem 1.25rem", background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", color: "white", border: "none", borderRadius: "10px", fontWeight: 600, cursor: "pointer" }}>
                    <Plus style={{ width: "16px", height: "16px" }} /> New Post
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="glass" style={{ padding: "1.5rem", borderRadius: "16px", marginBottom: "2rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <h2 style={{ fontWeight: 700, color: "var(--color-text-primary)", marginBottom: "0.5rem" }}>{editId ? "Edit Post" : "New Blog Post"}</h2>
                    {(["title", "excerpt", "featuredImage", "category", "author"] as const).map((field) => (
                        <div key={field}>
                            <label style={{ display: "block", fontSize: "0.8rem", color: "var(--color-text-muted)", marginBottom: "0.3rem", textTransform: "capitalize" }}>{field.replace(/([A-Z])/g, ' $1')}{field === "title" ? " *" : ""}</label>
                            <input type="text" value={form[field]} onChange={e => setForm(prev => ({ ...prev, [field]: e.target.value }))}
                                style={{ width: "100%", padding: "0.6rem 0.875rem", background: "rgba(255,255,255,0.05)", border: "1px solid var(--color-border)", borderRadius: "8px", color: "var(--color-text-primary)", fontSize: "0.875rem", outline: "none", boxSizing: "border-box" }} />
                        </div>
                    ))}
                    <div>
                        <label style={{ display: "block", fontSize: "0.8rem", color: "var(--color-text-muted)", marginBottom: "0.3rem" }}>Content (HTML supported) *</label>
                        <textarea value={form.content} onChange={e => setForm(prev => ({ ...prev, content: e.target.value }))} rows={10}
                            placeholder="Write your blog content here. HTML tags are supported."
                            style={{ width: "100%", padding: "0.6rem 0.875rem", background: "rgba(255,255,255,0.05)", border: "1px solid var(--color-border)", borderRadius: "8px", color: "var(--color-text-primary)", fontSize: "0.875rem", outline: "none", resize: "vertical", fontFamily: "monospace", boxSizing: "border-box" }} />
                    </div>
                    <div style={{ display: "flex", gap: "1.5rem" }}>
                        {(["published", "isFeatured"] as const).map((field) => (
                            <label key={field} style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", color: "var(--color-text-secondary)", fontSize: "0.875rem" }}>
                                <input type="checkbox" checked={form[field]} onChange={e => setForm(prev => ({ ...prev, [field]: e.target.checked }))} />
                                {field === "published" ? "Publish Now" : "Mark as Featured"}
                            </label>
                        ))}
                    </div>
                    <div style={{ display: "flex", gap: "0.75rem" }}>
                        <button type="submit" disabled={saving}
                            style={{ padding: "0.6rem 1.5rem", background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", color: "white", border: "none", borderRadius: "8px", fontWeight: 600, cursor: saving ? "not-allowed" : "pointer" }}>
                            {saving ? "Saving..." : editId ? "Update Post" : "Create Post"}
                        </button>
                        <button type="button" onClick={() => { setShowForm(false); setEditId(null); }}
                            style={{ padding: "0.6rem 1.5rem", background: "rgba(255,255,255,0.05)", color: "var(--color-text-secondary)", border: "1px solid var(--color-border)", borderRadius: "8px", fontWeight: 600, cursor: "pointer" }}>
                            Cancel
                        </button>
                    </div>
                </form>
            )}

            {loading ? (
                <div style={{ display: "grid", gap: "0.75rem" }}>
                    {[...Array(4)].map((_, i) => <div key={i} className="animate-shimmer" style={{ height: "64px", borderRadius: "12px" }} />)}
                </div>
            ) : blogs.length === 0 ? (
                <div className="glass" style={{ padding: "3rem", borderRadius: "16px", textAlign: "center", color: "var(--color-text-muted)" }}>
                    <BookOpen style={{ width: "3rem", height: "3rem", margin: "0 auto 1rem", opacity: 0.4 }} />
                    <p>No blog posts yet. Create your first post!</p>
                </div>
            ) : (
                <div style={{ display: "grid", gap: "0.75rem" }}>
                    {blogs.map(blog => (
                        <div key={blog._id} className="glass" style={{ padding: "1rem 1.25rem", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.75rem" }}>
                            <div>
                                <p style={{ fontWeight: 600, color: "var(--color-text-primary)", marginBottom: "0.25rem" }}>{blog.title}</p>
                                <div style={{ display: "flex", gap: "0.75rem", fontSize: "0.75rem", color: "var(--color-text-muted)", flexWrap: "wrap" }}>
                                    <span>{blog.category}</span>
                                    <span>by {blog.author}</span>
                                    <span>{blog.views} views</span>
                                    <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                                    {blog.isFeatured && <span style={{ color: "#f59e0b" }}>⭐ Featured</span>}
                                </div>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                <span style={{ fontSize: "0.7rem", padding: "0.2rem 0.6rem", borderRadius: "9999px", border: "1px solid", background: blog.published ? "rgba(16,185,129,0.1)" : "rgba(100,116,139,0.1)", borderColor: blog.published ? "rgba(16,185,129,0.3)" : "var(--color-border)", color: blog.published ? "#10b981" : "var(--color-text-muted)", fontWeight: 600 }}>
                                    {blog.published ? "Published" : "Draft"}
                                </span>
                                {blog.published ? <Eye style={{ width: "16px", height: "16px", color: "var(--color-text-muted)" }} /> : <EyeOff style={{ width: "16px", height: "16px", color: "var(--color-text-muted)" }} />}
                                {blog.isFeatured && <Star style={{ width: "16px", height: "16px", color: "#f59e0b", fill: "#f59e0b" }} />}
                                <button onClick={() => startEdit(blog)} title="Edit"
                                    style={{ padding: "0.4rem", background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)", borderRadius: "8px", cursor: "pointer", color: "#3b82f6" }}>
                                    <Edit style={{ width: "14px", height: "14px" }} />
                                </button>
                                <button onClick={() => handleDelete(blog._id)} title="Delete"
                                    style={{ padding: "0.4rem", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "8px", cursor: "pointer", color: "#ef4444" }}>
                                    <Trash2 style={{ width: "14px", height: "14px" }} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
