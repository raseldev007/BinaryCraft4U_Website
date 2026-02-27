"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Lock, ShieldCheck, MapPin, CreditCard, Banknote, Building2, CheckCircle2 } from "lucide-react";
import AuthGuard from "@/components/auth/AuthGuard";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";

interface CartItem {
    _id: string;
    image: string;
    type: string;
    title: string;
    price: number;
    qty: number;
}

export default function CheckoutPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [shipping, setShipping] = useState({ street: "", city: "", country: "BD", notes: "" });
    const [paymentMethod, setPaymentMethod] = useState("cod");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Load local cart
        const local = JSON.parse(localStorage.getItem("bc_cart_local") || "[]");
        if (local.length === 0) {
            router.push("/cart");
        } else {
            setCartItems(local);
        }
    }, [router]);

    const total = cartItems.reduce((s, i) => s + i.price * i.qty, 0);

    const placeOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            await api("/orders", "POST", {
                items: cartItems.map(item => ({
                    itemId: item._id,
                    itemType: item.type || 'product',
                    title: item.title,
                    price: item.price,
                    quantity: item.qty,
                    image: item.image
                })),
                shippingAddress: {
                    street: shipping.street,
                    city: shipping.city,
                    country: shipping.country
                },
                notes: shipping.notes,
                paymentMethod
            });

            // Clear cart
            localStorage.removeItem("bc_cart_local");
            localStorage.removeItem("bc_cart_count");
            window.dispatchEvent(new Event("storage")); // Trigger any navbar updates

            // Redirect to dashboard
            router.push("/dashboard");
        } catch (err: any) {
            setError(err.message || "Failed to place order");
            setIsLoading(false);
        }
    };

    return (
        <AuthGuard>
            <div className="min-h-screen bg-bg-primary font-primary flex flex-col">
                {/* Minimal Navbar */}
                <nav className="border-b border-border/50 bg-bg-primary/80 backdrop-blur-md sticky top-0 z-50">
                    <div className="max-w-[1200px] mx-auto px-6 h-20 flex items-center justify-between">
                        <Link href="/" className="flex items-center gap-3">
                            <img src="/logo.png" alt="Binary Craft Logo" className="w-12 h-12 object-contain drop-shadow-[0_0_15px_rgba(59,130,246,0.3)]" />
                            <div className="font-black text-xl tracking-tight hidden sm:block">Binary Craft</div>
                        </Link>
                        <div className="flex items-center gap-2 text-sm font-bold text-text-muted">
                            <Lock className="w-4 h-4 text-primary" /> Secure Checkout
                        </div>
                    </div>
                </nav>

                <main className="flex-1 py-12 md:py-20 animate-fadeIn">
                    <div className="max-w-[1200px] mx-auto px-6">
                        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border/50 pb-8">
                            <div>
                                <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-3">Checkout</h1>
                                <p className="text-lg text-text-muted">Finalize your order and get started with Binary Craft.</p>
                            </div>

                            {/* Premium Step Indicator */}
                            <div className="flex items-center gap-3 text-sm font-bold">
                                <div className="flex items-center gap-2 text-primary bg-primary/10 px-3 py-1.5 rounded-full border border-primary/20">
                                    <div className="w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center text-[10px]">1</div>
                                    Details
                                </div>
                                <div className="w-8 h-[2px] bg-border" />
                                <div className="flex items-center gap-2 text-text-secondary">
                                    <div className="w-5 h-5 rounded-full bg-bg-secondary border border-border flex items-center justify-center text-[10px]">2</div>
                                    Payment
                                </div>
                            </div>
                        </div>

                        <div className="grid lg:grid-cols-[1fr_420px] gap-10 items-start">
                            {/* Form Section */}
                            <div className="space-y-8">
                                {error && (
                                    <div className="p-4 rounded-xl bg-danger/10 border border-danger/30 text-danger text-sm font-bold flex items-center gap-2">
                                        <span className="text-lg">❌</span> {error}
                                    </div>
                                )}

                                <form id="checkout-form" onSubmit={placeOrder} className="space-y-8">
                                    {/* Shipping Details */}
                                    <div className="glass-panel border border-border rounded-2xl p-8 shadow-xl relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10 -translate-y-1/2 translate-x-1/2" />

                                        <h3 className="text-xl font-bold mb-8 flex items-center gap-3 border-b border-border pb-6">
                                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                                <MapPin className="w-5 h-5" />
                                            </div>
                                            Shipping Details
                                        </h3>

                                        <div className="space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <label className="block text-sm font-bold text-text-secondary mb-2">Full Name</label>
                                                    <Input value={user?.name || ""} disabled className="opacity-60" />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-bold text-text-secondary mb-2">Email Address</label>
                                                    <Input value={user?.email || ""} disabled className="opacity-60" />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-bold text-text-secondary mb-2">Street Address</label>
                                                <Input
                                                    placeholder="House no, street name, area..."
                                                    required
                                                    value={shipping.street}
                                                    onChange={e => setShipping({ ...shipping, street: e.target.value })}
                                                />
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <label className="block text-sm font-bold text-text-secondary mb-2">City</label>
                                                    <Input
                                                        placeholder="e.g. Dhaka"
                                                        required
                                                        value={shipping.city}
                                                        onChange={e => setShipping({ ...shipping, city: e.target.value })}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-bold text-text-secondary mb-2">Country</label>
                                                    <select
                                                        className="w-full bg-bg-primary border border-border rounded-lg text-text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary h-12 px-4 transition-all duration-300"
                                                        value={shipping.country}
                                                        onChange={e => setShipping({ ...shipping, country: e.target.value })}
                                                    >
                                                        <option value="BD">Bangladesh</option>
                                                        <option value="US">United States</option>
                                                        <option value="GB">United Kingdom</option>
                                                        <option value="IN">India</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-bold text-text-secondary mb-2">Order Notes (Optional)</label>
                                                <textarea
                                                    className="w-full bg-bg-primary border border-border rounded-lg text-text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary p-4 min-h-[100px] transition-all duration-300 resize-y"
                                                    placeholder="Any special instructions for your order..."
                                                    value={shipping.notes}
                                                    onChange={e => setShipping({ ...shipping, notes: e.target.value })}
                                                ></textarea>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Payment Method */}
                                    <div className="glass-panel border border-border rounded-2xl p-8 shadow-xl relative overflow-hidden">
                                        <h3 className="text-xl font-bold mb-8 flex items-center gap-3 border-b border-border pb-6">
                                            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                                                <CreditCard className="w-5 h-5" />
                                            </div>
                                            Payment Method
                                        </h3>

                                        <div className="flex flex-col gap-4 mb-6">
                                            <PaymentOption
                                                id="cod"
                                                icon={<Banknote className="w-6 h-6" />}
                                                title="Cash on Delivery"
                                                desc="Pay after receiving the service or product."
                                                selected={paymentMethod === "cod"}
                                                onClick={() => setPaymentMethod("cod")}
                                            />
                                            <PaymentOption
                                                id="bank"
                                                icon={<Building2 className="w-6 h-6" />}
                                                title="Bank Transfer"
                                                desc="Direct transfer to our corporate account."
                                                selected={paymentMethod === "bank"}
                                                onClick={() => setPaymentMethod("bank")}
                                            />
                                            <PaymentOption
                                                id="stripe"
                                                icon={<CreditCard className="w-6 h-6" />}
                                                title="Credit/Debit Card"
                                                desc="Secure online payment via Stripe / SSLCommerz."
                                                selected={paymentMethod === "stripe"}
                                                onClick={() => setPaymentMethod("stripe")}
                                            />
                                        </div>

                                        {/* Trust Badges below payment options */}
                                        <div className="flex items-center justify-center gap-2 pt-4 border-t border-border/50">
                                            <div className="flex items-center gap-1 px-2.5 py-1 bg-white border border-border rounded text-[10px] font-black text-[#e2136e]">bkash</div>
                                            <div className="flex items-center gap-1 px-2.5 py-1 bg-white border border-border rounded text-[10px] font-black text-[#ED1C24] uppercase">Nagad</div>
                                            <div className="flex items-center gap-1 px-2.5 py-1 bg-white border border-border rounded text-[10px] font-black text-[#0066b3]">SSLCOMMERZ</div>
                                        </div>
                                    </div>
                                </form>
                            </div>

                            {/* Order Summary Sidebar */}
                            <div className="glass-panel border border-border rounded-2xl p-8 sticky top-28 shadow-xl animate-fadeInUp" style={{ animationDelay: "100ms" }}>
                                <h3 className="text-xl font-bold mb-6 pb-6 border-b border-border tracking-tight">Order Summary</h3>

                                <div className="space-y-6 mb-8 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                                    {cartItems.map((item, idx) => (
                                        <div key={idx} className="flex items-center justify-between gap-4 group">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-xl bg-bg-secondary flex items-center justify-center text-2xl border border-border shrink-0 text-white shadow-inner group-hover:border-primary/50 transition-colors">
                                                    {item.image}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-sm text-white max-w-[180px] truncate" title={item.title}>{item.title}</div>
                                                    <div className="text-xs text-text-muted mt-0.5">Qty: {item.qty}</div>
                                                </div>
                                            </div>
                                            <div className="font-black text-white text-right">
                                                {formatCurrency(item.price * item.qty)}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="border-t-2 border-border pt-6 mt-2">
                                    <div className="flex justify-between items-center mb-6">
                                        <span className="text-lg font-bold text-text-secondary">Total Amount</span>
                                        <span className="text-3xl font-black text-primary">{formatCurrency(total)}</span>
                                    </div>

                                    <p className="flex items-center justify-center gap-2 text-xs font-bold text-success/80 bg-success/10 py-3 rounded-lg mb-6 border border-success/20">
                                        <ShieldCheck className="w-4 h-4" /> 256-bit SSL Secure Checkout
                                    </p>

                                    <Button
                                        type="submit"
                                        form="checkout-form"
                                        variant="gradient"
                                        className="w-full text-base py-6 shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] transition-shadow"
                                        disabled={isLoading || cartItems.length === 0}
                                        isLoading={isLoading}
                                    >
                                        <CheckCircle2 className="w-5 h-5 mr-2" /> Complete Order
                                    </Button>

                                    <div className="mt-6 text-center">
                                        <Link href="/cart" className="text-sm font-bold text-text-muted hover:text-white transition-colors">
                                            ← Back to Cart
                                        </Link>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </main>
            </div>
        </AuthGuard>
    );
}

function PaymentOption({ id, icon, title, desc, selected, onClick }: any) {
    return (
        <div
            onClick={onClick}
            className={`relative overflow-hidden flex items-start gap-4 p-5 rounded-xl border-2 cursor-pointer transition-all duration-300 ${selected
                ? "border-primary bg-primary/5 shadow-[0_0_15px_rgba(59,130,246,0.15)]"
                : "border-border bg-bg-secondary hover:border-primary/50 hover:bg-white/5"
                }`}
        >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 shrink-0 transition-colors duration-300 ${selected ? "border-primary text-primary" : "border-border text-text-muted"
                }`}>
                {icon}
            </div>
            <div>
                <div className="font-bold text-white flex items-center">{title}</div>
                <div className="text-sm text-text-muted mt-1">{desc}</div>
            </div>
            {selected && (
                <div className="absolute top-4 right-4 text-primary animate-fadeIn">
                    <CheckCircle2 className="w-5 h-5" />
                </div>
            )}
        </div>
    );
}
