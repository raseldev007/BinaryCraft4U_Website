"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { ShoppingCart, ArrowLeft, CheckCircle, Clock } from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { formatCurrency } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { Cog } from "lucide-react";

interface Service {
    _id: string;
    title?: string;
    name?: string;
    description: string;
    extendedDescription?: string;
    price: number;
    category: string;
    icon?: string;
    image?: string;
    features: string[];
    delivery?: string;
}

function ServiceIcon({ icon, image }: { icon?: string; image?: string; className?: string }) {
    const src = icon || image || "";
    if (src.startsWith("fa-") || src.startsWith("fas ") || src.startsWith("fab ")) {
        return <i className={`${src} text-5xl text-primary drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]`} />;
    }
    if (src) return <span className="text-6xl drop-shadow-xl">{src}</span>;
    return <Cog className="w-16 h-16 text-primary drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]" />;
}

export default function ServiceDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const slug = params?.slug as string;
    const [service, setService] = useState<Service | null>(null);
    const [loading, setLoading] = useState(true);
    const { success, info } = useToast();
    const { user } = useAuth();

    useEffect(() => {
        async function fetchService() {
            try {
                const data = await api("/services");
                const found = data.services.find((s: any) => s.slug === slug);
                setService(found || null);
            } catch (err) {
                console.error("Failed to load service details", err);
            } finally {
                setLoading(false);
            }
        }
        if (slug) fetchService();
    }, [slug]);

    const addToCart = () => {
        if (!service) return;
        if (!user) {
            info("Please log in to hire us.");
            router.push('/login?redirect=/services');
            return;
        }
        const name = service.title || service.name || "Service";
        const currentCart = JSON.parse(localStorage.getItem("bc_cart_local") || "[]");
        const existingIdx = currentCart.findIndex((item: any) => item._id === service._id);
        if (existingIdx >= 0) {
            currentCart[existingIdx].qty = (currentCart[existingIdx].qty || 1) + 1;
        } else {
            currentCart.push({ ...service, qty: 1, type: "service" });
        }
        localStorage.setItem("bc_cart_local", JSON.stringify(currentCart));
        success(`"${name}" added to cart!`);
    };

    if (loading) {
        return (
            <div className="min-h-screen pt-32 pb-20 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!service) {
        return (
            <div className="min-h-screen pt-32 pb-20 flex flex-col items-center justify-center text-center px-6">
                <h1 className="text-4xl font-black text-white mb-4">Service Not Found</h1>
                <p className="text-text-muted mb-8">The professional service you are looking for is currently unavailable.</p>
                <Link href="/services">
                    <Button variant="primary">View All Services</Button>
                </Link>
            </div>
        );
    }

    const displayName = service.title || service.name || "Unnamed Service";

    return (
        <main className="min-h-screen pt-32 pb-20 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10 max-w-5xl">
                <Button
                    variant="ghost"
                    className="mb-8 text-text-muted hover:text-white"
                    onClick={() => router.back()}
                >
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back
                </Button>

                <div className="glass-panel p-8 md:p-12 rounded-3xl relative mb-12 border border-white/5">
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                        {/* Huge Icon Presentation */}
                        <div className="w-full md:w-1/3 aspect-square glass rounded-2xl flex items-center justify-center bg-gradient-to-br from-bg-secondary/80 to-bg-primary shrink-0 relative overflow-hidden group">
                            <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <ServiceIcon icon={service.icon} image={service.image} />
                        </div>

                        {/* Core Details */}
                        <div className="flex-1 space-y-6">
                            <div>
                                <span className="text-sm text-primary font-black uppercase tracking-widest mb-3 inline-block px-3 py-1 bg-primary/10 rounded-full border border-primary/20">
                                    {service.category}
                                </span>
                                <h1 className="text-4xl md:text-5xl font-black text-white leading-tight mb-4">
                                    {displayName}
                                </h1>
                                <p className="text-xl text-text-muted leading-relaxed">
                                    {service.description}
                                </p>
                            </div>

                            <div className="flex items-center gap-6 pt-4">
                                <div className="text-4xl md:text-5xl font-black text-white tracking-tight">
                                    {formatCurrency(service.price)}
                                </div>
                                {service.delivery && (
                                    <div className="flex items-center gap-2 text-text-muted bg-white/5 px-4 py-2 rounded-lg border border-white/10">
                                        <Clock className="w-4 h-4 text-primary" />
                                        <span className="text-sm font-medium">Est. {service.delivery}</span>
                                    </div>
                                )}
                            </div>

                            <div className="pt-6">
                                <Button
                                    className="w-full sm:w-auto py-6 px-10 text-lg rounded-xl shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] transition-all font-black"
                                    variant="gradient"
                                    onClick={addToCart}
                                >
                                    <ShoppingCart className="w-5 h-5 mr-3" /> Hire Us Now
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Extended Details Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* The "Why Choose Us" / Methodology (Takes up 2/3) */}
                    <div className="lg:col-span-2 space-y-8">
                        {service.extendedDescription ? (
                            <div className="glass-panel p-8 rounded-2xl bg-bg-card/40 border-none">
                                <div
                                    className="prose prose-invert max-w-none prose-headings:font-black prose-headings:text-white prose-headings:mb-4 prose-p:text-text-muted prose-p:leading-relaxed prose-li:text-text-muted prose-strong:text-white"
                                    dangerouslySetInnerHTML={{ __html: service.extendedDescription }}
                                />
                            </div>
                        ) : (
                            <div className="glass-panel p-8 rounded-2xl text-center">
                                <p className="text-text-muted">Detailed methodology coming soon.</p>
                            </div>
                        )}
                    </div>

                    {/* Features List (Takes up 1/3) */}
                    <div className="space-y-6">
                        <div className="glass-panel p-8 rounded-2xl sticky top-32 border border-primary/10">
                            <h3 className="text-xl font-black text-white mb-6 flex items-center gap-2">
                                <CheckCircle className="w-5 h-5 text-primary" /> What's Included
                            </h3>
                            <ul className="space-y-4">
                                {service.features?.map((feature, i) => (
                                    <li key={i} className="flex items-start gap-3 group">
                                        <div className="mt-1 w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center shrink-0 group-hover:bg-primary transition-colors">
                                            <CheckCircle className="w-3 h-3 text-primary group-hover:text-white transition-colors" />
                                        </div>
                                        <span className="text-text-muted group-hover:text-white transition-colors">
                                            {feature}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
