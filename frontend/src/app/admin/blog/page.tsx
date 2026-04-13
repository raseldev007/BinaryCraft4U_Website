"use client";

import { useState, useEffect, useCallback } from "react";
import { api, API_BASE } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/Toast";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
    Plus, Edit, Trash2, Eye, EyeOff, Star,
    BookOpen, X, Loader2, Clock, Search
} from "lucide-react";

interface Blog {
    _id: string;
    title: string;
    slug: string;
    category: string;
    author: string;
    published: boolean;
    isFeatured: boolean;
    views: number;
    excerpt: string;
    content: string;
    featuredImage: string;
    tags: string[];
    createdAt: string;
}

const BLOG_CATEGORIES = ["General", "Technology", "Web Development", "Mobile", "Design", "Business", "Tutorial", "News"];

const EMPTY_FORM = {
    title: "",
    excerpt: "",
    content: "",
    category: "General",
    author: "BinaryNexa Team",
    featuredImage: "",
    tags: "",
    published: true,   // default ON — post is visible on the website immediately
    isFeatured: false,
};

export default function AdminBlogPage() {
    const { token } = useAuth();
    const { success, error: showError } = useToast();

    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);
    const [loadingEdit, setLoadingEdit] = useState(false);
    const [form, setForm] = useState(EMPTY_FORM);
    const [formError, setFormError] = useState("");

    const authHeaders = { "Content-Type": "application/json", Authorization: `Bearer ${token}` };

    // ─── Fetch all blogs ──────────────────────────────────────────────────────
    const fetchBlogs = useCallback(async () => {
        if (!token) return; // wait for auth context to hydrate
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/blog/admin/all`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                console.error("Blog load failed:", data.message);
                setLoading(false);
                return;
            }
            const data = await res.json();
            if (data.success) setBlogs(data.blogs);
        } catch (err) {
            console.error("Network error loading blogs:", err);
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => { fetchBlogs(); }, [fetchBlogs]);

    // ─── Open "New Post" modal ────────────────────────────────────────────────
    const openNew = () => {
        setEditId(null);
        setForm(EMPTY_FORM);
        setFormError("");
        setIsModalOpen(true);
    };

    // ─── Open "Edit" modal — fetches FULL post so content is never empty ──────
    const openEdit = async (id: string) => {
        setEditId(id);
        setForm(EMPTY_FORM);
        setFormError("");
        setIsModalOpen(true);
        setLoadingEdit(true);
        try {
            const res = await fetch(`${API_BASE}/blog/admin/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                const b: Blog = data.blog;
                setForm({
                    title: b.title,
                    excerpt: b.excerpt || "",
                    content: b.content || "",
                    category: b.category || "General",
                    author: b.author || "BinaryNexa Team",
                    featuredImage: b.featuredImage || "",
                    tags: Array.isArray(b.tags) ? b.tags.join(", ") : "",
                    published: !!b.published,
                    isFeatured: !!b.isFeatured,
                });
            } else {
                showError("Failed to load blog post");
                setIsModalOpen(false);
            }
        } catch {
            showError("Network error loading post");
            setIsModalOpen(false);
        } finally {
            setLoadingEdit(false);
        }
    };

    // ─── Save (create or update) ──────────────────────────────────────────────
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError("");
        if (!form.title.trim()) return setFormError("Title is required.");
        if (!form.content.trim()) return setFormError("Content is required.");

        setSaving(true);
        try {
            const payload = {
                ...form,
                tags: form.tags ? form.tags.split(",").map(t => t.trim()).filter(Boolean) : [],
            };

            const url = editId
                ? `${API_BASE}/blog/${editId}`
                : `${API_BASE}/blog`;
            const method = editId ? "PUT" : "POST";

            const res = await fetch(url, { method, headers: authHeaders, body: JSON.stringify(payload) });
            const data = await res.json();

            if (data.success) {
                success(editId ? "Blog post updated successfully." : "Blog post created and published.");
                setIsModalOpen(false);
                fetchBlogs();
            } else {
                setFormError(data.message || "Failed to save post.");
            }
        } catch {
            setFormError("A network error occurred. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    // ─── Delete ───────────────────────────────────────────────────────────────
    const handleDelete = async (blog: Blog) => {
        if (!confirm(`Permanently delete "${blog.title}"? This cannot be undone.`)) return;
        try {
            const res = await fetch(`${API_BASE}/blog/${blog._id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                success(`"${blog.title}" deleted.`);
                setBlogs(prev => prev.filter(b => b._id !== blog._id));
            } else {
                showError(data.message || "Failed to delete");
            }
        } catch {
            showError("Network error deleting post");
        }
    };

    // ─── Quick toggle publish ─────────────────────────────────────────────────
    const togglePublish = async (blog: Blog) => {
        try {
            const res = await fetch(`${API_BASE}/blog/${blog._id}`, {
                method: "PUT",
                headers: authHeaders,
                body: JSON.stringify({ published: !blog.published })
            });
            const data = await res.json();
            if (data.success) {
                success(blog.published ? "Post moved to Drafts." : "Post published.");
                fetchBlogs();
            }
        } catch { showError("Failed to update status"); }
    };

    // ─── Filtered list ────────────────────────────────────────────────────────
    const filtered = blogs.filter(b =>
        b.title.toLowerCase().includes(search.toLowerCase()) ||
        b.category.toLowerCase().includes(search.toLowerCase()) ||
        b.author.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="animate-fadeIn">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-1">Blog Management</h1>
                    <p className="text-sm text-text-muted font-medium">Create, edit, publish, and manage all blog content</p>
                </div>
                <Button onClick={openNew} className="shadow-[0_0_15px_rgba(59,130,246,0.2)] shrink-0">
                    <Plus className="w-5 h-5 mr-2" /> New Blog Post
                </Button>
            </div>

            {/* Search bar */}
            <div className="relative mb-6 max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                    type="text"
                    placeholder="Search by title, category, author..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-border rounded-xl text-white text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                />
            </div>

            {/* Blog List Table */}
            <div className="glass-panel border border-border rounded-xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[900px]">
                        <thead>
                            <tr className="bg-white/5 border-b border-border">
                                <th className="p-4 pl-6 text-xs font-bold uppercase tracking-widest text-text-muted">Post</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-widest text-text-muted">Category</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-widest text-text-muted">Author</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-widest text-text-muted">Views</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-widest text-text-muted">Status</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-widest text-text-muted">Date</th>
                                <th className="p-4 pr-6 text-xs font-bold uppercase tracking-widest text-text-muted text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <tr key={i} className="border-b border-border/50">
                                        <td className="p-5 pl-6"><div className="h-4 w-56 bg-white/5 rounded animate-pulse mb-2" /><div className="h-3 w-32 bg-white/5 rounded animate-pulse" /></td>
                                        <td className="p-5"><div className="h-6 w-24 bg-white/5 rounded-full animate-pulse" /></td>
                                        <td className="p-5"><div className="h-4 w-28 bg-white/5 rounded animate-pulse" /></td>
                                        <td className="p-5"><div className="h-4 w-12 bg-white/5 rounded animate-pulse" /></td>
                                        <td className="p-5"><div className="h-6 w-20 bg-white/5 rounded-full animate-pulse" /></td>
                                        <td className="p-5"><div className="h-4 w-20 bg-white/5 rounded animate-pulse" /></td>
                                        <td className="p-5 pr-6 text-right"><div className="h-8 w-20 bg-white/5 rounded-lg animate-pulse ml-auto" /></td>
                                    </tr>
                                ))
                            ) : filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="p-16 text-center">
                                        <BookOpen className="w-10 h-10 text-text-muted/40 mx-auto mb-3" />
                                        <p className="text-text-muted font-medium">{search ? "No posts match your search." : "No blog posts yet. Create your first post!"}</p>
                                    </td>
                                </tr>
                            ) : (
                                filtered.map(blog => (
                                    <tr key={blog._id} className="border-b border-border/50 hover:bg-white/[0.02] transition-colors group">
                                        <td className="p-5 pl-6 max-w-[280px]">
                                            <div className="font-bold text-white text-sm truncate">{blog.title}</div>
                                            <div className="text-xs text-text-muted mt-1 font-mono truncate">/{blog.slug}</div>
                                            {blog.isFeatured && (
                                                <div className="inline-flex items-center gap-1 mt-1 text-[9px] font-black uppercase tracking-wider text-warning bg-warning/10 border border-warning/20 px-2 py-0.5 rounded-full">
                                                    <Star className="w-2.5 h-2.5" /> Featured
                                                </div>
                                            )}
                                        </td>
                                        <td className="p-5">
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/5 text-text-secondary border border-border">
                                                {blog.category}
                                            </span>
                                        </td>
                                        <td className="p-5 text-sm text-text-secondary font-medium">{blog.author}</td>
                                        <td className="p-5">
                                            <div className="flex items-center gap-1.5 text-sm text-text-muted">
                                                <Eye className="w-3.5 h-3.5" /> {blog.views ?? 0}
                                            </div>
                                        </td>
                                        <td className="p-5">
                                            <button
                                                onClick={() => togglePublish(blog)}
                                                title="Click to toggle publish status"
                                                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border transition-all hover:scale-105 ${blog.published
                                                    ? "text-success bg-success/10 border-success/30 hover:bg-success/20"
                                                    : "text-text-muted bg-white/5 border-border hover:border-primary/50"
                                                    }`}
                                            >
                                                {blog.published ? <><Eye className="w-3 h-3" /> Published</> : <><EyeOff className="w-3 h-3" /> Draft</>}
                                            </button>
                                        </td>
                                        <td className="p-5 text-sm text-text-muted">
                                            <div className="flex items-center gap-1">
                                                <Clock className="w-3.5 h-3.5" />
                                                {new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </div>
                                        </td>
                                        <td className="p-5 pr-6 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                                                <Button
                                                    variant="outline" size="icon"
                                                    onClick={() => openEdit(blog._id)}
                                                    title="Edit post"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="outline" size="icon"
                                                    className="hover:bg-danger/10 hover:text-danger hover:border-danger/50"
                                                    onClick={() => handleDelete(blog)}
                                                    title="Delete post"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                {!loading && (
                    <div className="px-6 py-3 border-t border-border/50 text-xs text-text-muted font-medium">
                        {filtered.length} post{filtered.length !== 1 ? "s" : ""} total
                    </div>
                )}
            </div>

            {/* ─── Create / Edit Modal ─────────────────────────────────────────── */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => !saving && setIsModalOpen(false)} />
                    <div className="relative w-full max-w-3xl bg-bg-card border border-border rounded-2xl shadow-2xl flex flex-col max-h-[92vh] animate-fadeInUp overflow-hidden">

                        {/* Modal Header */}
                        <div className="p-6 border-b border-border flex items-center justify-between shrink-0">
                            <div>
                                <h2 className="text-2xl font-black text-white">
                                    {editId ? "Edit Blog Post" : "Create New Blog Post"}
                                </h2>
                                <p className="text-text-muted text-sm mt-1">
                                    {editId ? "Update the content and settings of this blog post." : "Fill in the details to publish a new post."}
                                </p>
                            </div>
                            <button
                                onClick={() => !saving && setIsModalOpen(false)}
                                className="w-9 h-9 flex items-center justify-center rounded-full bg-white/5 hover:bg-danger text-text-muted hover:text-white transition-colors shrink-0"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
                            {loadingEdit ? (
                                <div className="flex items-center justify-center py-16">
                                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                                    <span className="ml-3 text-text-muted font-medium">Loading post data...</span>
                                </div>
                            ) : (
                                <form id="blog-form" onSubmit={handleSubmit} className="space-y-6">
                                    {formError && (
                                        <div className="p-4 rounded-xl bg-danger/10 border border-danger/30 text-danger text-sm font-bold flex items-center gap-2">
                                            <span className="font-bold">Error:</span> {formError}
                                        </div>
                                    )}

                                    {/* Title */}
                                    <Input
                                        floatingLabel="Post Title *"
                                        value={form.title}
                                        onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                                        required
                                    />

                                    {/* Author + Category */}
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <Input
                                            floatingLabel="Author Name"
                                            value={form.author}
                                            onChange={e => setForm(p => ({ ...p, author: e.target.value }))}
                                        />
                                        <div>
                                            <label className="text-xs font-bold uppercase tracking-wider text-text-muted mb-2 block">Category</label>
                                            <select
                                                className="w-full bg-white/5 border border-border text-white text-sm rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all px-4 py-3.5 appearance-none"
                                                value={form.category}
                                                onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                                            >
                                                {BLOG_CATEGORIES.map(c => (
                                                    <option key={c} value={c} className="bg-bg-card">{c}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    {/* Featured Image + Tags */}
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <Input
                                            floatingLabel="Featured Image URL"
                                            value={form.featuredImage}
                                            onChange={e => setForm(p => ({ ...p, featuredImage: e.target.value }))}
                                            placeholder="/uploads/my-image.png"
                                        />
                                        <Input
                                            floatingLabel="Tags (comma separated)"
                                            value={form.tags}
                                            onChange={e => setForm(p => ({ ...p, tags: e.target.value }))}
                                            placeholder="flutter, web, react"
                                        />
                                    </div>

                                    {/* Excerpt */}
                                    <div>
                                        <label className="text-xs font-bold uppercase tracking-wider text-text-muted mb-2 block">Short Excerpt (Subtitle / Summary)</label>
                                        <textarea
                                            className="w-full bg-white/5 border border-border text-white text-sm rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all px-4 py-3.5 min-h-[80px] custom-scrollbar"
                                            placeholder="A brief summary that appears on the blog listing page..."
                                            value={form.excerpt}
                                            onChange={e => setForm(p => ({ ...p, excerpt: e.target.value }))}
                                        />
                                    </div>

                                    {/* Content — Main HTML editor */}
                                    <div>
                                        <label className="text-xs font-bold uppercase tracking-wider text-text-muted mb-2 flex items-center justify-between">
                                            Full Content (HTML supported) *
                                            <span className="text-[10px] text-primary bg-primary/10 px-2 py-0.5 rounded-full normal-case tracking-normal font-bold">Supports &lt;h2&gt; &lt;p&gt; &lt;ul&gt; &lt;strong&gt; tags</span>
                                        </label>
                                        <textarea
                                            className="w-full bg-white/5 border border-border text-white text-sm rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all px-4 py-3.5 min-h-[280px] custom-scrollbar font-mono leading-relaxed"
                                            placeholder="<h2>Introduction</h2>&#10;<p>Write your content here. Full HTML is supported...</p>&#10;<ul>&#10;  <li>Key point one</li>&#10;  <li>Key point two</li>&#10;</ul>"
                                            value={form.content}
                                            onChange={e => setForm(p => ({ ...p, content: e.target.value }))}
                                            required
                                            spellCheck
                                        />
                                    </div>

                                    {/* Toggles */}
                                    <div className="flex flex-col sm:flex-row gap-6 pt-2 p-4 bg-white/[0.02] rounded-xl border border-border">
                                        <div className="flex-1">
                                            <p className="text-xs font-bold uppercase tracking-wider text-text-muted mb-3">Publication Status</p>
                                            <label className="flex items-center gap-3 cursor-pointer group">
                                                <div
                                                    className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${form.published ? "bg-success" : "bg-danger/60"}`}
                                                    onClick={() => setForm(p => ({ ...p, published: !p.published }))}
                                                >
                                                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${form.published ? "translate-x-6" : "translate-x-1"}`} />
                                                </div>
                                                <div>
                                                    <span className={`text-sm font-bold transition-colors ${form.published ? "text-success" : "text-danger"}`}>
                                                        {form.published ? "Published — Visible on website" : "Draft — Hidden from public"}
                                                    </span>
                                                    <p className="text-xs text-text-muted mt-0.5">
                                                        {form.published ? "This post will appear on /blog immediately." : "Only you can see this in the admin panel."}
                                                    </p>
                                                </div>
                                            </label>
                                        </div>

                                        <div className="flex-1">
                                            <p className="text-xs font-bold uppercase tracking-wider text-text-muted mb-3">Homepage Spotlight</p>
                                            <label className="flex items-center gap-3 cursor-pointer group">
                                                <div
                                                    className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${form.isFeatured ? "bg-warning" : "bg-white/10"}`}
                                                    onClick={() => setForm(p => ({ ...p, isFeatured: !p.isFeatured }))}
                                                >
                                                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${form.isFeatured ? "translate-x-6" : "translate-x-1"}`} />
                                                </div>
                                                <div>
                                                    <span className={`text-sm font-bold transition-colors ${form.isFeatured ? "text-warning" : "text-text-secondary"}`}>
                                                        {form.isFeatured ? "Featured Post" : "Not Featured"}
                                                    </span>
                                                    <p className="text-xs text-text-muted mt-0.5">Show as the top highlighted post.</p>
                                                </div>
                                            </label>
                                        </div>
                                    </div>
                                </form>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="p-6 border-t border-border shrink-0 flex items-center justify-between bg-bg-primary/40">
                            <p className="text-xs text-text-muted">
                                {editId ? "Changes will update the live post immediately." : "New post will be saved in the selected status."}
                            </p>
                            <div className="flex gap-3">
                                <Button variant="outline" onClick={() => setIsModalOpen(false)} disabled={saving} className="border-white/10">
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    form="blog-form"
                                    isLoading={saving}
                                    disabled={saving || loadingEdit}
                                    className="min-w-[160px] shadow-[0_0_15px_rgba(59,130,246,0.2)]"
                                >
                                    {editId ? "Save Changes" : "Create Post"}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
