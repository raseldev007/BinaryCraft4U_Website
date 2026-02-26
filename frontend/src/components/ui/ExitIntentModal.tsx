"use client";

import { useEffect, useState } from "react";
import { X, Mail, ArrowRight } from "lucide-react";
import { Button } from "./Button";
import { Input } from "./Input";
import { useToast } from "./Toast";

export function ExitIntentModal() {
    const [isVisible, setIsVisible] = useState(false);
    const [email, setEmail] = useState("");
    const [hasDismissed, setHasDismissed] = useState(false);
    const { success } = useToast();

    useEffect(() => {
        // Only run check on client and if not already dismissed in this session
        const dismissed = sessionStorage.getItem("bc_exit_dismissed");
        if (dismissed) {
            setHasDismissed(true);
            return;
        }

        const handleMouseLeave = (e: MouseEvent) => {
            if (e.clientY <= 0 && !hasDismissed) {
                setIsVisible(true);
            }
        };

        document.addEventListener("mouseleave", handleMouseLeave);
        return () => document.removeEventListener("mouseleave", handleMouseLeave);
    }, [hasDismissed]);

    const handleDismiss = () => {
        setIsVisible(false);
        setHasDismissed(true);
        sessionStorage.setItem("bc_exit_dismissed", "true");
    };

    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        success("Success! Check your email for your 15% OFF code. 🎉");
        handleDismiss();
    };

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-bg-primary/80 backdrop-blur-sm animate-fadeIn">
            <div className="relative w-full max-w-lg overflow-hidden glass rounded-3xl shadow-2xl animate-fadeInUp">

                {/* Decorative Background */}
                <div className="absolute -top-32 -right-32 w-64 h-64 bg-primary/20 blur-3xl rounded-full" />
                <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-accent/20 blur-3xl rounded-full" />

                <button
                    onClick={handleDismiss}
                    className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/5 text-text-muted hover:text-white hover:bg-white/10 transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>

                <div className="p-8 md:p-10 relative z-10 flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white mb-6 shadow-lg shadow-primary/20">
                        <Mail className="w-8 h-8" />
                    </div>

                    <h2 className="text-2xl md:text-3xl font-black mb-3 leading-tight tracking-tight">
                        Leaving so soon?
                    </h2>

                    <p className="text-text-secondary mb-8">
                        Get <span className="text-white font-bold bg-white/10 px-2 py-0.5 rounded text-sm mx-1">15% OFF</span> your first service or digital product. Drop your email below!
                    </p>

                    <form onSubmit={handleSubscribe} className="w-full space-y-4">
                        <Input
                            type="email"
                            placeholder="Enter your email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="bg-bg-primary/50 h-12 text-center"
                        />
                        <Button variant="gradient" className="w-full h-12 shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)]">
                            Claim My 15% OFF <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </form>

                    <button onClick={handleDismiss} className="mt-6 text-xs text-text-muted hover:text-white transition-colors">
                        No thanks, I prefer paying full price
                    </button>
                </div>

            </div>
        </div>
    );
}
