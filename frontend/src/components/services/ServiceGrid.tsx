"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { ShoppingCart, Star, Package, Heart, Eye, X, Cog, CheckCircle, Clock } from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { formatCurrency } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Service {
    _id: string;
    title?: string;
    name?: string;
    slug?: string;
    description: string;
    price: number;
    category: string;
    icon?: string;
    image?: string;
    features: string[];
    delivery?: string;
    deliveryTime?: string;
}

interface ServiceGridProps {
    category?: string;
    limit?: number;
}

function ServiceSkeleton() {
    return (
        <div className="glass rounded-xl p-6 flex flex-col md:flex-row gap-6">
            <div className="w-16 h-16 rounded-2xl bg-white/5 animate-shimmer shrink-0" />
            <div className="flex-1 space-y-3">
                <div className="flex gap-3 items-center">
                    <div className="h-5 w-48 bg-white/5 rounded animate-shimmer" />
                    <div className="h-5 w-20 bg-white/5 rounded-full animate-shimmer" />
                </div>
                <div className="h-3 w-full bg-white/5 rounded animate-shimmer" />
                <div className="h-3 w-4/5 bg-white/5 rounded animate-shimmer" />
                <div className="flex gap-4 pt-2">
                    <div className="h-3 w-28 bg-white/5 rounded animate-shimmer" />
                    <div className="h-3 w-28 bg-white/5 rounded animate-shimmer" />
                </div>
                <div className="flex items-center justify-between pt-3">
                    <div className="h-7 w-24 bg-white/5 rounded animate-shimmer" />
                    <div className="h-9 w-32 bg-white/5 rounded-lg animate-shimmer" />
                </div>
            </div>
        </div>
    );
}

function ServiceIcon({ icon, image }: { icon?: string; image?: string }) {
    const src = icon || image || "";
    if (src.startsWith("fa-") || src.startsWith("fas ") || src.startsWith("fab ")) {
        return <i className={`${src} text-2xl`} />;
    }
    if (src) return <span className="text-3xl">{src}</span>;
    return <Cog className="w-7 h-7" />;
}

export function ServiceGrid({ category, limit }: ServiceGridProps) {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [wishlist, setWishlist] = useState<string[]>([]);
    const [previewService, setPreviewService] = useState<Service | null>(null);
    const { success, info } = useToast();
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        const localWishlist = JSON.parse(localStorage.getItem("bc_wishlist") || "[]");
        setWishlist(localWishlist);
        async function loadServices() {
            try {
                const data = await api("/services");
                setServices(data.services || []);
            } catch (err) {
                console.error("Failed to load services", err);
            } finally {
                setLoading(false);
            }
        }
        loadServices();
    }, []);

    const addToCart = (service: Service) => {
        if (!user) {
            info("Please log in to add items to your cart.");
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

    const toggleWishlist = (id: string, name: string) => {
        if (!user) {
            info("Please log in to add items to your wishlist.");
            router.push('/login?redirect=/services');
            return;
        }
        const newWish = wishlist.includes(id)
            ? wishlist.filter(w => w !== id)
            : [...wishlist, id];
        setWishlist(newWish);
        localStorage.setItem("bc_wishlist", JSON.stringify(newWish));
        if (!wishlist.includes(id)) {
            success(`"${name}" added to wishlist ❤️`);
        } else {
            info(`"${name}" removed from wishlist`);
        }
    };

    if (loading) {
        return (
            <div className="grid grid-cols-1 gap-5">
                {Array(4).fill(0).map((_, i) => <ServiceSkeleton key={i} />)}
            </div>
        );
    }

    let filtered = [...services];
    if (category) filtered = filtered.filter((s) => s.category === category);
    if (limit) filtered = filtered.slice(0, limit);

    if (filtered.length === 0) {
        return (
            <div className="glass-panel rounded-xl p-16 text-center">
                <Cog className="w-12 h-12 text-text-muted mx-auto mb-4 opacity-30" />
                <p className="text-text-muted font-medium">No services found.</p>
                <p className="text-text-muted text-sm mt-1 opacity-60">Try adjusting your filters.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-6">
            {filtered.map((service, i) => {
                const displayName = service.title || service.name || "Unnamed Service";
                const delivery = service.delivery || service.deliveryTime;
                const isWished = wishlist.includes(service._id);

                return (
                    <div
                        key={service._id}
                        className="glass rounded-2xl p-6 md:p-8 flex flex-col md:flex-row gap-8 group relative overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:border-primary/40 hover:shadow-[0_20px_60px_rgba(59,130,246,0.15)] animate-fadeInUp"
                        style={{ animationDelay: `${i * 100}ms` }}
                    >
                        {/* Background glow orb */}
                        <div className="absolute top-1/2 -translate-y-1/2 left-0 w-48 h-48 bg-primary/10 rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                        {/* Left accent bar on hover */}
                        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-primary to-accent scale-y-0 group-hover:scale-y-100 transition-transform origin-top duration-500 rounded-l-2xl z-20" />

                        {/* Wishlist toggle */}
                        <button
                            onClick={(e) => { e.preventDefault(); toggleWishlist(service._id, displayName) }}
                            className="absolute top-4 right-4 z-30 w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-white/10 transition-colors shadow-lg"
                        >
                            <Heart className={`w-5 h-5 transition-colors ${isWished ? 'fill-danger text-danger' : 'text-text-secondary group-hover:text-white'}`} />
                        </button>

                        {/* Icon */}
                        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-bg-secondary to-bg-primary border border-white/5 flex-shrink-0 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white group-hover:shadow-[0_0_30px_rgba(59,130,246,0.4)] transition-all duration-500 z-10">
                            <ServiceIcon icon={service.icon} image={service.image} />
                        </div>

                        {/* Body */}
                        <div className="flex-1 flex flex-col z-10 mt-2 md:mt-0">
                            <div className="flex flex-wrap items-center gap-3 mb-3 pr-12">
                                <h3 className="text-xl md:text-2xl font-black text-white group-hover:text-primary transition-colors tracking-tight">
                                    {displayName}
                                </h3>
                                {service.category && (
                                    <span className="text-[10px] text-white font-black uppercase tracking-widest px-3 py-1.5 rounded-full bg-primary/20 border border-primary/30">
                                        {service.category}
                                    </span>
                                )}
                            </div>

                            <p className="text-[15px] text-text-muted leading-relaxed mb-6 max-w-2xl">
                                {service.description}
                            </p>

                            {service.features && service.features.length > 0 && (
                                <ul className="mb-8 grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6">
                                    {service.features.slice(0, 4).map((feature, j) => (
                                        <li key={j} className="text-sm text-text-secondary flex items-start gap-2.5">
                                            <CheckCircle className="w-4 h-4 text-success shrink-0 mt-0.5" />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}

                            <div className="mt-auto flex flex-col sm:flex-row items-center justify-between gap-6 pt-6 border-t border-border/50">
                                <div>
                                    <div className="text-3xl font-black text-white tracking-tight">{formatCurrency(service.price)}</div>
                                    {delivery && (
                                        <div className="text-sm text-text-muted mt-1.5 flex items-center gap-1.5 font-medium">
                                            <Clock className="w-4 h-4 text-primary" /> Estimated delivery: {delivery}
                                        </div>
                                    )}
                                </div>
                                <div className="flex gap-4 w-full sm:w-auto">
                                    <Link href={`/services/${service.slug || service._id}`} className="flex-1 sm:flex-none">
                                        <Button variant="secondary" size="lg" className="w-full">
                                            Details
                                        </Button>
                                    </Link>
                                    <Button
                                        variant="gradient"
                                        size="lg"
                                        className="flex-1 sm:flex-none shadow-[0_0_20px_rgba(59,130,246,0.2)] hover:shadow-[0_0_30px_rgba(59,130,246,0.4)]"
                                        onClick={() => addToCart(service)}
                                    >
                                        <ShoppingCart className="w-5 h-5 mr-2" /> Add to Cart
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}

            {/* Quick Preview Modal */}
            {previewService && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 mb:p-8 animate-fadeIn">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setPreviewService(null)} />
                    <div className="relative glass-panel bg-bg-primary border border-border rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl animate-fadeInUp flex flex-col md:flex-row">
                        <button
                            onClick={() => setPreviewService(null)}
                            className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full glass flex items-center justify-center hover:bg-white/10 transition-colors text-text-muted hover:text-white"
                        >
                            <X className="w-4 h-4" />
                        </button>

                        {/* Icon Side */}
                        <div className="md:w-1/2 relative min-h-[300px] bg-bg-secondary p-8 flex items-center justify-center">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 opacity-50" />
                            <div className="relative z-10 w-48 h-48 rounded-3xl bg-gradient-to-br from-bg-secondary to-bg-primary border border-white/5 flex items-center justify-center text-primary shadow-2xl drop-shadow-[0_0_30px_rgba(59,130,246,0.2)]">
                                <ServiceIcon icon={previewService.icon} image={previewService.image} />
                            </div>
                        </div>

                        {/* Content Side */}
                        <div className="md:w-1/2 p-8 md:p-10 flex flex-col relative z-20">
                            <div className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-primary/10 text-primary border border-primary/20 mb-4 w-fit">
                                {previewService.category || 'Service'}
                            </div>
                            <h2 className="text-3xl md:text-4xl font-black text-white leading-tight mb-4 tracking-tight">
                                {previewService.title || previewService.name}
                            </h2>
                            <p className="text-text-secondary text-base leading-relaxed mb-6 flex-grow">
                                {previewService.description}
                            </p>

                            <div className="mb-8">
                                <h4 className="text-sm font-bold uppercase tracking-widest text-text-muted mb-4 flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4 text-success" /> Features included
                                </h4>
                                <ul className="space-y-3">
                                    {previewService.features?.map((f, i) => (
                                        <li key={i} className="flex items-start text-sm text-text-secondary font-medium">
                                            <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 mr-3 shrink-0" />
                                            {f}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="flex flex-col gap-4 mt-auto pt-6 border-t border-border/50">
                                <div className="flex flex-col">
                                    <span className="text-4xl font-black text-white tracking-tight mb-1">{formatCurrency(previewService.price)}</span>
                                    {(previewService.deliveryTime || previewService.delivery) && (
                                        <div className="text-sm text-text-muted flex items-center gap-1.5 font-medium">
                                            <Clock className="w-4 h-4 text-primary" /> Delivery: {previewService.deliveryTime || previewService.delivery}
                                        </div>
                                    )}
                                </div>
                                <div className="flex items-center gap-3 mt-2">
                                    <Button
                                        size="lg"
                                        variant="gradient"
                                        className="flex-1 shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)]"
                                        onClick={() => {
                                            addToCart(previewService);
                                            setPreviewService(null);
                                        }}
                                    >
                                        <ShoppingCart className="w-5 h-5 mr-2" /> Add to Cart
                                    </Button>
                                    <button
                                        onClick={(e) => { e.preventDefault(); toggleWishlist(previewService._id, previewService.title || previewService.name || 'Service') }}
                                        className="w-12 h-12 rounded-xl glass border border-border flex items-center justify-center hover:bg-white/5 hover:border-text-muted transition-all"
                                    >
                                        <Heart className={`w-5 h-5 transition-colors ${wishlist.includes(previewService._id) ? 'fill-danger text-danger' : 'text-text-secondary'}`} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
