"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("ErrorBoundary caught an error:", error, errorInfo);
    }

    handleRetry = () => {
        this.setState({ hasError: false, error: null });
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) return this.props.fallback;

            return (
                <div className="min-h-screen flex items-center justify-center p-6" style={{ background: "var(--color-bg-primary)" }}>
                    <div className="glass text-center p-10 rounded-2xl max-w-md w-full" style={{ border: "1px solid rgba(239,68,68,0.2)" }}>
                        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>⚡</div>
                        <h2 style={{ color: "var(--color-text-primary)", fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.75rem" }}>
                            Something went wrong
                        </h2>
                        <p style={{ color: "var(--color-text-secondary)", fontSize: "0.9rem", marginBottom: "0.5rem" }}>
                            The server may be temporarily unavailable.
                        </p>
                        {process.env.NODE_ENV !== "production" && this.state.error && (
                            <p style={{ color: "var(--color-danger)", fontSize: "0.75rem", marginBottom: "1rem", fontFamily: "monospace" }}>
                                {this.state.error.message}
                            </p>
                        )}
                        <button
                            onClick={this.handleRetry}
                            style={{
                                background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                                color: "white",
                                border: "none",
                                borderRadius: "10px",
                                padding: "0.75rem 2rem",
                                fontWeight: 600,
                                cursor: "pointer",
                                transition: "opacity 0.2s",
                            }}
                            onMouseOver={(e) => (e.currentTarget.style.opacity = "0.85")}
                            onMouseOut={(e) => (e.currentTarget.style.opacity = "1")}
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
