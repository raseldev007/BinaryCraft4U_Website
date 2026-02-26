"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { ShoppingBag, ShoppingCart, CheckCircle, Clock } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { formatCurrency } from "@/lib/utils";

interface Order {
    _id: string;
    items: any[];
    totalAmount: number;
    status: string;
    createdAt: string;
}

export default function DashboardPage() {
    const { user } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [cartCount, setCartCount] = useState(0);

    useEffect(() => {
        // Get local cart count
        const localCart = JSON.parse(localStorage.getItem("bc_cart_local") || "[]");
        setCartCount(localCart.reduce((sum: number, item: any) => sum + (item.qty || 1), 0));

        // Fetch user orders
        const fetchOrders = async () => {
            try {
                const data = await api("/users/orders");
                setOrders(data.orders || []);
            } catch (err) {
                console.error("Failed to load orders", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const completedCount = orders.filter(o => o.status === "completed").length;
    const pendingCount = orders.filter(o => o.status === "pending").length;

    return (
        <div className="animate-fadeIn">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-2">
                        Dashboard <span className="text-2xl">👋</span>
                    </h1>
                    <p className="text-text-muted">
                        Welcome back, {user?.name}! Here's your account overview.
                    </p>
                </div>
                <div className="flex gap-3">
                    <Link href="/cart">
                        <Button variant="outline" size="sm">
                            <ShoppingCart className="w-4 h-4 mr-2" /> View Cart
                        </Button>
                    </Link>
                    <Link href="/products">
                        <Button size="sm" className="shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                            <ShoppingBag className="w-4 h-4 mr-2" /> Shop Now
                        </Button>
                    </Link>
                </div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <KpiCard
                    icon={<ShoppingBag />}
                    title="Total Orders"
                    value={orders.length}
                    color="cyan"
                    delay={100}
                />
                <KpiCard
                    icon={<ShoppingCart />}
                    title="Items in Cart"
                    value={cartCount}
                    color="purple"
                    delay={200}
                />
                <KpiCard
                    icon={<CheckCircle />}
                    title="Completed"
                    value={completedCount}
                    color="green"
                    delay={300}
                />
                <KpiCard
                    icon={<Clock />}
                    title="Pending Orders"
                    value={pendingCount}
                    color="orange"
                    delay={400}
                />
            </div>

            {/* Recent Orders */}
            <div className="glass-panel border border-border rounded-xl overflow-hidden animate-fadeInUp" style={{ animationDelay: "500ms" }}>
                <div className="p-6 border-b border-border flex items-center justify-between">
                    <h3 className="text-lg font-bold">Recent Orders</h3>
                    <Link href="/order-history">
                        <Button variant="outline" size="sm" className="text-xs">View All</Button>
                    </Link>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/5 text-xs uppercase tracking-widest font-bold text-text-muted">
                                <th className="p-4 border-b border-border whitespace-nowrap">Order ID</th>
                                <th className="p-4 border-b border-border whitespace-nowrap">Items</th>
                                <th className="p-4 border-b border-border whitespace-nowrap">Total Amount</th>
                                <th className="p-4 border-b border-border whitespace-nowrap">Status</th>
                                <th className="p-4 border-b border-border whitespace-nowrap">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="p-12 text-center text-text-muted">
                                        <div className="flex items-center justify-center gap-3">
                                            <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                                            Loading orders...
                                        </div>
                                    </td>
                                </tr>
                            ) : orders.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-12 text-center text-text-muted">
                                        No orders yet. <Link href="/products" className="text-primary hover:underline">Start Shopping →</Link>
                                    </td>
                                </tr>
                            ) : (
                                orders.slice(0, 5).map((order) => (
                                    <tr key={order._id} className="hover:bg-white/5 transition-colors group">
                                        <td className="p-4 border-b border-border text-sm font-mono text-primary font-bold">
                                            #{order._id.slice(-8).toUpperCase()}
                                        </td>
                                        <td className="p-4 border-b border-border text-sm text-text-secondary">
                                            {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                                        </td>
                                        <td className="p-4 border-b border-border text-sm font-bold text-white">
                                            {formatCurrency(order.totalAmount)}
                                        </td>
                                        <td className="p-4 border-b border-border">
                                            <StatusPill status={order.status} />
                                        </td>
                                        <td className="p-4 border-b border-border text-sm text-text-secondary">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

// Subcomponents
function KpiCard({ icon, title, value, color, delay }: any) {
    const colorMap: Record<string, string> = {
        cyan: "text-[#00F5FF] bg-[#00F5FF]/10 border-[#00F5FF]/20",
        purple: "text-accent bg-accent/10 border-accent/20",
        green: "text-success bg-success/10 border-success/20",
        orange: "text-warning bg-warning/10 border-warning/20",
    };

    return (
        <div className="glass-panel border border-border rounded-xl p-6 relative overflow-hidden group hover:-translate-y-1 hover:border-primary/50 transition-all duration-300 shadow-lg animate-fadeInUp" style={{ animationDelay: `${delay}ms` }}>
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 border ${colorMap[color]}`}>
                {icon}
            </div>
            <div className="text-3xl font-black mb-1">{value}</div>
            <div className="text-sm font-semibold text-text-muted">{title}</div>
        </div>
    );
}

function StatusPill({ status }: { status: string }) {
    const map: Record<string, string> = {
        pending: "text-warning bg-warning/10 border-warning/20",
        completed: "text-success bg-success/10 border-success/20",
        cancelled: "text-danger bg-danger/10 border-danger/20",
    };

    const styling = map[status.toLowerCase()] || "text-text-muted bg-bg-secondary border-border";

    return (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${styling}`}>
            {status}
        </span>
    );
}
