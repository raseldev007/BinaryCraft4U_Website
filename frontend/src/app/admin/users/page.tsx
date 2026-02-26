"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Users, Search, Ban, Unlock, Trash2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toast";

interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
    phone?: string;
    isBlocked: boolean;
    createdAt: string;
}

export default function AdminUsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [allUsers, setAllUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const { success, error } = useToast();

    const loadUsers = async () => {
        setIsLoading(true);
        try {
            const data = await api("/admin/users?limit=100");
            setAllUsers(data.users || []);
            setUsers(data.users || []);
        } catch (err: any) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    useEffect(() => {
        let filtered = allUsers;

        // Status Filter
        if (statusFilter === "blocked") {
            filtered = filtered.filter(u => u.isBlocked);
        } else if (statusFilter === "active") {
            filtered = filtered.filter(u => !u.isBlocked);
        }

        // Search Filter
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            filtered = filtered.filter(u =>
                u.name.toLowerCase().includes(q) ||
                u.email.toLowerCase().includes(q)
            );
        }

        setUsers(filtered);
    }, [searchQuery, statusFilter, allUsers]);

    const toggleBlock = async (id: string, name: string, isBlocked: boolean) => {
        if (!confirm(`Are you sure you want to ${isBlocked ? 'Unblock' : 'Block'} ${name}?`)) return;
        try {
            await api(`/admin/users/${id}/toggle-block`, "PUT");
            success(`User ${name} has been ${isBlocked ? 'unblocked' : 'blocked'}.`);
            loadUsers();
        } catch (err: any) {
            error(err.message || "Failed to toggle block status");
        }
    };

    const deleteUser = async (id: string, name: string) => {
        if (!confirm(`CAUTION: Permanently delete ${name}? This action is irreversible.`)) return;
        try {
            await api(`/admin/users/${id}`, "DELETE");
            success(`User ${name} was permanently deleted.`);
            loadUsers();
        } catch (err: any) {
            error(err.message || "Failed to delete user");
        }
    };

    return (
        <div className="animate-fadeIn">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-2">User Intelligence</h1>
                    <p className="text-sm font-medium text-text-muted">Manage and monitor your global community</p>
                </div>
                <Button onClick={loadUsers} variant="outline" className="shrink-0" isLoading={isLoading}>
                    <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} /> Refresh Data
                </Button>
            </div>

            <div className="glass-panel border border-border rounded-xl p-5 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
                <div className="flex flex-1 w-full max-w-2xl gap-4 flex-col sm:flex-row">
                    <Input
                        icon={<Search className="w-4 h-4" />}
                        placeholder="Search by name or email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full"
                    />
                    <select
                        className="w-full sm:w-[180px] bg-bg-primary border border-border rounded-lg text-text-primary focus:outline-none focus:border-primary h-12 px-4 transition-all font-semibold shrink-0"
                        value={statusFilter}
                        onChange={e => setStatusFilter(e.target.value)}
                    >
                        <option value="">Status: All</option>
                        <option value="active">Status: Active</option>
                        <option value="blocked">Status: Blocked</option>
                    </select>
                </div>

                <div className="text-sm font-bold text-primary tracking-widest uppercase ml-auto whitespace-nowrap">
                    {isLoading ? "Syncing..." : `${allUsers.length} MEMBERS DETECTED`}
                </div>
            </div>

            <div className="glass-panel border border-border rounded-xl overflow-hidden shadow-xl animate-fadeInUp">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[900px]">
                        <thead>
                            <tr className="bg-white/5 border-b border-border">
                                <th className="p-4 pl-6 text-xs font-bold uppercase tracking-widest text-text-muted">Member</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-widest text-text-muted">Identity</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-widest text-text-muted">Contact</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-widest text-text-muted">Status</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-widest text-text-muted">Joined On</th>
                                <th className="p-4 pr-6 text-xs font-bold uppercase tracking-widest text-text-muted text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading && users.length === 0 ? (
                                Array(6).fill(0).map((_, i) => (
                                    <tr key={i} className="border-b border-border/50">
                                        <td className="p-6 pl-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-white/5 rounded-full animate-pulse shrink-0" />
                                                <div>
                                                    <div className="h-4 w-28 bg-white/5 rounded mb-2 animate-pulse" />
                                                    <div className="h-3 w-16 bg-white/5 rounded animate-pulse" />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-6"><div className="h-4 w-40 bg-white/5 rounded animate-pulse" /></td>
                                        <td className="p-6"><div className="h-4 w-24 bg-white/5 rounded animate-pulse" /></td>
                                        <td className="p-6"><div className="h-6 w-20 bg-white/5 rounded-full animate-pulse" /></td>
                                        <td className="p-6"><div className="h-4 w-24 bg-white/5 rounded animate-pulse" /></td>
                                        <td className="p-6 pr-6"><div className="flex items-center justify-end gap-2"><div className="w-8 h-8 bg-white/5 rounded-md animate-pulse" /><div className="w-8 h-8 bg-white/5 rounded-md animate-pulse" /></div></td>
                                    </tr>
                                ))
                            ) : users.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-16 text-center text-text-muted font-medium">
                                        Nexus empty. No user signatures found.
                                    </td>
                                </tr>
                            ) : (
                                users.map((u) => (
                                    <tr key={u._id} className="border-b border-border/50 hover:bg-white/[0.02] transition-colors group">
                                        <td className="p-5 pl-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center font-black text-white text-base shadow-[0_4px_10px_rgba(0,212,255,0.2)] shrink-0">
                                                    {u.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-white text-sm">{u.name}</div>
                                                    <div className={`text-[10px] font-black tracking-wider uppercase mt-1 ${u.role === 'admin' ? 'text-primary' : 'text-text-muted'}`}>
                                                        {u.role}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-5 text-sm text-text-secondary">
                                            {u.email}
                                        </td>
                                        <td className="p-5 text-sm font-medium text-text-secondary">
                                            {u.phone || '–'}
                                        </td>
                                        <td className="p-5">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${u.isBlocked
                                                ? 'text-danger bg-danger/10 border-danger/20'
                                                : 'text-success bg-success/10 border-success/20'
                                                }`}>
                                                {u.isBlocked ? 'Blocked' : 'Verified'}
                                            </span>
                                        </td>
                                        <td className="p-5 text-sm text-text-muted">
                                            {new Date(u.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </td>
                                        <td className="p-5 pr-6 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    className={u.isBlocked ? 'text-success hover:bg-success/10 hover:border-success/50' : ''}
                                                    onClick={() => toggleBlock(u._id, u.name, u.isBlocked)}
                                                    title={u.isBlocked ? 'Unblock User' : 'Block User'}
                                                >
                                                    {u.isBlocked ? <Unlock className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    className="hover:bg-danger/10 hover:text-danger hover:border-danger/50"
                                                    onClick={() => deleteUser(u._id, u.name)}
                                                    title="Delete User"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
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
