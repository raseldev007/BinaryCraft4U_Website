"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { ShoppingCart, Star, Package, Heart, Eye, X } from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

interface Product {
    _id: string;
    title: string;
    description: string;
    price: number;
    originalPrice?: number;
    category: string;
    slug?: string;
    image?: string;
    images?: string[];
    previewUrl?: string;
    features: string[];
    isNew?: boolean;
}

interface ProductGridProps {
    category?: string;
    maxPrice?: number;
    limit?: number;
}

function ProductSkeleton() {
    return (
        <div className="glass rounded-xl p-0 overflow-hidden flex flex-col">
            <div className="h-48 bg-white/5 animate-shimmer" />
            <div className="p-5 space-y-3">
                <div className="h-3 bg-white/5 rounded animate-shimmer w-1/3" />
                <div className="h-5 bg-white/5 rounded animate-shimmer w-3/4" />
                <div className="h-3 bg-white/5 rounded animate-shimmer w-full" />
                <div className="h-3 bg-white/5 rounded animate-shimmer w-2/3" />
                <div className="flex justify-between items-center pt-2">
                    <div className="h-6 bg-white/5 rounded animate-shimmer w-20" />
                    <div className="h-10 w-10 bg-white/5 rounded-full animate-shimmer" />
                </div>
            </div>
        </div>
    );
}

function ProductImage({ image, title }: { image: string; title: string }) {
    const [imgError, setImgError] = useState(false);

    if (!image || imgError) {
        return (
            <div className="w-full h-48 bg-gradient-to-br from-primary/5 to-accent/5 flex flex-col items-center justify-center text-text-muted gap-2">
                <Package className="w-10 h-10 opacity-30" />
                <span className="text-xs opacity-50">{title}</span>
            </div>
        );
    }

    if (image.startsWith("fa-") || image.startsWith("fas ") || image.startsWith("fab ")) {
        return (
            <div className="w-full h-48 bg-gradient-to-br from-primary/5 to-accent/5 flex items-center justify-center">
                <i className={`${image} text-5xl text-primary opacity-80`} />
            </div>
        );
    }

    const isEmoji = /\p{Emoji}/u.test(image) && image.length <= 4;
    if (isEmoji) {
        return (
            <div className="w-full h-48 bg-gradient-to-br from-primary/5 to-accent/5 flex items-center justify-center text-6xl">
                {image}
            </div>
        );
    }

    return (
        <img
            src={image}
            alt={title}
            className="w-full h-48 object-cover"
            onError={() => setImgError(true)}
        />
    );
}

export function ProductGrid({ category, maxPrice, limit }: ProductGridProps) {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [wishlist, setWishlist] = useState<string[]>([]);
    const [previewProduct, setPreviewProduct] = useState<Product | null>(null);
    const { success, info } = useToast();
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        const localWishlist = JSON.parse(localStorage.getItem("bc_wishlist") || "[]");
        setWishlist(localWishlist);
        async function loadProducts() {
            try {
                const data = await api("/products");
                setProducts(data.products || []);
            } catch (err) {
                console.error("Failed to load products", err);
            } finally {
                setLoading(false);
            }
        }
        loadProducts();
    }, []);

    const addToCart = (product: Product) => {
        if (!user) {
            info("Please log in to add items to your cart.");
            router.push('/login?redirect=/products');
            return;
        }
        const currentCart = JSON.parse(localStorage.getItem("bc_cart_local") || "[]");
        const existingIdx = currentCart.findIndex((item: any) => item._id === product._id);
        if (existingIdx >= 0) {
            currentCart[existingIdx].qty = (currentCart[existingIdx].qty || 1) + 1;
        } else {
            currentCart.push({ ...product, qty: 1 });
        }
        localStorage.setItem("bc_cart_local", JSON.stringify(currentCart));
        success(`"${product.title}" added to cart!`);
    };

    const toggleWishlist = (id: string, name: string) => {
        if (!user) {
            info("Please log in to add items to your wishlist.");
            router.push('/login?redirect=/products');
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array(6).fill(0).map((_, i) => <ProductSkeleton key={i} />)}
            </div>
        );
    }

    let filtered = [...products];
    if (category) filtered = filtered.filter((p) => p.category === category);
    if (maxPrice) filtered = filtered.filter((p) => p.price <= maxPrice);
    if (limit) filtered = filtered.slice(0, limit);

    if (filtered.length === 0) {
        return (
            <div className="glass-panel rounded-xl p-16 text-center">
                <Package className="w-12 h-12 text-text-muted mx-auto mb-4 opacity-40" />
                <p className="text-text-muted font-medium">No products found.</p>
                <p className="text-text-muted text-sm mt-1 opacity-60">Try adjusting your filters.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((product, i) => {
                const saving = product.originalPrice ? product.originalPrice - product.price : 0;
                const isWished = wishlist.includes(product._id);

                return (
                    <div
                        key={product._id}
                        className="glass rounded-2xl flex flex-col relative group overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:border-primary/40 hover:shadow-[0_20px_60px_rgba(59,130,246,0.15)] animate-fadeInUp"
                        style={{ animationDelay: `${i * 100}ms` }}
                    >
                        {/* Floating Orb Accent inside Card */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0" />

                        {/* Quick Action overlay */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-95 group-hover:scale-100 pointer-events-none group-hover:pointer-events-auto flex items-center gap-2">
                            <Link href={`/products/${product.slug || product._id}`}>
                                <Button variant="secondary" size="sm" className="rounded-full shadow-xl shadow-black/50 backdrop-blur-md bg-bg-card/90">
                                    <Eye className="w-4 h-4 mr-2" /> Details
                                </Button>
                            </Link>
                            {product.previewUrl && (
                                <Button
                                    variant="primary"
                                    size="sm"
                                    className="rounded-full shadow-xl shadow-black/50 backdrop-blur-md"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        window.open(product.previewUrl, "_blank");
                                    }}>
                                    Live Preview
                                </Button>
                            )}
                        </div>

                        {/* Image */}
                        <div className="overflow-hidden relative z-10">
                            {/* Overlay to darken image on hover so Quick View pops */}
                            <div className="absolute inset-0 bg-bg-primary/50 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 z-10" />

                            <div className="absolute top-3 left-3 z-30 flex flex-col gap-2">
                                {product.originalPrice && (
                                    <div className="bg-danger/90 backdrop-blur-md text-white border border-danger/50 text-[10px] uppercase font-black px-3 py-1 rounded-full shadow-[0_0_10px_rgba(239,68,68,0.4)] animate-pulseGlow w-fit">
                                        Save {formatCurrency(saving)}
                                    </div>
                                )}
                                {product.isNew && (
                                    <div className="bg-gradient-to-r from-accent to-primary text-white text-[10px] uppercase font-black px-3 py-1 rounded-full shadow-lg w-fit">
                                        NEW
                                    </div>
                                )}
                            </div>

                            {/* Wishlist toggle */}
                            <button
                                onClick={(e) => { e.preventDefault(); toggleWishlist(product._id, product.title) }}
                                className="absolute top-3 right-3 z-30 w-8 h-8 rounded-full glass flex items-center justify-center hover:bg-white/10 transition-colors shadow-lg"
                            >
                                <Heart className={`w-4 h-4 transition-colors ${isWished ? 'fill-danger text-danger' : 'text-text-secondary'}`} />
                            </button>

                            <ProductImage image={product.image || product.images?.[0] || ""} title={product.title} />
                        </div>

                        {/* Content */}
                        <div className="p-6 flex flex-col flex-1 relative z-10 bg-gradient-to-t from-bg-card/50 to-transparent">
                            <span className="text-[10px] text-primary font-black uppercase tracking-widest mb-1.5 opacity-80">
                                {product.category}
                            </span>
                            <h3 className="font-black text-white text-lg leading-tight mb-2 group-hover:text-primary transition-colors">
                                {product.title}
                            </h3>
                            <p className="text-sm text-text-muted mb-5 flex-grow leading-relaxed line-clamp-2">
                                {product.description}
                            </p>

                            <div className="flex items-center justify-between pt-4 border-t border-border/50">
                                <div>
                                    <div className="flex items-end gap-2">
                                        <span className="text-2xl font-black text-white tracking-tight">{formatCurrency(product.price)}</span>
                                        {product.originalPrice && (
                                            <span className="text-xs text-text-muted line-through mb-1 opacity-60">
                                                {formatCurrency(product.originalPrice)}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <Button
                                    size="sm"
                                    variant="gradient"
                                    onClick={() => addToCart(product)}
                                    className="rounded-xl shadow-[0_0_15px_rgba(59,130,246,0.3)] hover:shadow-[0_0_25px_rgba(59,130,246,0.5)] transition-all"
                                >
                                    <ShoppingCart className="w-4 h-4 mr-2" /> Add
                                </Button>
                            </div>
                        </div>
                    </div>
                )
            })}

            {/* Quick Preview Modal */}
            {
                previewProduct && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 mb:p-8 animate-fadeIn">
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setPreviewProduct(null)} />
                        <div className="relative glass-panel bg-bg-primary border border-border rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl animate-fadeInUp flex flex-col md:flex-row">
                            <button
                                onClick={() => setPreviewProduct(null)}
                                className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full glass flex items-center justify-center hover:bg-white/10 transition-colors text-text-muted hover:text-white"
                            >
                                <X className="w-4 h-4" />
                            </button>

                            {/* Image Side */}
                            <div className="md:w-1/2 relative min-h-[300px] md:min-h-[500px] bg-bg-secondary p-8 flex items-center justify-center">
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 opacity-50" />
                                <img
                                    src={previewProduct.image || previewProduct.images?.[0] || ""}
                                    alt={previewProduct.title}
                                    className="w-full h-full object-cover absolute inset-0 mix-blend-overlay opacity-30 blur-xl"
                                />
                                <img
                                    src={previewProduct.image || previewProduct.images?.[0] || ""}
                                    alt={previewProduct.title}
                                    className="relative z-10 w-full max-h-full object-contain rounded-xl shadow-2xl drop-shadow-[0_0_30px_rgba(59,130,246,0.2)]"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = `https://placehold.co/800x600/1E293B/3B82F6?text=${encodeURIComponent(previewProduct.title)}`;
                                    }}
                                />
                            </div>

                            {/* Content Side */}
                            <div className="md:w-1/2 p-8 md:p-10 flex flex-col relative z-20">
                                <div className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-primary/10 text-primary border border-primary/20 mb-4 w-fit">
                                    {previewProduct.category}
                                </div>
                                <h2 className="text-3xl md:text-4xl font-black text-white leading-tight mb-4 tracking-tight">
                                    {previewProduct.title}
                                </h2>
                                <p className="text-text-secondary text-base leading-relaxed mb-6 flex-grow">
                                    {previewProduct.description}
                                </p>

                                <div className="mb-8">
                                    <h4 className="text-sm font-bold uppercase tracking-widest text-text-muted mb-4 flex items-center gap-2">
                                        <Star className="w-4 h-4 text-accent" /> Key Features
                                    </h4>
                                    <ul className="space-y-3">
                                        {previewProduct.features.slice(0, 4).map((f, i) => (
                                            <li key={i} className="flex items-start text-sm text-text-secondary font-medium">
                                                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 mr-3 shrink-0" />
                                                {f}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="flex flex-col gap-4 mt-auto pt-6 border-t border-border/50">
                                    <div className="flex items-end gap-3">
                                        <span className="text-4xl font-black text-white tracking-tight">{formatCurrency(previewProduct.price)}</span>
                                        {previewProduct.originalPrice && (
                                            <span className="text-lg text-text-muted line-through mb-1.5 opacity-60">
                                                {formatCurrency(previewProduct.originalPrice)}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Button
                                            size="lg"
                                            variant="gradient"
                                            className="flex-1 shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)]"
                                            onClick={() => {
                                                addToCart(previewProduct);
                                                setPreviewProduct(null);
                                            }}
                                        >
                                            <ShoppingCart className="w-5 h-5 mr-2" /> Add to Cart
                                        </Button>
                                        <button
                                            onClick={(e) => { e.preventDefault(); toggleWishlist(previewProduct._id, previewProduct.title) }}
                                            className="w-12 h-12 rounded-xl glass border border-border flex items-center justify-center hover:bg-white/5 hover:border-text-muted transition-all"
                                        >
                                            <Heart className={`w-5 h-5 transition-colors ${wishlist.includes(previewProduct._id) ? 'fill-danger text-danger' : 'text-text-secondary'}`} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
}
