"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useToast } from "@/components/ui/Toast";

export default function ResetPasswordPage() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [done, setDone] = useState(false);
    const { success, error: showError } = useToast();
    const router = useRouter();
    const params = useParams();
    const token = params.token as string;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!password || password.length < 6) return showError("Password must be at least 6 characters.");
        if (password !== confirmPassword) return showError("Passwords do not match.");

        setLoading(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password/${token}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password }),
            });
            const data = await res.json();
            if (data.success) {
                setDone(true);
                success("Password reset successfully!");
                setTimeout(() => router.push("/login"), 2000);
            } else {
                showError(data.message || "Reset failed. The link may have expired.");
            }
        } catch {
            showError("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6" style={{ background: "var(--color-bg-primary)" }}>
            <div className="glass p-10 rounded-2xl w-full max-w-md">
                <div className="text-center mb-8">
                    <span style={{ fontSize: "2.5rem" }}>🔑</span>
                    <h1 style={{ color: "var(--color-text-primary)", fontSize: "1.75rem", fontWeight: 800, margin: "0.5rem 0 0.25rem" }}>
                        Reset Password
                    </h1>
                    <p style={{ color: "var(--color-text-secondary)", fontSize: "0.9rem" }}>
                        Create a strong new password for your account.
                    </p>
                </div>

                {done ? (
                    <div className="text-center">
                        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>✅</div>
                        <h2 style={{ color: "var(--color-success)", fontWeight: 700 }}>Password Reset!</h2>
                        <p style={{ color: "var(--color-text-secondary)", fontSize: "0.9rem", marginTop: "0.5rem" }}>
                            Redirecting to login...
                        </p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                        <div>
                            <label style={{ display: "block", color: "var(--color-text-secondary)", fontSize: "0.875rem", marginBottom: "0.5rem", fontWeight: 500 }}>
                                New Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Min. 6 characters"
                                required
                                minLength={6}
                                style={{
                                    width: "100%", padding: "0.75rem 1rem", background: "rgba(255,255,255,0.05)",
                                    border: "1px solid var(--color-border)", borderRadius: "10px",
                                    color: "var(--color-text-primary)", fontSize: "0.9rem", outline: "none", boxSizing: "border-box",
                                }}
                            />
                        </div>
                        <div>
                            <label style={{ display: "block", color: "var(--color-text-secondary)", fontSize: "0.875rem", marginBottom: "0.5rem", fontWeight: 500 }}>
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Repeat your password"
                                required
                                style={{
                                    width: "100%", padding: "0.75rem 1rem", background: "rgba(255,255,255,0.05)",
                                    border: "1px solid var(--color-border)", borderRadius: "10px",
                                    color: "var(--color-text-primary)", fontSize: "0.9rem", outline: "none", boxSizing: "border-box",
                                }}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                padding: "0.875rem", background: loading ? "rgba(59,130,246,0.5)" : "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                                color: "white", border: "none", borderRadius: "10px", fontWeight: 700,
                                fontSize: "1rem", cursor: loading ? "not-allowed" : "pointer",
                            }}
                        >
                            {loading ? "Resetting..." : "Reset Password"}
                        </button>
                        <div style={{ textAlign: "center" }}>
                            <Link href="/login" style={{ color: "var(--color-primary)", fontSize: "0.9rem", textDecoration: "none" }}>
                                ← Back to Login
                            </Link>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
