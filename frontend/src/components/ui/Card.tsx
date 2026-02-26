import { cn } from "@/lib/utils";
import React from "react";

export function Card({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn(
                "glass rounded-xl p-6 transition-all duration-300 hover:border-primary hover:-translate-y-1 hover:shadow-[0_4px_20px_rgba(59,130,246,0.15)]",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}
