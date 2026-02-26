"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Box, Plus, Edit, Trash2, X, Loader2, Eye } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toast";
import { formatCurrency } from "@/lib/utils";

interface Product {
    _id: string;
    title: string;
    description: string;
    price: number;
    category: string;
    icon: string;
    tags: string[];
    createdAt: string;
}

export default function AdminProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { success, error: toastError } = useToast();

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Form State
    const [prodId, setProdId] = useState("");
    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState("template");
    const [icon, setIcon] = useState("");
    const [tag, setTag] = useState("");

    const loadProducts = async () => {
        setIsLoading(true);
        try {
            const data = await api("/products");
            setProducts(data.products || []);
        } catch (err: any) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadProducts();
    }, []);

    const openAddModal = () => {
        setProdId("");
        setTitle("");
        setDesc("");
        setPrice("");
        setCategory("template");
        setIcon("");
        setTag("");
        setError(null);
        setIsModalOpen(true);
    };

    const openEditModal = (p: Product) => {
        setProdId(p._id);
        setTitle(p.title);
        setDesc(p.description);
        setPrice(p.price.toString());
        setCategory(p.category || "template");
        setIcon(p.icon || "");
        setTag(p.tags && p.tags.length > 0 ? p.tags[0] : "");
        setError(null);
        setIsModalOpen(true);
    };

    const deleteProduct = async (id: string, name: string) => {
        if (!confirm(`Are you sure you want to terminate product component "${name}"?`)) return;
        try {
            await api(`/products/${id}`, "DELETE");
            success(`Product "${name}" deleted successfully.`);
            loadProducts();
        } catch (err: any) {
            toastError(err.message || "Failed to delete");
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setError(null);

        const payload = {
            title,
            description: desc,
            price: parseFloat(price),
            category,
            icon,
            tags: tag ? [tag] : []
        };

        try {
            if (prodId) {
                await api(`/products/${prodId}`, "PUT", payload);
            } else {
                await api("/products", "POST", payload);
            }
            setIsModalOpen(false);
            loadProducts();
        } catch (err: any) {
            setError(err.message || "Failed to save product");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="animate-fadeIn">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-2">Inventory Intelligence</h1>
                    <p className="text-sm font-medium text-text-muted">Manage and scale your digital product ecosystem</p>
                </div>
                <Button onClick={openAddModal} className="shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                    <Plus className="w-5 h-5 mr-2" /> Initialize Product
                </Button>
            </div>

            <div className="glass-panel border border-border rounded-xl overflow-hidden shadow-xl animate-fadeInUp">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[900px]">
                        <thead>
                            <tr className="bg-white/5 border-b border-border">
                                <th className="p-4 pl-6 text-xs font-bold uppercase tracking-widest text-text-muted">Product Identifier</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-widest text-text-muted">Class</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-widest text-text-muted">Valuation</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-widest text-text-muted">Traffic</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-widest text-text-muted">Deployment Date</th>
                                <th className="p-4 pr-6 text-xs font-bold uppercase tracking-widest text-text-muted text-right">Operations</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <tr key={i} className="border-b border-border/50">
                                        <td className="p-6 pl-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-white/5 rounded-xl animate-pulse" />
                                                <div>
                                                    <div className="h-4 w-32 bg-white/5 rounded mb-2 animate-pulse" />
                                                    <div className="h-3 w-20 bg-white/5 rounded animate-pulse" />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-6"><div className="h-6 w-20 bg-white/5 rounded-full animate-pulse" /></td>
                                        <td className="p-6"><div className="h-5 w-16 bg-white/5 rounded animate-pulse" /></td>
                                        <td className="p-6"><div className="h-4 w-12 bg-white/5 rounded animate-pulse" /></td>
                                        <td className="p-6"><div className="h-4 w-24 bg-white/5 rounded animate-pulse" /></td>
                                        <td className="p-6 pr-6 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <div className="w-8 h-8 bg-white/5 rounded-lg animate-pulse" />
                                                <div className="w-8 h-8 bg-white/5 rounded-lg animate-pulse" />
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : products.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-16 text-center text-text-muted font-medium">
                                        Nexus empty. No products detected in the sector.
                                    </td>
                                </tr>
                            ) : (
                                products.map((p) => (
                                    <tr key={p._id} className="border-b border-border/50 hover:bg-white/[0.02] transition-colors group">
                                        <td className="p-5 pl-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-xl bg-white/5 border border-border flex items-center justify-center text-primary text-xl">
                                                    <i className={p.icon || "fas fa-box"} />
                                                </div>
                                                <div>
                                                    <div className="font-bold text-white text-sm">{p.title}</div>
                                                    <div className="text-xs text-text-muted font-mono mt-1">UUID: {p._id.slice(-8).toUpperCase()}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-5">
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/5 text-text-secondary border border-border">
                                                {p.category}
                                            </span>
                                        </td>
                                        <td className="p-5 font-black text-primary text-base">
                                            {formatCurrency(p.price)}
                                        </td>
                                        <td className="p-5 text-sm font-medium text-text-secondary">
                                            <div className="flex items-center gap-1.5 opacity-70">
                                                <Eye className="w-4 h-4" /> 0
                                            </div>
                                        </td>
                                        <td className="p-5 text-sm text-text-muted">
                                            {new Date(p.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="p-5 pr-6 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                                                <Button variant="outline" size="icon" onClick={() => openEditModal(p)} title="Edit Component">
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    className="hover:bg-danger/10 hover:text-danger hover:border-danger/50"
                                                    onClick={() => deleteProduct(p._id, p.title)}
                                                    title="Terminate Component"
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
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setIsModalOpen(false)} />
                    <div className="relative w-full max-w-2xl bg-bg-card border border-border rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="p-6 border-b border-border flex items-center justify-between shrink-0">
                            <h2 className="text-2xl font-black">
                                {prodId ? "Modify Component Matrix" : "Initialize System Component"}
                            </h2>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-danger text-text-muted hover:text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
                            {error && (
                                <div className="mb-6 p-4 rounded-lg bg-danger/10 border border-danger/30 text-danger text-sm font-bold flex items-center gap-2">
                                    <span className="text-lg">❌</span> {error}
                                </div>
                            )}

                            <form id="product-form" onSubmit={handleSave} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-text-secondary mb-2">Component Designation (Title)</label>
                                    <Input
                                        value={title}
                                        onChange={e => setTitle(e.target.value)}
                                        placeholder="e.g. Cyber Shield v2.0"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-text-secondary mb-2">Technical Specification (Description)</label>
                                    <textarea
                                        className="w-full bg-bg-primary border border-border rounded-lg text-text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary p-4 min-h-[120px] transition-all resize-y"
                                        value={desc}
                                        onChange={e => setDesc(e.target.value)}
                                        placeholder="Detailed system specifications..."
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-text-secondary mb-2">Unit Valuation (Price $)</label>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            value={price}
                                            onChange={e => setPrice(e.target.value)}
                                            placeholder="49.99"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-text-secondary mb-2">Classification (Category)</label>
                                        <select
                                            className="w-full bg-bg-primary border border-border rounded-lg text-text-primary focus:outline-none focus:border-primary h-12 px-4 transition-all"
                                            value={category}
                                            onChange={e => setCategory(e.target.value)}
                                            required
                                        >
                                            <option value="template">Digital Template</option>
                                            <option value="software">Core Software</option>
                                            <option value="security">Security Protocol</option>
                                            <option value="hosting">Cloud Infrastructure</option>
                                            <option value="tools">Automation Tool</option>
                                            <option value="design">Graphic Logic</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-text-secondary mb-2">Visual Matrix (Font Awesome Class)</label>
                                        <Input
                                            value={icon}
                                            onChange={e => setIcon(e.target.value)}
                                            placeholder="fas fa-shield-alt"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-text-secondary mb-2">Priority Tag (Badge)</label>
                                        <select
                                            className="w-full bg-bg-primary border border-border rounded-lg text-text-primary focus:outline-none focus:border-primary h-12 px-4 transition-all"
                                            value={tag}
                                            onChange={e => setTag(e.target.value)}
                                        >
                                            <option value="">None</option>
                                            <option value="New">Status: New</option>
                                            <option value="Sale">Status: Sale</option>
                                            <option value="Hot">Status: Hot</option>
                                        </select>
                                    </div>
                                </div>
                            </form>
                        </div>

                        <div className="p-6 border-t border-border mt-auto shrink-0 flex justify-end gap-3 bg-bg-primary/50">
                            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                                Abort Mission
                            </Button>
                            <Button type="submit" form="product-form" isLoading={isSaving} className="shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                                Synchronize Data
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
