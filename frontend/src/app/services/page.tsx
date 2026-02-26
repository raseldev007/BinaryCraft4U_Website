"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ServiceGrid } from "@/components/services/ServiceGrid";
import { Cog, SlidersHorizontal } from "lucide-react";
import { useState } from "react";

const CATEGORIES = ["All", "Web", "Mobile", "Cloud", "Security", "AI", "Consult"];

export default function ServicesPage() {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />

            <main className="flex-1 pt-20">
                <section className="relative pt-24 pb-16 bg-bg-secondary/30 border-b border-border text-center overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.08),transparent_60%)]" />
                    <div className="max-w-2xl mx-auto px-6 relative z-10 animate-fadeInUp">
                        <div className="section-label mb-5 mx-auto">
                            <Cog className="w-3 h-3" />
                            Services
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black mb-4">
                            Professional <span className="gradient-text">IT Services</span>
                        </h1>
                        <p className="text-text-muted text-lg">
                            Expert development, design, and consulting tailored to your business goals.
                        </p>
                    </div>
                </section>

                <section className="py-16">
                    <div className="max-w-[1400px] mx-auto px-6">
                        <div className="flex flex-col lg:flex-row gap-8">
                            {/* Sidebar */}
                            <aside className="w-full lg:w-60 shrink-0">
                                <div className="glass-panel p-6 rounded-xl sticky top-28">
                                    <h3 className="font-bold mb-5 flex items-center gap-2 text-sm uppercase tracking-wider text-text-muted">
                                        <SlidersHorizontal className="w-4 h-4" /> Filters
                                    </h3>
                                    <div>
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
                                                        {cat === "AI" ? "AI / ML" : cat}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </aside>
                            <div className="flex-1">
                                <ServiceGrid category={selectedCategory || undefined} />
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
