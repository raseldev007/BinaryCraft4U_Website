"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/Toast";
import { Download, Mail, Users } from "lucide-react";

interface Subscriber {
    _id: string;
    email: string;
    status: string;
    createdAt: string;
}

export default function AdminSubscribersPage() {
    const { token } = useAuth();
    const { success, error: showError } = useToast();
    const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchSubscribers = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/subscribers`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (data.success) setSubscribers(data.data || []);
        } catch { showError("Failed to load subscribers"); }
        finally { setLoading(false); }
    }, [token, showError]);

    useEffect(() => { fetchSubscribers(); }, [fetchSubscribers]);

    const exportCSV = () => {
        if (subscribers.length === 0) return showError("No subscribers to export");
        const headers = ["Email", "Status", "Subscribed Date"];
        const rows = subscribers.map(s => [s.email, s.status, new Date(s.createdAt).toLocaleDateString()]);
        const csv = [headers, ...rows].map(row => row.map(v => `"${v}"`).join(",")).join("\n");
        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a"); a.href = url; a.download = "subscribers.csv"; a.click();
        URL.revokeObjectURL(url);
        success("Exported subscribers CSV");
    };

    return (
        <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2rem" }}>
                <div>
                    <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--color-text-primary)" }}>Newsletter Subscribers</h1>
                    <p style={{ color: "var(--color-text-muted)", fontSize: "0.875rem", marginTop: "0.25rem" }}>
                        {subscribers.length} active subscriber{subscribers.length !== 1 ? "s" : ""}
                    </p>
                </div>
                <button onClick={exportCSV}
                    style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.6rem 1.25rem", background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)", color: "#10b981", borderRadius: "10px", fontWeight: 600, cursor: "pointer" }}>
                    <Download style={{ width: "16px", height: "16px" }} /> Export CSV
                </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
                <div className="glass" style={{ padding: "1.25rem", borderRadius: "14px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        <div style={{ padding: "0.6rem", background: "rgba(59,130,246,0.15)", borderRadius: "10px" }}><Users style={{ width: "20px", height: "20px", color: "#3b82f6" }} /></div>
                        <div>
                            <p style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>Total</p>
                            <p style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--color-text-primary)" }}>{subscribers.length}</p>
                        </div>
                    </div>
                </div>
                <div className="glass" style={{ padding: "1.25rem", borderRadius: "14px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        <div style={{ padding: "0.6rem", background: "rgba(16,185,129,0.15)", borderRadius: "10px" }}><Mail style={{ width: "20px", height: "20px", color: "#10b981" }} /></div>
                        <div>
                            <p style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>Active</p>
                            <p style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--color-text-primary)" }}>{subscribers.filter(s => s.status === "active").length}</p>
                        </div>
                    </div>
                </div>
            </div>

            {loading ? (
                <div style={{ display: "grid", gap: "0.5rem" }}>
                    {[...Array(8)].map((_, i) => <div key={i} className="animate-shimmer" style={{ height: "52px", borderRadius: "10px" }} />)}
                </div>
            ) : subscribers.length === 0 ? (
                <div className="glass" style={{ padding: "3rem", borderRadius: "16px", textAlign: "center", color: "var(--color-text-muted)" }}>
                    <Mail style={{ width: "3rem", height: "3rem", margin: "0 auto 1rem", opacity: 0.4 }} />
                    <p>No subscribers yet.</p>
                </div>
            ) : (
                <div className="glass" style={{ borderRadius: "16px", overflow: "hidden" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr style={{ borderBottom: "1px solid var(--color-border)" }}>
                                {["Email", "Status", "Subscribed On"].map(h => (
                                    <th key={h} style={{ padding: "0.875rem 1.25rem", textAlign: "left", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--color-text-muted)" }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {subscribers.map((sub, i) => (
                                <tr key={sub._id} style={{ borderBottom: i < subscribers.length - 1 ? "1px solid var(--color-border)" : "none", transition: "background 0.15s" }}
                                    onMouseOver={e => (e.currentTarget.style.background = "rgba(255,255,255,0.02)")}
                                    onMouseOut={e => (e.currentTarget.style.background = "transparent")}>
                                    <td style={{ padding: "0.875rem 1.25rem", color: "var(--color-text-primary)", fontSize: "0.9rem" }}>{sub.email}</td>
                                    <td style={{ padding: "0.875rem 1.25rem" }}>
                                        <span style={{ fontSize: "0.7rem", padding: "0.2rem 0.6rem", borderRadius: "9999px", background: sub.status === "active" ? "rgba(16,185,129,0.1)" : "rgba(100,116,139,0.1)", color: sub.status === "active" ? "#10b981" : "var(--color-text-muted)", border: `1px solid ${sub.status === "active" ? "rgba(16,185,129,0.3)" : "var(--color-border)"}`, fontWeight: 600, textTransform: "capitalize" }}>
                                            {sub.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: "0.875rem 1.25rem", color: "var(--color-text-muted)", fontSize: "0.85rem" }}>
                                        {new Date(sub.createdAt).toLocaleDateString("en-BD", { year: "numeric", month: "short", day: "numeric" })}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
