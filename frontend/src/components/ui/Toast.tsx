"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle2, XCircle, Info, X } from "lucide-react";

type ToastType = "success" | "error" | "info";

interface Toast {
    id: string;
    type: ToastType;
    message: string;
}

interface ToastContextType {
    toast: (message: string, type?: ToastType) => void;
    success: (message: string) => void;
    error: (message: string) => void;
    info: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const remove = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const toast = useCallback(
        (message: string, type: ToastType = "info") => {
            const id = Math.random().toString(36).slice(2);
            setToasts((prev) => [...prev, { id, type, message }]);
            setTimeout(() => remove(id), 3500);
        },
        [remove]
    );

    const success = useCallback((m: string) => toast(m, "success"), [toast]);
    const error = useCallback((m: string) => toast(m, "error"), [toast]);
    const info = useCallback((m: string) => toast(m, "info"), [toast]);

    const icons = {
        success: <CheckCircle2 className="w-5 h-5 shrink-0" />,
        error: <XCircle className="w-5 h-5 shrink-0" />,
        info: <Info className="w-5 h-5 shrink-0" />,
    };

    return (
        <ToastContext.Provider value={{ toast, success, error, info }}>
            {children}
            <div className="toast-container">
                {toasts.map((t) => (
                    <div key={t.id} className={`toast toast-${t.type}`}>
                        {icons[t.type]}
                        <span className="flex-1">{t.message}</span>
                        <button
                            onClick={() => remove(t.id)}
                            className="opacity-60 hover:opacity-100 transition-opacity ml-2"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error("useToast must be used within ToastProvider");
    return ctx;
}
