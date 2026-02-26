"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { ShoppingBag, RefreshCw, Loader2, Eye, Box } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";

interface OrderUser {
    name?: string;
    email?: string;
}

interface Order {
    _id: string;
    user?: OrderUser;
    items: any[];
    totalAmount: number;
    status: "pending" | "processing" | "completed" | "cancelled";
    paymentStatus: "paid" | "unpaid";
    createdAt: string;
}

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [total, setTotal] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState("");
    const [isUpdatingStatus, setIsUpdatingStatus] = useState<string | null>(null);
    const { success, error } = useToast();

    const loadOrders = async () => {
        setIsLoading(true);
        try {
            const endpoint = statusFilter ? `/admin/orders?status=${statusFilter}` : "/admin/orders";
            const data = await api(endpoint);
            setOrders(data.orders || []);
            setTotal(data.total || data.orders?.length || 0);
        } catch (err: any) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadOrders();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [statusFilter]);

    const updateStatus = async (id: string, newStatus: string) => {
        setIsUpdatingStatus(id);
        try {
            await api(`/orders/${id}/status`, "PUT", { status: newStatus });
            // Update local state to avoid full reload
            setOrders(orders.map(o => o._id === id ? { ...o, status: newStatus as any } : o));
            success(`Order status updated to ${newStatus}`);
        } catch (err: any) {
            error(err.message || "Failed to update status");
        } finally {
            setIsUpdatingStatus(null);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "pending": return "text-warning bg-warning/10 border-warning/20";
            case "processing": return "text-info bg-info/10 border-info/20";
            case "completed": return "text-success bg-success/10 border-success/20";
            case "cancelled": return "text-danger bg-danger/10 border-danger/20";
            default: return "text-text-secondary bg-white/5 border-border";
        }
    };

    return (
        <div className="animate-fadeIn">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-2">Order Intelligence</h1>
                    <p className="text-sm font-medium text-text-muted">Monitor and manage global service transactions</p>
                </div>
                <Button onClick={loadOrders} variant="outline" className="shrink-0" isLoading={isLoading}>
                    <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} /> Refresh Flow
                </Button>
            </div>

            <div className="glass-panel border border-border rounded-xl p-5 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
                <select
                    className="w-full max-w-[200px] bg-bg-primary border border-border rounded-lg text-text-primary focus:outline-none focus:border-primary h-12 px-4 transition-all font-semibold"
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value)}
                >
                    <option value="">Filter: All Orders</option>
                    <option value="pending">Filter: Pending</option>
                    <option value="processing">Filter: Processing</option>
                    <option value="completed">Filter: Completed</option>
                    <option value="cancelled">Filter: Cancelled</option>
                </select>

                <div className="text-sm font-bold text-primary tracking-widest uppercase">
                    {isLoading ? "Syncing..." : `${total} Transactions`}
                </div>
            </div>

            <div className="glass-panel border border-border rounded-xl overflow-hidden shadow-xl animate-fadeInUp">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[1000px]">
                        <thead>
                            <tr className="bg-white/5 border-b border-border">
                                <th className="p-4 pl-6 text-xs font-bold uppercase tracking-widest text-text-muted">ID</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-widest text-text-muted">Customer</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-widest text-text-muted">Cargo</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-widest text-text-muted">Valuation</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-widest text-text-muted">Status</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-widest text-text-muted">Payment</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-widest text-text-muted">Timestamp</th>
                                <th className="p-4 pr-6 text-xs font-bold uppercase tracking-widest text-text-muted text-right">Operation</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading && orders.length === 0 ? (
                                Array(6).fill(0).map((_, i) => (
                                    <tr key={i} className="border-b border-border/50">
                                        <td className="p-6 pl-6"><div className="h-6 w-20 bg-white/5 rounded animate-pulse" /></td>
                                        <td className="p-6">
                                            <div className="h-4 w-32 bg-white/5 rounded mb-2 animate-pulse" />
                                            <div className="h-3 w-40 bg-white/5 rounded animate-pulse" />
                                        </td>
                                        <td className="p-6"><div className="h-4 w-16 bg-white/5 rounded animate-pulse" /></td>
                                        <td className="p-6"><div className="h-5 w-20 bg-white/5 rounded animate-pulse" /></td>
                                        <td className="p-6"><div className="h-6 w-24 bg-white/5 rounded-full animate-pulse" /></td>
                                        <td className="p-6"><div className="h-6 w-20 bg-white/5 rounded-full animate-pulse" /></td>
                                        <td className="p-6"><div className="h-4 w-24 bg-white/5 rounded animate-pulse" /></td>
                                        <td className="p-6 pr-6"><div className="h-10 w-32 bg-white/5 rounded-lg ml-auto animate-pulse" /></td>
                                    </tr>
                                ))
                            ) : orders.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="p-16 text-center text-text-muted font-medium">
                                        Order stream empty. No active transponders found.
                                    </td>
                                </tr>
                            ) : (
                                orders.map((o) => (
                                    <tr key={o._id} className="border-b border-border/50 hover:bg-white/[0.02] transition-colors group">
                                        <td className="p-5 pl-6">
                                            <span className="font-mono font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-md text-sm border border-primary/20">
                                                #{o._id.slice(-8).toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="p-5">
                                            <div className="font-bold text-white text-sm">{o.user?.name || 'Guest User'}</div>
                                            <div className="text-xs text-text-muted mt-1">{o.user?.email || 'N/A'}</div>
                                        </td>
                                        <td className="p-5 text-sm font-medium text-text-secondary">
                                            <div className="flex items-center gap-1.5">
                                                <Box className="w-4 h-4 opacity-50" /> {o.items.length} {o.items.length === 1 ? 'Unit' : 'Units'}
                                            </div>
                                        </td>
                                        <td className="p-5 font-black text-white text-base">
                                            ৳{o.totalAmount.toFixed(2)}
                                        </td>
                                        <td className="p-5">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(o.status)}`}>
                                                {o.status}
                                            </span>
                                        </td>
                                        <td className="p-5">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${o.paymentStatus === 'paid'
                                                ? 'text-success bg-success/10 border-success/20'
                                                : 'text-warning bg-warning/10 border-warning/20'
                                                }`}>
                                                {o.paymentStatus}
                                            </span>
                                        </td>
                                        <td className="p-5 text-sm text-text-muted">
                                            {new Date(o.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </td>
                                        <td className="p-5 pr-6 text-right">
                                            <div className="relative inline-block text-left">
                                                {isUpdatingStatus === o._id ? (
                                                    <div className="flex items-center justify-end gap-2 text-primary text-sm font-bold">
                                                        <Loader2 className="w-4 h-4 animate-spin" /> Updating...
                                                    </div>
                                                ) : (
                                                    <select
                                                        className="bg-bg-primary/50 border border-border rounded-lg text-text-primary text-sm font-semibold focus:outline-none focus:border-primary h-10 px-3 cursor-pointer hover:bg-white/5 transition-colors text-right pl-8"
                                                        value={o.status}
                                                        onChange={(e) => updateStatus(o._id, e.target.value)}
                                                    >
                                                        <option value="pending">Pending</option>
                                                        <option value="processing">Processing</option>
                                                        <option value="completed">Completed</option>
                                                        <option value="cancelled">Cancelled</option>
                                                    </select>
                                                )}
                                            </div>
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
