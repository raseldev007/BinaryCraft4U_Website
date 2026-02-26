"use client";

import { useEffect, useState } from "react";
import { ShoppingCart, ShoppingBag, Trash2, ArrowRight, ShieldCheck, Plus, Minus, Lock, CreditCard } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useRouter } from "next/navigation";
import { formatCurrency } from "@/lib/utils";
import AuthGuard from "@/components/auth/AuthGuard";

interface CartItem {
    image: string;
    type: string;
    title: string;
    price: number;
    qty: number;
}

export default function CartPage() {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [promoCode, setPromoCode] = useState("");
    const [promoMessage, setPromoMessage] = useState<{ type: "error" | "success", text: string } | null>(null);
    const router = useRouter();

    useEffect(() => {
        // Load local cart
        const local = JSON.parse(localStorage.getItem("bc_cart_local") || "[]");
        setCartItems(local);
    }, []);

    const saveCart = (items: CartItem[]) => {
        setCartItems(items);
        localStorage.setItem("bc_cart_local", JSON.stringify(items));
        const count = items.reduce((s, i) => s + i.qty, 0);
        localStorage.setItem("bc_cart_count", count.toString());

        // Dispatch a custom event to notify the Navbar to update cart count (if navbar is mounted)
        window.dispatchEvent(new Event("storage"));
    };

    const updateQty = (index: number, change: number) => {
        const newItems = [...cartItems];
        newItems[index].qty += change;
        if (newItems[index].qty < 1) {
            newItems.splice(index, 1);
        }
        saveCart(newItems);
    };

    const removeItem = (index: number) => {
        const newItems = [...cartItems];
        newItems.splice(index, 1);
        saveCart(newItems);
    };

    const clearCart = () => {
        saveCart([]);
    };

    const applyPromo = () => {
        if (promoCode.trim().toUpperCase() === "BINARY10") {
            setPromoMessage({ type: "success", text: "Coupon applied! 10% discount 🎉" });
        } else {
            setPromoMessage({ type: "error", text: "Invalid promo code" });
        }
    };

    const handleCheckout = () => {
        if (cartItems.length === 0) return;
        router.push("/checkout");
    };

    const subtotal = cartItems.reduce((s, i) => s + i.price * i.qty, 0);
    const discount = promoMessage?.type === "success" ? subtotal * 0.1 : 0;
    const total = subtotal - discount;

    const totalItems = cartItems.reduce((sum, item) => sum + item.qty, 0);

    return (
        <AuthGuard>
            <div className="animate-fadeIn">
                <div className="mb-10">
                    <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-2 flex items-center gap-3">
                        Shopping Cart
                        <span className="text-lg font-bold text-text-muted mt-2">({totalItems} item{totalItems !== 1 ? 's' : ''})</span>
                    </h1>
                </div>

                <div className="grid lg:grid-cols-[1fr_380px] gap-8 items-start">
                    {/* Cart Items */}
                    <div className="glass-panel border border-border rounded-2xl overflow-hidden shadow-xl animate-fadeInUp">
                        <div className="p-6 border-b border-border/50 bg-bg-secondary/50 flex items-center justify-between">
                            <h3 className="text-lg font-bold flex items-center gap-2">
                                <ShoppingBag className="w-5 h-5 text-primary" /> Your Items
                            </h3>
                            {cartItems.length > 0 && (
                                <Button variant="outline" size="sm" onClick={clearCart}>Clear All</Button>
                            )}
                        </div>

                        <div className="min-h-[300px]">
                            {cartItems.length === 0 ? (
                                <div className="flex flex-col items-center justify-center p-16 text-center">
                                    <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center text-border mb-4">
                                        <ShoppingCart className="w-10 h-10" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">Your cart is empty</h3>
                                    <p className="text-text-muted mb-6">Browse our services and products to find what you need.</p>
                                    <Link href="/products">
                                        <Button className="shadow-[0_0_15px_rgba(59,130,246,0.2)]">Start Shopping</Button>
                                    </Link>
                                </div>
                            ) : (
                                <div className="divide-y divide-border">
                                    {cartItems.map((item, idx) => (
                                        <div key={idx} className="p-6 flex flex-col sm:flex-row sm:items-center gap-6 hover:bg-white/[0.02] transition-colors">
                                            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-bg-secondary to-bg-primary flex flex-col items-center justify-center text-4xl border border-border shadow-inner shrink-0">
                                                <span>{item.image}</span>
                                            </div>

                                            <div className="flex-1">
                                                <div className="text-[10px] font-bold uppercase tracking-widest text-primary mb-1">{item.type}</div>
                                                <div className="text-lg font-bold mb-2">{item.title}</div>
                                                <div className="text-xl font-black">{formatCurrency(item.price)}</div>
                                            </div>

                                            <div className="flex items-center gap-6 w-full sm:w-auto mt-4 sm:mt-0 justify-between sm:justify-end">
                                                <div className="flex items-center gap-4 bg-bg-secondary p-1.5 rounded-xl border border-border">
                                                    <button
                                                        onClick={() => updateQty(idx, -1)}
                                                        className="w-8 h-8 rounded-lg bg-bg-primary border border-border flex items-center justify-center text-text-secondary hover:text-primary hover:border-primary transition-colors"
                                                    >
                                                        <Minus className="w-3 h-3" />
                                                    </button>
                                                    <span className="font-bold w-4 text-center">{item.qty}</span>
                                                    <button
                                                        onClick={() => updateQty(idx, 1)}
                                                        className="w-8 h-8 rounded-lg bg-bg-primary border border-border flex items-center justify-center text-text-secondary hover:text-primary hover:border-primary transition-colors"
                                                    >
                                                        <Plus className="w-3 h-3" />
                                                    </button>
                                                </div>

                                                <div className="text-right flex flex-col items-end gap-2">
                                                    <div className="text-xl font-black">{formatCurrency(item.price * item.qty)}</div>
                                                    <button
                                                        onClick={() => removeItem(idx)}
                                                        className="text-text-muted hover:text-danger hover:scale-110 transition-all p-2"
                                                        title="Remove item"
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Summary Card */}
                    <div className="glass-panel border border-border rounded-2xl p-8 sticky top-6 shadow-xl animate-fadeInUp" style={{ animationDelay: "100ms" }}>
                        <h3 className="text-xl font-bold mb-6 tracking-tight">Order Summary</h3>

                        <div className="space-y-4 text-sm font-medium border-b border-border pb-6">
                            <div className="flex justify-between text-text-secondary">
                                <span>Subtotal</span>
                                <span className="text-white">{formatCurrency(subtotal)}</span>
                            </div>
                            <div className="flex justify-between text-text-secondary">
                                <span>Taxes (Included)</span>
                                <span className="text-white">{formatCurrency(0)}</span>
                            </div>
                            {discount > 0 && (
                                <div className="flex justify-between text-success">
                                    <span>Discount (10%)</span>
                                    <span>-{formatCurrency(discount)}</span>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-between items-center py-6">
                            <span className="text-lg font-bold text-text-secondary">Total</span>
                            <span className="text-3xl font-black text-primary">{formatCurrency(total)}</span>
                        </div>

                        <div className="mb-8">
                            <div className="flex gap-2 relative">
                                <Input
                                    placeholder="Promo code (e.g., BINARY10)"
                                    value={promoCode}
                                    onChange={(e) => setPromoCode(e.target.value)}
                                    className="bg-bg-primary/50"
                                />
                                <Button variant="outline" onClick={applyPromo}>Apply</Button>
                            </div>
                            {promoMessage && (
                                <div className={`mt-2 text-xs font-bold ${promoMessage.type === "success" ? "text-success" : "text-danger"}`}>
                                    {promoMessage.text}
                                </div>
                            )}
                        </div>

                        <Button
                            variant="gradient"
                            className="w-full text-base py-6 shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] transition-shadow mb-4"
                            onClick={handleCheckout}
                            disabled={cartItems.length === 0}
                        >
                            <Lock className="w-5 h-5 mr-2" /> Secure Checkout
                        </Button>

                        {/* Payment Trust Badges */}
                        <div className="flex flex-col items-center gap-3 py-4 border-t border-b border-border/50 mb-6 bg-white/[0.02] rounded-xl">
                            <span className="text-[10px] text-text-muted font-bold tracking-widest uppercase flex items-center gap-1.5">
                                <ShieldCheck className="w-3.5 h-3.5 text-success" /> Guaranteed Safe Checkout
                            </span>
                            <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1 px-2.5 py-1 bg-white border border-border rounded text-[10px] font-black text-[#e2136e]">bkash</div>
                                <div className="flex items-center gap-1 px-2.5 py-1 bg-white border border-border rounded text-[10px] font-black text-[#ED1C24] uppercase">Nagad</div>
                                <div className="flex items-center gap-1 px-2.5 py-1 bg-white border border-border rounded text-[10px] font-black text-[#0066b3]">SSLCOMMERZ</div>
                            </div>
                        </div>

                        <Link href="/products" className="block">
                            <Button variant="outline" className="w-full text-text-secondary border-transparent hover:border-border hover:bg-white/5">
                                Continue Shopping <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </AuthGuard>
    );
}
