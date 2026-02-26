"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Users, ShoppingCart, DollarSign, MessageSquare, Plus, ExternalLink, ArrowRight, Clock, Box, Download } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { formatCurrency } from "@/lib/utils";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

export default function AdminDashboard() {
    const [data, setData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Chart.js defaults for premium look
        ChartJS.defaults.color = '#94A3B8';
        ChartJS.defaults.font.family = "'Inter', sans-serif";
        (ChartJS.defaults.plugins.tooltip as any).backgroundColor = 'rgba(15, 23, 42, 0.9)';
        (ChartJS.defaults.plugins.tooltip as any).padding = 12;
        (ChartJS.defaults.plugins.tooltip as any).cornerRadius = 8;

        const fetchDashboard = async () => {
            try {
                const res = await api("/admin/dashboard");
                setData(res.data);
            } catch (err) {
                console.error("Failed to load admin dashboard", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchDashboard();
    }, []);

    const d = data || {
        usersCount: 0,
        ordersCount: 0,
        revenue: 0,
        messagesCount: 0,
        productsCount: 0,
        servicesCount: 0,
        recentOrders: []
    };

    const donutData = {
        labels: ['Complete', 'Pending', 'Processing', 'Cancelled'],
        datasets: [
            {
                data: [d.ordersCount, 0, 0, 0],
                backgroundColor: ['#10B981', '#F59E0B', '#3B82F6', '#EF4444'],
                borderWidth: 0,
                hoverOffset: 15,
                cutout: '75%',
            },
        ],
    };

    const donutOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'right' as const, labels: { padding: 25, usePointStyle: true, font: { weight: 600, size: 12 } } },
        },
    };

    const barData = {
        labels: ['Users', 'Products', 'Services'],
        datasets: [
            {
                data: [d.usersCount, d.productsCount, d.servicesCount],
                backgroundColor: ['rgba(0, 212, 255, 0.2)', 'rgba(139, 92, 246, 0.2)', 'rgba(16, 185, 129, 0.2)'],
                borderColor: ['#00D4FF', '#8B5CF6', '#10B981'],
                borderWidth: 2,
                borderRadius: 10,
                hoverBackgroundColor: ['rgba(0, 212, 255, 0.4)', 'rgba(139, 92, 246, 0.4)', 'rgba(16, 185, 129, 0.4)'],
            },
        ],
    };

    const barOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
            x: { grid: { display: false }, border: { display: false } },
            y: { display: false },
        },
    };

    const exportOrdersToCSV = () => {
        if (!data || !data.recentOrders || data.recentOrders.length === 0) return;

        const headers = ["ID", "Client Name", "Client Email", "Amount", "Status", "Date"];
        const rows = data.recentOrders.map((order: any) => [
            order._id,
            order.user?.name || "Guest",
            order.user?.email || "N/A",
            order.totalAmount,
            order.status,
            new Date(order.createdAt).toLocaleDateString()
        ]);

        const csvContent = "data:text/csv;charset=utf-8,"
            + headers.join(",") + "\n"
            + rows.map((e: any[]) => e.join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `bc_orders_export_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <div className="animate-fadeIn">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-2">Command Center</h1>
                    <p className="text-sm font-medium text-text-muted">{currentDate}</p>
                </div>
                <div className="flex gap-3">
                    <Link href="/admin/products/new">
                        <Button variant="outline" size="sm">
                            <Plus className="w-4 h-4 mr-2" /> New Product
                        </Button>
                    </Link>
                    <Link href="/admin/services/new">
                        <Button size="sm" className="shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                            <Plus className="w-4 h-4 mr-2" /> New Service
                        </Button>
                    </Link>
                </div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <KpiCard icon={<Users />} title="Active Users" value={isLoading ? null : d.usersCount} color="c1" />
                <KpiCard icon={<ShoppingCart />} title="Sales Volume" value={isLoading ? null : d.ordersCount} color="c2" />
                <KpiCard icon={<DollarSign />} title="Net Revenue" value={isLoading ? null : formatCurrency(d.revenue)} color="c3" />
                <KpiCard icon={<MessageSquare />} title="Inquiries" value={isLoading ? null : d.messagesCount} color="c4" />
            </div>

            {/* Charts */}
            <div className="grid lg:grid-cols-[1.5fr_1fr] gap-6 mb-10">
                <div className="glass-panel border border-border rounded-xl p-8 shadow-xl">
                    <h3 className="text-lg font-bold mb-6 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                            <DollarSign className="w-4 h-4" />
                        </div>
                        Revenue Analytics
                    </h3>
                    <div className="h-[250px]">
                        {isLoading ? <ChartSkeleton /> : <Doughnut data={donutData} options={donutOptions} />}
                    </div>
                </div>

                <div className="glass-panel border border-border rounded-xl p-8 shadow-xl">
                    <h3 className="text-lg font-bold mb-6 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
                            <Box className="w-4 h-4" />
                        </div>
                        Ecosystem Health
                    </h3>
                    <div className="h-[250px]">
                        {isLoading ? <ChartSkeleton /> : <Bar data={barData} options={barOptions} />}
                    </div>
                </div>
            </div>

            {/* Recent Orders Table */}
            <div className="glass-panel border border-border rounded-xl overflow-hidden shadow-xl animate-fadeInUp">
                <div className="p-6 border-b border-border flex items-center justify-between">
                    <h3 className="text-lg font-bold flex items-center gap-3">
                        <Clock className="w-5 h-5 text-text-muted" /> Latest Transactions
                    </h3>
                    <div className="flex gap-3">
                        <Button
                            variant="outline"
                            size="sm"
                            className="text-xs text-text-muted hover:text-white"
                            onClick={exportOrdersToCSV}
                            disabled={isLoading || !d.recentOrders?.length}
                        >
                            <Download className="w-3.5 h-3.5 mr-1.5" /> Export CSV
                        </Button>
                        <Link href="/admin/orders">
                            <Button variant="outline" size="sm" className="text-xs">Audit All</Button>
                        </Link>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="bg-white/5">
                                <th className="p-4 border-b border-border text-xs font-bold uppercase tracking-widest text-text-muted">ID</th>
                                <th className="p-4 border-b border-border text-xs font-bold uppercase tracking-widest text-text-muted">Client</th>
                                <th className="p-4 border-b border-border text-xs font-bold uppercase tracking-widest text-text-muted">Amount</th>
                                <th className="p-4 border-b border-border text-xs font-bold uppercase tracking-widest text-text-muted">Status</th>
                                <th className="p-4 border-b border-border text-xs font-bold uppercase tracking-widest text-text-muted">Timestamp</th>
                                <th className="p-4 border-b border-border text-xs font-bold uppercase tracking-widest text-text-muted">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <tr key={i}>
                                        <td className="p-5 border-b border-border"><div className="h-4 bg-white/5 rounded w-16 animate-pulse" /></td>
                                        <td className="p-5 border-b border-border">
                                            <div className="h-4 bg-white/5 rounded w-24 mb-2 animate-pulse" />
                                            <div className="h-3 bg-white/5 rounded w-32 animate-pulse" />
                                        </td>
                                        <td className="p-5 border-b border-border"><div className="h-5 bg-white/5 rounded w-16 animate-pulse" /></td>
                                        <td className="p-5 border-b border-border"><div className="h-6 bg-white/5 rounded-full w-20 animate-pulse" /></td>
                                        <td className="p-5 border-b border-border"><div className="h-4 bg-white/5 rounded w-20 animate-pulse" /></td>
                                        <td className="p-5 border-b border-border"><div className="h-8 bg-white/5 rounded w-16 animate-pulse" /></td>
                                    </tr>
                                ))
                            ) : !d.recentOrders || d.recentOrders.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-16 text-center text-text-muted font-medium">
                                        Securely connected. No recent activity detected.
                                    </td>
                                </tr>
                            ) : (
                                d.recentOrders.map((order: any) => (
                                    <tr key={order._id} className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="p-5 border-b border-border text-sm font-mono font-bold text-primary">
                                            #{order._id.slice(-8).toUpperCase()}
                                        </td>
                                        <td className="p-5 border-b border-border">
                                            <div className="font-bold text-white text-sm">{order.user?.name || 'Guest User'}</div>
                                            <div className="text-xs text-text-muted mt-1">{order.user?.email || 'N/A'}</div>
                                        </td>
                                        <td className="p-5 border-b border-border">
                                            <div className="text-base font-black text-white">{formatCurrency(order.totalAmount)}</div>
                                        </td>
                                        <td className="p-5 border-b border-border">
                                            <StatusBadge status={order.status} />
                                        </td>
                                        <td className="p-5 border-b border-border text-sm text-text-secondary font-medium">
                                            {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </td>
                                        <td className="p-5 border-b border-border">
                                            <Link href={`/admin/orders/${order._id}`}>
                                                <Button variant="outline" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                    Review
                                                </Button>
                                            </Link>
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



function KpiCard({ icon, title, value, color }: any) {
    const isC1 = color === "c1"; // Primary gradient
    const isC2 = color === "c2"; // Purple
    const isC3 = color === "c3"; // Green
    const isC4 = color === "c4"; // Orange

    return (
        <div className="glass-panel border border-border rounded-xl p-6 relative overflow-hidden group hover:-translate-y-1 hover:border-primary/50 transition-all duration-300 shadow-lg cursor-default">
            {/* Top glowing line */}
            <div className={`absolute top-0 left-0 right-0 h-[3px] opacity-80 ${isC1 ? "bg-gradient-to-r from-primary to-accent" :
                isC2 ? "bg-[#8B5CF6]" :
                    isC3 ? "bg-[#10B981]" :
                        "bg-[#F59E0B]"
                }`} />

            <div className="w-12 h-12 rounded-xl bg-white/[0.03] border border-border flex items-center justify-center text-primary mb-5 group-hover:scale-110 transition-transform">
                {icon}
            </div>

            {value === null ? (
                <div className="h-8 w-20 bg-white/5 rounded animate-pulse mb-1"></div>
            ) : (
                <div className="text-3xl font-black mb-1">{value}</div>
            )}

            <div className="text-xs font-bold uppercase tracking-wider text-text-muted">{title}</div>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
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

function ChartSkeleton() {
    return (
        <div className="w-full h-full flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-white/5 border-t-primary rounded-full animate-spin"></div>
        </div>
    );
}
