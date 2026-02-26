"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Cog, Plus, Edit, Trash2, X, Loader2, Clock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toast";
import { formatCurrency } from "@/lib/utils";

interface Service {
    _id: string;
    title: string;
    description: string;
    price: number;
    category: string;
    icon: string;
    delivery: string;
    features: string[];
    createdAt: string;
}

export default function AdminServicesPage() {
    const [services, setServices] = useState<Service[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { success, error: toastError } = useToast();

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Form State
    const [srvId, setSrvId] = useState("");
    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState("web");
    const [icon, setIcon] = useState("");
    const [delivery, setDelivery] = useState("");
    const [features, setFeatures] = useState("");

    const loadServices = async () => {
        setIsLoading(true);
        try {
            const data = await api("/services");
            setServices(data.services || []);
        } catch (err: any) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadServices();
    }, []);

    const openAddModal = () => {
        setSrvId("");
        setTitle("");
        setDesc("");
        setPrice("");
        setCategory("web");
        setIcon("");
        setDelivery("");
        setFeatures("");
        setError(null);
        setIsModalOpen(true);
    };

    const openEditModal = (s: Service) => {
        setSrvId(s._id);
        setTitle(s.title);
        setDesc(s.description);
        setPrice(s.price.toString());
        setCategory(s.category || "web");
        setIcon(s.icon || "");
        setDelivery(s.delivery || "");
        setFeatures(s.features && Array.isArray(s.features) ? s.features.join(", ") : "");
        setError(null);
        setIsModalOpen(true);
    };

    const deleteService = async (id: string, name: string) => {
        if (!confirm(`Are you sure you want to decommission service "${name}"? All related data will be purged.`)) return;
        try {
            await api(`/services/${id}`, "DELETE");
            success(`Service "${name}" decommissioned successfully.`);
            loadServices();
        } catch (err: any) {
            toastError(err.message || "Failed to delete");
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setError(null);

        const parsedFeatures = features ? features.split(",").map(f => f.trim()).filter(f => f.length > 0) : [];

        const payload = {
            title,
            description: desc,
            price: parseFloat(price),
            category,
            icon,
            delivery,
            features: parsedFeatures
        };

        try {
            if (srvId) {
                await api(`/services/${srvId}`, "PUT", payload);
            } else {
                await api("/services", "POST", payload);
            }
            setIsModalOpen(false);
            loadServices();
        } catch (err: any) {
            setError(err.message || "Failed to save service");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="animate-fadeIn">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-2">Service Architecture</h1>
                    <p className="text-sm font-medium text-text-muted">Configure and optimize your professional IT service portfolio</p>
                </div>
                <Button onClick={openAddModal} className="shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                    <Plus className="w-5 h-5 mr-2" /> Deploy New Service
                </Button>
            </div>

            <div className="glass-panel border border-border rounded-xl overflow-hidden shadow-xl animate-fadeInUp">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[900px]">
                        <thead>
                            <tr className="bg-white/5 border-b border-border">
                                <th className="p-4 pl-6 text-xs font-bold uppercase tracking-widest text-text-muted">Service Configuration</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-widest text-text-muted">Category</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-widest text-text-muted">Entry Point</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-widest text-text-muted">SLA (Delivery)</th>
                                <th className="p-4 pr-6 text-xs font-bold uppercase tracking-widest text-text-muted text-right">Control Matrix</th>
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
                                                    <div className="h-4 w-40 bg-white/5 rounded mb-2 animate-pulse" />
                                                    <div className="h-3 w-24 bg-white/5 rounded animate-pulse" />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-6"><div className="h-6 w-24 bg-white/5 rounded-full animate-pulse" /></td>
                                        <td className="p-6"><div className="h-5 w-16 bg-white/5 rounded animate-pulse" /></td>
                                        <td className="p-6"><div className="h-4 w-28 bg-white/5 rounded animate-pulse" /></td>
                                        <td className="p-6 pr-6 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <div className="w-8 h-8 bg-white/5 rounded-lg animate-pulse" />
                                                <div className="w-8 h-8 bg-white/5 rounded-lg animate-pulse" />
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : services.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-16 text-center text-text-muted font-medium">
                                        Service layer inactive. No deployments found.
                                    </td>
                                </tr>
                            ) : (
                                services.map((s) => (
                                    <tr key={s._id} className="border-b border-border/50 hover:bg-white/[0.02] transition-colors group">
                                        <td className="p-5 pl-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary text-xl shadow-[0_0_10px_rgba(59,130,246,0.1)]">
                                                    <i className={s.icon || "fas fa-cogs"} />
                                                </div>
                                                <div>
                                                    <div className="font-bold text-white text-sm">{s.title}</div>
                                                    <div className="text-xs text-text-muted font-mono mt-1">SID: {s._id.slice(-8).toUpperCase()}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-5">
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">
                                                {s.category}
                                            </span>
                                        </td>
                                        <td className="p-5 font-black text-white text-base">
                                            {formatCurrency(s.price)}
                                        </td>
                                        <td className="p-5 text-sm font-medium text-text-secondary">
                                            <div className="flex items-center gap-1.5 opacity-70">
                                                <Clock className="w-4 h-4" /> {s.delivery || 'N/A'}
                                            </div>
                                        </td>
                                        <td className="p-5 pr-6 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                                                <Button variant="outline" size="icon" onClick={() => openEditModal(s)} title="Reconfigure Service">
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    className="hover:bg-danger/10 hover:text-danger hover:border-danger/50"
                                                    onClick={() => deleteService(s._id, s.title)}
                                                    title="Decommission Service"
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
                                {srvId ? "Reconfigure Service Matrix" : "Configure Service Architecture"}
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

                            <form id="service-form" onSubmit={handleSave} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-text-secondary mb-2">Service Designation (Title)</label>
                                    <Input
                                        value={title}
                                        onChange={e => setTitle(e.target.value)}
                                        placeholder="e.g. Enterprise Cloud Integration"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-text-secondary mb-2">Operational Brief (Description)</label>
                                    <textarea
                                        className="w-full bg-bg-primary border border-border rounded-lg text-text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary p-4 min-h-[100px] transition-all resize-y"
                                        value={desc}
                                        onChange={e => setDesc(e.target.value)}
                                        placeholder="Define the service scope and technical utility..."
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-text-secondary mb-2">Base Valuation ($)</label>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            value={price}
                                            onChange={e => setPrice(e.target.value)}
                                            placeholder="99.99"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-text-secondary mb-2">System Class (Category)</label>
                                        <select
                                            className="w-full bg-bg-primary border border-border rounded-lg text-text-primary focus:outline-none focus:border-primary h-12 px-4 transition-all"
                                            value={category}
                                            onChange={e => setCategory(e.target.value)}
                                            required
                                        >
                                            <option value="web">Web Architecture</option>
                                            <option value="mobile">Mobile Synthesis</option>
                                            <option value="cloud">Cloud Ecosystems</option>
                                            <option value="security">Cyber Defense</option>
                                            <option value="ai">Neural Logic (AI/ML)</option>
                                            <option value="consult">Tech Advisory</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-text-secondary mb-2">Visual Matrix (Font Awesome)</label>
                                        <Input
                                            value={icon}
                                            onChange={e => setIcon(e.target.value)}
                                            placeholder="fas fa-server"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-text-secondary mb-2">SLA (Est. Delivery)</label>
                                        <Input
                                            value={delivery}
                                            onChange={e => setDelivery(e.target.value)}
                                            placeholder="e.g. 5-7 Business Days"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-text-secondary mb-2">Functional Modules (Comma separated)</label>
                                    <Input
                                        value={features}
                                        onChange={e => setFeatures(e.target.value)}
                                        placeholder="Advanced SEO, API Integration, 24/7 Monitoring..."
                                    />
                                </div>
                            </form>
                        </div>

                        <div className="p-6 border-t border-border mt-auto shrink-0 flex justify-end gap-3 bg-bg-primary/50">
                            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                                Abort Config
                            </Button>
                            <Button type="submit" form="service-form" isLoading={isSaving} className="shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                                Commit to Database
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
