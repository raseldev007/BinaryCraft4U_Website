"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { ShoppingCart, Star, Eye, ArrowLeft, CheckCircle } from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { formatCurrency } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

interface Product {
    _id: string;
    title: string;
    description: string;
    extendedDescription?: string;
    price: number;
    originalPrice?: number;
    category: string;
    image?: string;
    images?: string[];
    previewUrl?: string;
    features: string[];
    isNew?: boolean;
}

export default function ProductDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const slug = params?.slug as string;
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [imgError, setImgError] = useState(false);
    const { success, info } = useToast();
    const { user } = useAuth();

    useEffect(() => {
        async function fetchProduct() {
            try {
                // We'll fetch all products and find by slug since there isn't a dedicated endpoint yet.
                // Or better, we can modify the backend to get product by slug if needed.
                // Assuming `/products` returns products array, let's filter by slug.
                const data = await api("/products");
                const found = data.products.find((p: any) => p.slug === slug);
                setProduct(found || null);
            } catch (err) {
                console.error("Failed to load product details", err);
            } finally {
                setLoading(false);
            }
        }
        if (slug) fetchProduct();
    }, [slug]);

    const addToCart = () => {
        if (!product) return;
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

    if (loading) {
        return (
            <div className="min-h-screen pt-32 pb-20 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen pt-32 pb-20 flex flex-col items-center justify-center text-center">
                <h1 className="text-4xl font-black text-white mb-4">Product Not Found</h1>
                <p className="text-text-muted mb-8">The product you are looking for does not exist.</p>
                <Link href="/products">
                    <Button variant="primary">Browse Products</Button>
                </Link>
            </div>
        );
    }

    const imageUrl = product.image || product.images?.[0] || "";
    const saving = product.originalPrice ? product.originalPrice - product.price : 0;

    return (
        <main className="min-h-screen pt-32 pb-20 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                <Button
                    variant="ghost"
                    className="mb-8 text-text-muted hover:text-white"
                    onClick={() => router.back()}
                >
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back
                </Button>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                    {/* Image Section */}
                    <div className="glass-panel p-8 rounded-3xl relative flex items-center justify-center min-h-[400px]">
                        {product.isNew && (
                            <div className="absolute top-6 left-6 z-30 bg-gradient-to-r from-accent to-primary text-white text-xs uppercase font-black px-4 py-2 rounded-full shadow-lg">
                                NEW RELEASE
                            </div>
                        )}
                        {!imageUrl || imgError ? (
                            <div className="w-full h-full flex flex-col items-center justify-center text-text-muted opacity-50">
                                <span className="text-sm">No Image Available</span>
                            </div>
                        ) : (
                            <img
                                src={imageUrl}
                                alt={product.title}
                                className="w-full h-auto object-cover rounded-2xl shadow-2xl"
                                onError={() => setImgError(true)}
                            />
                        )}
                    </div>

                    {/* Content Section */}
                    <div className="space-y-8">
                        <div>
                            <span className="text-sm text-primary font-black uppercase tracking-widest mb-2 block">
                                {product.category}
                            </span>
                            <h1 className="text-4xl md:text-5xl font-black text-white leading-tight mb-4">
                                {product.title}
                            </h1>
                            <p className="text-lg text-text-muted leading-relaxed">
                                {product.description}
                            </p>
                        </div>

                        {/* Pricing Box */}
                        <div className="glass-panel p-6 rounded-2xl border border-primary/20 bg-bg-secondary/50">
                            <div className="flex items-end gap-3 mb-4">
                                <span className="text-4xl font-black text-white">{formatCurrency(product.price)}</span>
                                {product.originalPrice && (
                                    <>
                                        <span className="text-lg text-text-muted line-through mb-1 opacity-60">
                                            {formatCurrency(product.originalPrice)}
                                        </span>
                                        <span className="text-sm bg-danger/20 text-danger px-2 py-1 rounded font-bold mb-1">
                                            Save {formatCurrency(saving)}
                                        </span>
                                    </>
                                )}
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <Button
                                    className="flex-1 py-6 text-lg rounded-xl shadow-[0_0_20px_rgba(59,130,246,0.4)]"
                                    variant="primary"
                                    onClick={addToCart}
                                >
                                    <ShoppingCart className="w-5 h-5 mr-3" /> Add to Cart
                                </Button>
                                {product.previewUrl && (
                                    <Button
                                        className="flex-1 py-6 text-lg rounded-xl"
                                        variant="secondary"
                                        onClick={() => window.open(product.previewUrl, "_blank")}
                                    >
                                        <Eye className="w-5 h-5 mr-3" /> Live Preview
                                    </Button>
                                )}
                            </div>
                        </div>

                        {/* Extended Details */}
                        {product.extendedDescription && (
                            <div className="glass p-8 rounded-2xl mt-12 bg-bg-card/40">
                                <div
                                    className="prose prose-invert max-w-none prose-headings:font-black prose-headings:text-white prose-a:text-primary hover:prose-a:text-accent prose-strong:text-white"
                                    dangerouslySetInnerHTML={{ __html: product.extendedDescription }}
                                />
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </main>
    );
}
