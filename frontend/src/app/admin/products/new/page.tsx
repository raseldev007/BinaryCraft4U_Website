"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useToast } from "@/components/ui/Toast";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { UploadCloud, Image as ImageIcon, X, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewProductPage() {
    const router = useRouter();
    const { success, error } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const [files, setFiles] = useState<File[]>([]);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        extendedDescription: "",
        price: "0",
        discountPrice: "0",
        category: "Template",
        stock: "100",
        tags: "",
        isFeatured: false,
        isActive: true,
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const selectedFiles = Array.from(e.target.files);
            if (files.length + selectedFiles.length > 5) {
                error("You can only upload up to 5 images max.");
                return;
            }
            setFiles(prev => [...prev, ...selectedFiles]);
        }
    };

    const removeFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title || !formData.description || formData.price === "") {
            error("Please fill in all required fields.");
            return;
        }

        setIsLoading(true);
        try {
            const data = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                if (key === 'tags') {
                    // Split comma-separated tags
                    const tagArray = (value as string).split(',').map(tag => tag.trim()).filter(Boolean);
                    tagArray.forEach(t => data.append('tags[]', t)); // Backend expects array or we could serialize differently, but normally express multer/body-parser parses arrays well. Or send as string and backend parses. Actually, standard express handles duplicate keys as arrays.
                } else {
                    data.append(key, value.toString());
                }
            });

            // Append raw tag string for fallback if backend doesn't handle array correctly
            data.set('tags', formData.tags);

            files.forEach(file => {
                data.append("images", file);
            });

            await api("/products", "POST", data);
            
            success("Product successfully created!");
            router.push("/admin/products");
            router.refresh();
        } catch (err: any) {
            console.error(err);
            error(err.message || "Failed to create product");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto pb-10 animate-fadeIn bg-bg-primary min-h-screen pt-4">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/admin">
                    <Button variant="outline" size="sm" className="h-10 w-10 p-0 border-white/10 rounded-full hover:bg-white/5">
                        <ArrowLeft className="w-5 h-5 text-text-muted" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tight">Create New Product</h1>
                    <p className="text-text-muted text-sm mt-1">Configure advanced product details, pricing logic, and upload secure assets.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* General Information */}
                <div className="glass border border-border rounded-2xl p-6 md:p-8 relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-accent" />
                    <h2 className="text-xl font-bold text-white mb-6">General Metadata</h2>
                    
                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                        <Input
                            floatingLabel="Product Title"
                            value={formData.title}
                            onChange={(e) => setFormData(p => ({ ...p, title: e.target.value }))}
                            required
                        />
                        <div className="relative">
                            <label className="text-xs font-bold uppercase tracking-wider text-text-muted mb-2 block">Category</label>
                            <select
                                className="w-full bg-white/5 border border-border text-white text-sm rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all px-4 py-3.5 appearance-none"
                                value={formData.category}
                                onChange={(e) => setFormData(p => ({ ...p, category: e.target.value }))}
                            >
                                <option value="Template" className="bg-bg-card">Website Template</option>
                                <option value="Component" className="bg-bg-card">React Component</option>
                                <option value="Tool" className="bg-bg-card">Developer Tool</option>
                                <option value="Design" className="bg-bg-card">UI/UX Design Asset</option>
                                <option value="Course" className="bg-bg-card">Premium Course</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <Input
                                floatingLabel="Short Summary (Subtitle)"
                                value={formData.description}
                                onChange={(e) => setFormData(p => ({ ...p, description: e.target.value }))}
                                required
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold uppercase tracking-wider text-text-muted mb-2 block">Extended Description (Rich text content)</label>
                            <textarea
                                className="w-full bg-white/5 border border-border text-white text-sm rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all px-4 py-3.5 min-h-[120px] custom-scrollbar"
                                placeholder="Describe the profound impact and advanced features of your digital product..."
                                value={formData.extendedDescription}
                                onChange={(e) => setFormData(p => ({ ...p, extendedDescription: e.target.value }))}
                            />
                        </div>
                    </div>
                </div>

                {/* Economics & Supply */}
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="glass border border-border rounded-2xl p-6 md:p-8">
                        <h2 className="text-xl font-bold text-white mb-6">Economy Analytics</h2>
                        <div className="space-y-6">
                            <Input
                                type="number"
                                floatingLabel="Retail Price ($)"
                                value={formData.price}
                                onChange={(e) => setFormData(p => ({ ...p, price: e.target.value }))}
                                required
                                min="0" step="0.01"
                            />
                            <Input
                                type="number"
                                floatingLabel="Discount Price ($)"
                                value={formData.discountPrice}
                                onChange={(e) => setFormData(p => ({ ...p, discountPrice: e.target.value }))}
                                min="0" step="0.01"
                            />
                            <div className="pt-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-text-muted mb-3 flex items-center justify-between">
                                    Product Visibility
                                    <span className="text-[10px] text-primary bg-primary/10 px-2 py-0.5 rounded-full">Frontend</span>
                                </label>
                                <div className="flex gap-4">
                                    <label className="flex items-center gap-2 text-sm text-text-secondary cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={formData.isFeatured}
                                            onChange={(e) => setFormData(p => ({ ...p, isFeatured: e.target.checked }))}
                                            className="w-4 h-4 rounded border-border bg-white/5 text-primary focus:ring-primary"
                                        />
                                        Feature on Homepage
                                    </label>
                                    <label className="flex items-center gap-2 text-sm text-text-secondary cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={formData.isActive}
                                            onChange={(e) => setFormData(p => ({ ...p, isActive: e.target.checked }))}
                                            className="w-4 h-4 rounded border-border bg-white/5 text-success focus:ring-success"
                                        />
                                        Active & Discoverable
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="glass border border-border rounded-2xl p-6 md:p-8">
                        <h2 className="text-xl font-bold text-white mb-6">Logistics & SEO</h2>
                        <div className="space-y-6">
                            <Input
                                type="number"
                                floatingLabel="Stock Availability"
                                value={formData.stock}
                                onChange={(e) => setFormData(p => ({ ...p, stock: e.target.value }))}
                                min="0"
                            />
                            <Input
                                floatingLabel="Search Tags (comma separated)"
                                value={formData.tags}
                                onChange={(e) => setFormData(p => ({ ...p, tags: e.target.value }))}
                            />
                        </div>
                    </div>
                </div>

                {/* Secure File Upload */}
                <div className="glass border border-border rounded-2xl p-6 md:p-8">
                    <h2 className="text-xl font-bold text-white mb-2">Media Assets</h2>
                    <p className="text-sm text-text-muted mb-6">Upload high-resolution images (max 5 files). Format: JPG, PNG, WEBP.</p>

                    <div className="border-2 border-dashed border-border rounded-2xl p-8 hover:bg-white/[0.02] hover:border-primary/50 transition-colors relative text-center group cursor-pointer">
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            onChange={handleFileChange}
                        />
                        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mx-auto mb-4 group-hover:scale-110 transition-transform">
                            <UploadCloud className="w-8 h-8" />
                        </div>
                        <p className="font-bold text-white mb-1">Click or drag images here to upload</p>
                        <p className="text-xs text-text-muted">Maximum file size: 5MB per image</p>
                    </div>

                    {files.length > 0 && (
                        <div className="mt-6 flex flex-wrap gap-4">
                            {files.map((file, i) => (
                                <div key={i} className="relative w-24 h-24 rounded-xl border border-border overflow-hidden bg-bg-card group">
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                        <button
                                            type="button"
                                            onClick={() => removeFile(i)}
                                            className="p-1.5 bg-danger text-white rounded-lg hover:bg-red-600 transition-colors shadow-lg"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <img src={URL.createObjectURL(file)} alt="preview" className="w-full h-full object-cover" />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Final Verification */}
                <div className="flex items-center justify-end gap-4 pt-4">
                    <Link href="/admin">
                        <Button variant="outline" type="button" disabled={isLoading} className="border-white/10">Discard Draft</Button>
                    </Link>
                    <Button type="submit" variant="gradient" disabled={isLoading} className="min-w-[200px] shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)]">
                        {isLoading ? (
                            <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Synchronizing...</>
                        ) : (
                            "Finalize & Publish Product"
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
}
