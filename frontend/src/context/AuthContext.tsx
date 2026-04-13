"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    login: (token: string, user: User) => void;
    logout: () => void;
    isAuthenticated: boolean;
    isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    const clearSession = useCallback(() => {
        localStorage.removeItem("bc_token");
        localStorage.removeItem("bc_user");
        localStorage.removeItem("bc_cart_count");
        localStorage.removeItem("bc_cart_local");
        setToken(null);
        setUser(null);
    }, []);

    useEffect(() => {
        // Load auth state from localStorage on mount, then validate with server
        const storedToken = localStorage.getItem("bc_token");
        const storedUser = localStorage.getItem("bc_user");

        if (!storedToken || !storedUser) {
            setIsLoading(false);
            return;
        }

        let parsedUser: User | null = null;
        try {
            parsedUser = JSON.parse(storedUser);
        } catch {
            clearSession();
            setIsLoading(false);
            return;
        }

        // Validate the token against the backend — auto-logout if user was deleted
        fetch(`${API_BASE}/auth/me`, {
            headers: { Authorization: `Bearer ${storedToken}` }
        })
            .then(res => {
                if (res.ok) {
                    setToken(storedToken);
                    setUser(parsedUser);
                } else {
                    // Token is stale (server restarted, user deleted, etc.) — clear silently
                    console.warn("[Auth] Stored token is invalid — clearing session.");
                    clearSession();
                }
            })
            .catch(() => {
                // Server unreachable — keep session alive locally so app still renders
                setToken(storedToken);
                setUser(parsedUser);
            })
            .finally(() => setIsLoading(false));
    }, [clearSession]);

    const login = (newToken: string, newUser: User) => {
        localStorage.setItem("bc_token", newToken);
        localStorage.setItem("bc_user", JSON.stringify(newUser));
        setToken(newToken);
        setUser(newUser);
    };

    const logout = () => {
        clearSession();
        router.push("/");
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                isLoading,
                login,
                logout,
                isAuthenticated: !!token,
                isAdmin: user?.role === "admin",
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
