"use client";

import { useState } from "react";
import Link from "next/link";
import { useToast } from "@/components/ui/Toast";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const { success, toast, error: showError } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return showError("Please enter your email.");
        setLoading(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });
            const data = await res.json();
            if (data.success || res.ok) {
                setSent(true);
                success("Reset link sent! Check your inbox.");
            } else {
                showError(data.message || "Failed to send reset email.");
            }
        } catch {
            showError("Network error. Please try again."); void toast;
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6" style={{ background: "var(--color-bg-primary)" }}>
            <div className="glass p-10 rounded-2xl w-full max-w-md">
                <div className="text-center mb-8">
                    <span style={{ fontSize: "2.5rem" }}>🔐</span>
                    <h1 style={{ color: "var(--color-text-primary)", fontSize: "1.75rem", fontWeight: 800, margin: "0.5rem 0 0.25rem" }}>
                        Forgot Password?
                    </h1>
                    <p style={{ color: "var(--color-text-secondary)", fontSize: "0.9rem" }}>
                        Enter your email and we&apos;ll send a reset link.
                    </p>
                </div>

                {sent ? (
                    <div className="text-center">
                        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📬</div>
                        <h2 style={{ color: "var(--color-success)", fontWeight: 700, marginBottom: "0.5rem" }}>Email Sent!</h2>
                        <p style={{ color: "var(--color-text-secondary)", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
                            Check your inbox for a password reset link. It expires in 10 minutes.
                        </p>
                        <Link
                            href="/login"
                            style={{
                                display: "inline-block",
                                padding: "0.75rem 2rem",
                                background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                                color: "white",
                                borderRadius: "10px",
                                fontWeight: 600,
                                textDecoration: "none",
                            }}
                        >
                            Back to Login
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                        <div>
                            <label style={{ display: "block", color: "var(--color-text-secondary)", fontSize: "0.875rem", marginBottom: "0.5rem", fontWeight: 500 }}>
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                required
                                style={{
                                    width: "100%",
                                    padding: "0.75rem 1rem",
                                    background: "rgba(255,255,255,0.05)",
                                    border: "1px solid var(--color-border)",
                                    borderRadius: "10px",
                                    color: "var(--color-text-primary)",
                                    fontSize: "0.9rem",
                                    outline: "none",
                                    boxSizing: "border-box",
                                }}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                padding: "0.875rem",
                                background: loading ? "rgba(59,130,246,0.5)" : "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                                color: "white",
                                border: "none",
                                borderRadius: "10px",
                                fontWeight: 700,
                                fontSize: "1rem",
                                cursor: loading ? "not-allowed" : "pointer",
                                transition: "opacity 0.2s",
                            }}
                        >
                            {loading ? "Sending..." : "Send Reset Link"}
                        </button>
                        <div style={{ textAlign: "center", marginTop: "0.5rem" }}>
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
