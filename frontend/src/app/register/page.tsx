"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Mail, Lock, Eye, EyeOff, UserPlus, User, ShieldCheck, CheckCircle2, ArrowRight } from "lucide-react";

export default function RegisterPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const { login, isAuthenticated } = useAuth();
    const router = useRouter();

    // Check caps lock
    const [capsLock, setCapsLock] = useState(false);
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            setCapsLock(e.getModifierState("CapsLock"));
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    useEffect(() => {
        if (isAuthenticated) {
            router.push("/dashboard");
        }
    }, [isAuthenticated, router]);

    // Live Validation State
    const hasMinLength = password.length >= 8;
    const hasUpperLower = /[A-Z]/.test(password) && /[a-z]/.test(password);
    const hasNumberSpecial = /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password);
    const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword;
    const isFormValid = hasMinLength && hasUpperLower && hasNumberSpecial && passwordsMatch && name.length >= 2 && email.includes("@");

    const checkStrength = (val: string) => {
        let score = 0;
        if (val.length >= 8) score++;
        if (/[A-Z]/.test(val) && /[a-z]/.test(val)) score++;
        if (/[0-9]/.test(val)) score++;
        if (/[^A-Za-z0-9]/.test(val)) score++;

        const levels = [
            { width: "0%", color: "transparent", label: "" },
            { width: "25%", color: "#ef4444", label: "Weak" },
            { width: "50%", color: "#f97316", label: "Fair" },
            { width: "75%", color: "#eab308", label: "Good" },
            { width: "100%", color: "#10b981", label: "Strong" },
        ];
        return levels[Math.min(score, 4)];
    };

    const strength = checkStrength(password);

    const handleSimulatedSocialAuth = async (provider: string) => {
        setIsLoading(true);
        setError("");
        try {
            // Check if user exists, if not auto-login with test acc
            const resData = await api("/users/profile").catch(() => null);
            if (!resData || !resData.user) {
                const testEmail = "raseloffcial89@gmail.com";
                const testPass = "password";
                const loginRes = await api("/auth/login", "POST", { email: testEmail, password: testPass });
                login(loginRes.token, loginRes.user);
            }
            router.push('/dashboard');
        } catch (err: any) {
            setError(err.message || `Failed to authenticate with ${provider}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!isFormValid) {
            setError("Please fulfill all password requirements.");
            return;
        }

        setIsLoading(true);

        try {
            const data = await api("/auth/register", "POST", { name, email, password });

            setSuccess(true);
            setTimeout(() => {
                login(data.token, data.user);
                router.push("/dashboard");
            }, 1000);
        } catch (err: any) {
            setError(err.message || "Failed to create account");
            setIsLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-bg-primary">
                <div className="text-center animate-fadeInUp">
                    <div className="w-20 h-20 rounded-full bg-success/20 flex items-center justify-center text-success mx-auto mb-6 shadow-[0_0_40px_rgba(34,197,94,0.3)]">
                        <CheckCircle2 className="w-10 h-10" />
                    </div>
                    <h2 className="text-3xl font-black text-white mb-3 tracking-tight">Account Created!</h2>
                    <p className="text-text-muted text-lg">Setting up your Binary Craft workspace...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col relative bg-bg-primary items-center justify-center p-6 py-12 md:py-20 overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-noise opacity-[0.03] pointer-events-none mix-blend-overlay z-0" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[140px] pointer-events-none z-0" />
            <div className="absolute top-[20%] right-[15%] w-4 h-4 rounded-full bg-primary/30 blur-[2px] animate-float opacity-40 z-0" />
            <div className="absolute bottom-[20%] left-[15%] w-2 h-2 rounded-full bg-accent/40 blur-[1px] animate-float opacity-60 z-0" style={{ animationDelay: '1.5s' }} />

            {/* Basic Nav */}
            <nav className="absolute top-0 w-full p-6 flex justify-between items-center z-20 hidden md:flex">
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center font-black text-white text-lg shadow-[0_0_15px_rgba(59,130,246,0.3)] group-hover:scale-110 transition-transform duration-300 relative">
                        <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                        BC
                    </div>
                </Link>
                <Link href="/login">
                    <Button variant="outline" size="sm" className="backdrop-blur-md bg-white/5 hover:bg-white/10 border-white/10">Sign In instead</Button>
                </Link>
            </nav>

            <div className="w-full max-w-[500px] glass border border-white/10 rounded-3xl p-8 md:p-10 relative z-10 shadow-[0_20px_80px_-20px_rgba(0,0,0,0.8)] backdrop-blur-2xl animate-fadeInUp group mt-8 md:mt-0">
                <div className="absolute inset-0 -z-10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-[radial-gradient(circle_at_var(--mouse-x,_50%)_var(--mouse-y,_50%),_rgba(255,255,255,0.04),_transparent_40%)] pointer-events-none" />

                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary text-[10px] uppercase font-black tracking-widest px-3 py-1 rounded-full mb-6 relative overflow-hidden">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                        Takes less than 30 seconds
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-shimmer" style={{ animationDuration: '3s' }} />
                    </div>
                    <h2 className="text-3xl font-black tracking-tight mb-2 text-white relative inline-block">
                        Create Account
                        <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
                    </h2>
                    <p className="text-text-muted text-[15px] mt-2">Join Binary Craft and unlock premium IT solutions.</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 rounded-xl bg-danger/10 border border-danger/20 text-danger text-sm flex items-start gap-3 animate-fadeIn">
                        <span className="font-bold text-lg leading-none mt-0.5">⊗</span>
                        <span className="font-medium">{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4 text-left">
                    <Input
                        type="text"
                        floatingLabel="Full Name"
                        icon={<User className="w-5 h-5" />}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        autoComplete="name"
                    />

                    <Input
                        type="email"
                        floatingLabel="Work Email Address"
                        icon={<Mail className="w-5 h-5" />}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        autoComplete="email"
                    />

                    <div>
                        <div className="relative">
                            <Input
                                type={showPassword ? "text" : "password"}
                                floatingLabel="Create Password"
                                icon={<Lock className="w-5 h-5" />}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                autoComplete="new-password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-white transition-colors p-1"
                                tabIndex={-1}
                            >
                                {showPassword ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
                            </button>
                        </div>
                        {password.length > 0 && (
                            <div className="mt-3 px-1 animate-fadeIn">
                                <div className="h-1.5 w-full bg-border rounded-full overflow-hidden flex gap-0.5">
                                    <div className="h-full rounded-l-full transition-all duration-300" style={{ width: strength.width, backgroundColor: strength.color }} />
                                    <div className="flex-1 bg-transparent" />
                                </div>
                                <div className="grid grid-cols-2 gap-2 mt-3 pl-1">
                                    <div className={`text-[11px] font-medium flex items-center gap-1.5 transition-colors duration-300 ${hasMinLength ? 'text-success' : 'text-text-muted'}`}>
                                        <CheckCircle2 className="w-3.5 h-3.5" /> 8+ characters
                                    </div>
                                    <div className={`text-[11px] font-medium flex items-center gap-1.5 transition-colors duration-300 ${hasUpperLower ? 'text-success' : 'text-text-muted'}`}>
                                        <CheckCircle2 className="w-3.5 h-3.5" /> Uppercase & lowercase
                                    </div>
                                    <div className={`text-[11px] font-medium flex items-center gap-1.5 transition-colors duration-300 ${hasNumberSpecial ? 'text-success' : 'text-text-muted'}`}>
                                        <CheckCircle2 className="w-3.5 h-3.5" /> Number & symbol
                                    </div>
                                </div>
                            </div>
                        )}
                        {capsLock && (
                            <div className="text-[11px] font-bold text-warning mt-2 flex items-center gap-1.5 px-1 animate-fadeIn">
                                <span className="w-1.5 h-1.5 rounded-full bg-warning animate-pulse" /> Caps Lock is ON
                            </div>
                        )}
                    </div>

                    <div className="relative pt-2">
                        <Input
                            type={showConfirmPassword ? "text" : "password"}
                            floatingLabel="Confirm Password"
                            icon={<Lock className="w-5 h-5" />}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            autoComplete="new-password"
                            className={confirmPassword.length > 0 && passwordsMatch ? "border-success/50 focus:border-success focus:ring-success/30" : ""}
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-white transition-colors p-1"
                            tabIndex={-1}
                        >
                            {showConfirmPassword ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
                        </button>
                    </div>

                    <Button
                        type="submit"
                        size="lg"
                        variant="gradient"
                        className="w-full mt-4 shadow-[0_8px_30px_-4px_rgba(59,130,246,0.4)] hover:shadow-[0_12px_40px_-4px_rgba(59,130,246,0.6)] group relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                        isLoading={isLoading}
                        disabled={!isFormValid || isLoading}
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer" />
                        <span className="relative z-10 flex items-center justify-center font-bold text-[15px]">
                            {isLoading ? "Setting up workspace..." : (
                                <>Create Free Account <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" /></>
                            )}
                        </span>
                    </Button>
                </form>

                <p className="text-[13px] text-text-muted/80 text-center mt-6 leading-relaxed px-4">
                    By confirming, you agree to our <Link href="/terms" className="text-white hover:text-primary transition-colors underline decoration-border underline-offset-4">Terms</Link> and <Link href="/privacy" className="text-white hover:text-primary transition-colors underline decoration-border underline-offset-4">Privacy Policy</Link>.
                </p>

                {/* Trust Signals */}
                <div className="mt-6 pt-6 border-t border-white/5 flex flex-col items-center gap-3">
                    <p className="flex items-center justify-center gap-1.5 text-[11px] font-bold text-text-muted">
                        <ShieldCheck className="w-3.5 h-3.5 text-success" />
                        Your information is securely encrypted
                    </p>
                    <div className="flex items-center justify-center gap-4 text-[10px] font-semibold text-text-muted/60 uppercase tracking-wider">
                        <span>No spam</span>
                        <span className="w-1 h-1 rounded-full bg-border" />
                        <span>No hidden fees</span>
                        <span className="w-1 h-1 rounded-full bg-border" />
                        <span>Cancel anytime</span>
                    </div>
                </div>
            </div>

            <p className="text-center text-[15px] font-medium text-text-muted mt-8 mb-4 relative z-10 hidden sm:block">
                Already have an account? <Link href="/login" className="text-white relative inline-block group ml-1">
                    Sign in here
                    <span className="absolute -bottom-1 left-0 w-0 h-px bg-white group-hover:w-full transition-all duration-300" />
                </Link>
            </p>
        </div>
    );
}
