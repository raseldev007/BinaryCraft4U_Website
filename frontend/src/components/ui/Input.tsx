import { cn } from "@/lib/utils";
import React from "react";

export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    icon?: React.ReactNode;
    floatingLabel?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, icon, floatingLabel, ...props }, ref) => {
        const isFloating = !!floatingLabel;

        return (
            <div className="relative group">
                <input
                    type={type}
                    className={cn(
                        "w-full bg-bg-primary border border-border text-text-primary transition-all duration-300 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary",
                        isFloating
                            ? "peer rounded-xl placeholder-transparent pt-6 pb-2 focus:bg-white/[0.02]"
                            : "rounded-lg placeholder:text-text-muted py-3.5",
                        icon ? "pl-11 pr-4" : "px-4",
                        className
                    )}
                    placeholder={floatingLabel || props.placeholder}
                    ref={ref}
                    {...props}
                />

                {floatingLabel && (
                    <label className={cn(
                        "absolute text-[13px] text-text-muted transition-all duration-300 transform -translate-y-2.5 scale-[0.85] top-4 z-10 origin-[0] pointer-events-none",
                        icon ? "left-11" : "left-4",
                        "peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-[15px]",
                        "peer-focus:scale-[0.85] peer-focus:-translate-y-2.5 peer-focus:text-primary",
                    )}>
                        {floatingLabel}
                    </label>
                )}

                {icon && (
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors duration-300 pointer-events-none">
                        {icon}
                    </div>
                )}
            </div>
        );
    }
);
Input.displayName = "Input";

export { Input };
