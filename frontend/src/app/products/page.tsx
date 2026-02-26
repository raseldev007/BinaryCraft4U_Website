"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ProductGrid } from "@/components/products/ProductGrid";
import { Package, SlidersHorizontal } from "lucide-react";
import { useState } from "react";

const CATEGORIES = ["All", "Templates", "Plugins", "UI Kits", "Hosting", "Themes"];
const PRICE_RANGES = [
    { label: "Any Price", value: null },
    { label: "Under ৳2,000", value: 2000 },
    { label: "৳2,000 – ৳5,000", value: 5000 },
    { label: "৳5,000 – ৳15,000", value: 15000 },
    { label: "Over ৳15,000", value: Infinity },
];

export default function ProductsPage() {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [maxPrice, setMaxPrice] = useState<number | null>(null);

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />

            <main className="flex-1 pt-20">
                <section className="relative pt-24 pb-16 bg-bg-secondary/30 border-b border-border text-center overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.08),transparent_60%)]" />
                    <div className="max-w-2xl mx-auto px-6 relative z-10 animate-fadeInUp">
                        <div className="section-label mb-5 mx-auto">
                            <Package className="w-3 h-3" />
                            Marketplace
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black mb-4">
                            Premium Digital <span className="gradient-text">Products</span>
                        </h1>
                        <p className="text-text-muted text-lg">
                            High-quality templates, plugins, and digital tools to accelerate your workflow.
                        </p>
                    </div>
                </section>

                <section className="py-16">
                    <div className="max-w-[1400px] mx-auto px-6">
                        <div className="flex flex-col lg:flex-row gap-8">
                            {/* Sidebar Filter */}
                            <aside className="w-full lg:w-60 shrink-0">
                                <div className="glass-panel p-6 rounded-xl sticky top-28">
                                    <h3 className="font-bold mb-5 flex items-center gap-2 text-sm uppercase tracking-wider text-text-muted">
                                        <SlidersHorizontal className="w-4 h-4" /> Filters
                                    </h3>
                                    <div className="mb-6">
                                        <div className="text-xs font-bold uppercase tracking-wider text-text-muted mb-3">Category</div>
                                        <div className="space-y-2">
                                            {CATEGORIES.map((cat) => {
                                                const isActive = cat === "All" ? !selectedCategory : selectedCategory === cat.toLowerCase();
                                                return (
                                                    <button
                                                        key={cat}
                                                        onClick={() => setSelectedCategory(cat === "All" ? null : cat.toLowerCase())}
                                                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${isActive ? "bg-primary/15 text-primary border border-primary/30 font-semibold" : "text-text-muted hover:text-white hover:bg-white/5"}`}
                                                    >
                                                        {cat}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                    <hr className="border-border my-5" />
                                    <div>
                                        <div className="text-xs font-bold uppercase tracking-wider text-text-muted mb-3">Price Range</div>
                                        <div className="space-y-2">
                                            {PRICE_RANGES.map((range) => (
                                                <button
                                                    key={range.label}
                                                    onClick={() => setMaxPrice(range.value)}
                                                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${maxPrice === range.value ? "bg-primary/15 text-primary border border-primary/30 font-semibold" : "text-text-muted hover:text-white hover:bg-white/5"}`}
                                                >
                                                    {range.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </aside>
                            <div className="flex-1">
                                <ProductGrid
                                    category={selectedCategory || undefined}
                                    maxPrice={maxPrice && isFinite(maxPrice) ? maxPrice : undefined}
                                />
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
