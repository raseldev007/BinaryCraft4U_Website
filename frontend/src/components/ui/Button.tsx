import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import React from "react";

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "outline" | "danger" | "ghost" | "gradient";
    size?: "sm" | "md" | "lg" | "icon";
    isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    (
        { className, variant = "primary", size = "md", isLoading, children, disabled, ...props },
        ref
    ) => {
        const variants = {
            primary: "bg-primary text-white hover:bg-primary-hover shadow-[0_0_15px_rgba(59,130,246,0.3)] hover:shadow-[0_0_25px_rgba(59,130,246,0.5)]",
            secondary: "bg-bg-secondary text-text-primary hover:bg-white/5 border border-border shadow-sm",
            outline: "bg-transparent text-primary border border-primary/50 hover:bg-primary hover:text-white hover:border-primary shadow-sm hover:shadow-[0_0_15px_rgba(59,130,246,0.2)]",
            danger: "bg-danger/90 text-white hover:bg-danger shadow-[0_0_15px_rgba(239,68,68,0.2)]",
            ghost: "bg-transparent text-text-secondary hover:text-white hover:bg-white/5",
            gradient: "bg-gradient-to-r from-primary via-accent to-neon-cyan text-white hover:opacity-90 shadow-[0_0_20px_rgba(139,92,246,0.4)] bg-[length:200%_auto] hover:bg-right transition-all duration-500",
        };

        const sizes = {
            sm: "px-4 py-2 text-sm",
            md: "px-6 py-3 text-base",
            lg: "px-8 py-4 text-lg",
            icon: "w-10 h-10 p-2",
        };

        return (
            <button
                ref={ref}
                disabled={disabled || isLoading}
                className={cn(
                    "inline-flex items-center justify-center rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]",
                    variants[variant],
                    sizes[size],
                    className
                )}
                {...props}
            >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {children}
            </button>
        );
    }
);
Button.displayName = "Button";

export { Button };
