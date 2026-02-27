"use client";

import { useEffect, useRef, useCallback } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export function ProgressBar() {
    const progressRef = useRef<HTMLDivElement>(null);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const startProgress = useCallback(() => {
        const el = progressRef.current;
        if (!el) return;
        el.style.width = "0%";
        el.style.opacity = "1";
        el.style.transition = "width 0.4s ease";
        setTimeout(() => { if (el) el.style.width = "70%"; }, 50);
    }, []);

    const finishProgress = useCallback(() => {
        const el = progressRef.current;
        if (!el) return;
        el.style.width = "100%";
        timerRef.current = setTimeout(() => {
            if (el) {
                el.style.opacity = "0";
                el.style.width = "0%";
                el.style.transition = "opacity 0.3s ease";
            }
        }, 300);
    }, []);

    useEffect(() => {
        startProgress();
        timerRef.current = setTimeout(finishProgress, 100);
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [pathname, searchParams, startProgress, finishProgress]);

    return (
        <div
            ref={progressRef}
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                height: "3px",
                width: "0%",
                background: "linear-gradient(90deg, #3b82f6, #8b5cf6, #06b6d4)",
                zIndex: 99999,
                borderRadius: "0 2px 2px 0",
                boxShadow: "0 0 10px rgba(139, 92, 246, 0.6)",
                transition: "width 0.4s ease",
                opacity: 0,
            }}
        />
    );
}
