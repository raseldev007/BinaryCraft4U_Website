"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Package, Search, ExternalLink } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { formatCurrency } from "@/lib/utils";

interface OrderItem {
    product: string;
    title: string;
    qty: number;
    price: number;
}

interface Order {
    _id: string;
    items: OrderItem[];
    totalAmount: number;
    status: string;
    paymentStatus: string;
    createdAt: string;
}

export default function OrderHistoryPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
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

    return (
        <div className="animate-fadeIn">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-2 flex items-center gap-3">
                        <Package className="text-primary w-8 h-8" /> Order History
                    </h1>
                    <p className="text-text-muted">Track all your past orders and their delivery status.</p>
                </div>
            </div>

            <div className="glass-panel border border-border rounded-2xl overflow-hidden shadow-xl animate-fadeInUp">
                <div className="p-6 border-b border-border/50 bg-bg-secondary/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <h3 className="text-lg font-bold">All Orders</h3>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                        <input
                            type="text"
                            placeholder="Search orders..."
                            className="bg-bg-primary border border-border rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary w-full sm:w-64 transition-all"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto min-h-[400px]">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="bg-white/[0.02]">
                                <th className="p-5 border-b border-border text-xs font-bold uppercase tracking-widest text-text-muted whitespace-nowrap">Order ID</th>
                                <th className="p-5 border-b border-border text-xs font-bold uppercase tracking-widest text-text-muted whitespace-nowrap">Items</th>
                                <th className="p-5 border-b border-border text-xs font-bold uppercase tracking-widest text-text-muted whitespace-nowrap">Total</th>
                                <th className="p-5 border-b border-border text-xs font-bold uppercase tracking-widest text-text-muted whitespace-nowrap">Status</th>
                                <th className="p-5 border-b border-border text-xs font-bold uppercase tracking-widest text-text-muted whitespace-nowrap">Payment</th>
                                <th className="p-5 border-b border-border text-xs font-bold uppercase tracking-widest text-text-muted whitespace-nowrap">Date</th>
                                <th className="p-5 border-b border-border text-xs font-bold uppercase tracking-widest text-text-muted whitespace-nowrap text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan={7} className="p-16 text-center text-text-muted">
                                        <div className="flex flex-col items-center justify-center gap-4">
                                            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                                            Loading your order history...
                                        </div>
                                    </td>
                                </tr>
                            ) : orders.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="p-16 text-center">
                                        <div className="flex flex-col items-center justify-center gap-4">
                                            <div className="w-16 h-16 rounded-full bg-bg-secondary flex items-center justify-center text-text-muted mb-2">
                                                <Package className="w-8 h-8" />
                                            </div>
                                            <p className="text-text-muted font-medium">No orders found.</p>
                                            <Link href="/products">
                                                <Button className="mt-2 shadow-[0_0_15px_rgba(59,130,246,0.2)]">Start Shopping</Button>
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                orders.map((order) => (
                                    <tr key={order._id} className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="p-5 border-b border-border">
                                            <span className="font-mono text-primary font-bold text-sm bg-primary/10 px-2 py-1 rounded inline-block">
                                                #{order._id.slice(-8).toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="p-5 border-b border-border">
                                            <div className="text-sm font-medium text-text-primary">
                                                {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                                            </div>
                                            <div className="text-xs text-text-muted truncate max-w-[200px]" title={order.items.map(i => i.title).join(", ")}>
                                                {order.items.slice(0, 2).map(i => i.title).join(', ')}
                                                {order.items.length > 2 ? '...' : ''}
                                            </div>
                                        </td>
                                        <td className="p-5 border-b border-border">
                                            <span className="text-base font-black text-white">
                                                {formatCurrency(order.totalAmount)}
                                            </span>
                                        </td>
                                        <td className="p-5 border-b border-border">
                                            <StatusPill status={order.status} />
                                        </td>
                                        <td className="p-5 border-b border-border">
                                            <PaymentStatusPill status={order.paymentStatus} />
                                        </td>
                                        <td className="p-5 border-b border-border text-sm text-text-secondary font-medium">
                                            {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                                        </td>
                                        <td className="p-5 border-b border-border text-right">
                                            <Button variant="outline" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                Details <ExternalLink className="w-3 h-3 ml-2" />
                                            </Button>
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
function StatusPill({ status }: { status: string }) {
    const map: Record<string, string> = {
        pending: "text-warning bg-warning/10 border-warning/20",
        processing: "text-primary bg-primary/10 border-primary/20",
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

function PaymentStatusPill({ status }: { status: string }) {
    const isPaid = status.toLowerCase() === 'paid';
    return (
        <span className={`inline-flex items-center gap-1.5 text-xs font-bold ${isPaid ? 'text-success' : 'text-warning'}`}>
            <span className={`w-2 h-2 rounded-full ${isPaid ? 'bg-success' : 'bg-warning animate-pulse'}`}></span>
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
    );
}
