"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Mail, Lock, Eye, EyeOff, LogIn, ShieldCheck, CheckCircle2, ArrowRight } from "lucide-react";
import { useToast } from "@/components/ui/Toast";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const { login, isAuthenticated } = useAuth();
    const router = useRouter();
    const { info, success } = useToast();

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

    const handleSimulatedSocialAuth = async (provider: string) => {
        setIsLoading(true);
        setError("");
        try {
            success(`Simulating ${provider} login...`);

            // 1. Check if the user exists
            const resData = await api("/users/profile").catch(() => null);

            if (!resData || !resData.user) {
                // If not logged in or profile failed, auto-login with test acc
                const testEmail = "raseloffcial89@gmail.com";
                const testPass = "password";
                const loginRes = await api("/auth/login", "POST", { email: testEmail, password: testPass });
                login(loginRes.token, loginRes.user);
            }
            // If the user *is* already logged in, the push to dashboard handles it gracefully.

            router.push('/dashboard');
            success(`Successfully authenticated with ${provider}`);
        } catch (err: any) {
            setError(err.message || `Failed to authenticate with ${provider}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!email || !password) {
            setError("Please fill in all fields");
            return;
        }

        setIsLoading(true);

        try {
            const data = await api("/auth/login", "POST", { email, password });

            setIsSuccess(true);
            setTimeout(() => {
                login(data.token, data.user);
                const searchParams = new URLSearchParams(window.location.search);
                const redirect = searchParams.get("redirect");

                if (redirect) {
                    router.push(redirect);
                } else if (data.user.role === "admin") {
                    router.push("/admin");
                } else {
                    router.push("/dashboard");
                }
            }, 800); // Wait for success animation
        } catch (err: any) {
            setError(err.message || "Failed to sign in");
            setIsLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-bg-primary">
                <div className="text-center animate-fadeInUp">
                    <div className="w-20 h-20 rounded-full bg-success/20 flex items-center justify-center text-success mx-auto mb-6 shadow-[0_0_40px_rgba(34,197,94,0.3)]">
                        <CheckCircle2 className="w-10 h-10" />
                    </div>
                    <h2 className="text-2xl font-black text-white mb-2 tracking-tight">Authentication Successful</h2>
                    <p className="text-text-muted">Securely redirecting to your workspace...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col relative bg-bg-primary items-center justify-center p-6 overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-noise opacity-[0.03] pointer-events-none mix-blend-overlay z-0" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[rgba(59,130,246,0.06)] rounded-full blur-[120px] pointer-events-none z-0 animate-pulse" style={{ animationDuration: '4s' }} />

            {/* Floating particles */}
            <div className="absolute top-[20%] left-[15%] w-2 h-2 rounded-full bg-primary/30 blur-[1px] animate-float opacity-50 z-0" />
            <div className="absolute top-[70%] right-[15%] w-3 h-3 rounded-full bg-accent/30 blur-[2px] animate-float opacity-50 z-0" style={{ animationDelay: '2s' }} />

            {/* Basic Nav to go back */}
            <nav className="absolute top-0 w-full p-6 flex justify-between items-center z-20">
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center font-black text-white text-lg shadow-[0_0_15px_rgba(59,130,246,0.3)] group-hover:scale-110 transition-transform duration-300 relative">
                        <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                        BC
                    </div>
                </Link>
                <Link href="/register">
                    <Button variant="outline" size="sm" className="backdrop-blur-md bg-white/5 hover:bg-white/10 border-white/10">Create Account</Button>
                </Link>
            </nav>

            <div className="w-full max-w-[440px] glass border border-white/10 rounded-[28px] p-8 md:p-10 relative z-10 shadow-[0_20px_80px_-20px_rgba(0,0,0,0.8)] backdrop-blur-2xl animate-fadeInUp group mt-10 md:mt-0">
                <div className="text-center mb-8">
                    <div className="relative inline-block mb-6">
                        <div className="absolute inset-0 bg-primary/40 blur-2xl rounded-full scale-[1.5]" />
                        <div className="w-14 h-14 relative bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center font-black text-white text-2xl shadow-inner border border-white/20">
                            BC
                        </div>
                    </div>
                    <h2 className="text-3xl font-black tracking-tight mb-2 text-white relative inline-block">
                        Welcome Back
                        <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
                    </h2>
                    <p className="text-text-muted text-[15px] mt-2">Sign in to your Binary Craft workspace</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 rounded-xl bg-danger/10 border border-danger/20 text-danger text-sm flex items-start gap-3 animate-fadeIn">
                        <span className="font-bold text-lg leading-none mt-0.5">⊗</span>
                        <span className="font-medium">{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        type="email"
                        floatingLabel="Email Address"
                        icon={<Mail className="w-5 h-5" />}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        autoComplete="email"
                    />

                    <div>
                        <div className="flex justify-end items-center mb-1.5 px-1">
                            <Link href="/forgot-password" className="text-[13px] text-text-muted hover:text-primary transition-colors font-medium">
                                Forgot password?
                            </Link>
                        </div>
                        <div className="relative">
                            <Input
                                type={showPassword ? "text" : "password"}
                                floatingLabel="Password"
                                icon={<Lock className="w-5 h-5" />}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                autoComplete="current-password"
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
                        {capsLock && (
                            <div className="text-[11px] font-bold text-warning mt-1.5 flex items-center gap-1.5 px-1 animate-fadeIn">
                                <span className="w-1.5 h-1.5 rounded-full bg-warning animate-pulse" /> Caps Lock is ON
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-2 px-1 pb-1 pt-1">
                        <input type="checkbox" id="remember" className="w-4 h-4 rounded border-border bg-bg-primary/50 text-primary focus:ring-primary focus:ring-offset-bg-secondary accent-primary cursor-pointer" />
                        <label htmlFor="remember" className="text-sm text-text-muted cursor-pointer font-medium select-none">Remember for 30 days</label>
                    </div>

                    <Button
                        type="submit"
                        size="lg"
                        variant="gradient"
                        className="w-full mt-2 shadow-[0_8px_30px_-4px_rgba(59,130,246,0.3)] hover:shadow-[0_12px_40px_-4px_rgba(59,130,246,0.5)] group relative overflow-hidden"
                        isLoading={isLoading}
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer" />
                        <span className="relative z-10 flex items-center justify-center font-bold text-[15px]">
                            {isLoading ? "Authenticating..." : (
                                <>Sign In <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" /></>
                            )}
                        </span>
                    </Button>
                </form>

                <div className="flex items-center gap-4 my-7">
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent to-border"></div>
                    <span className="text-text-muted text-[11px] uppercase tracking-widest font-black">or</span>
                    <div className="flex-1 h-px bg-gradient-to-l from-transparent to-border"></div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" className="w-full bg-white/5 hover:bg-[#EA4335]/10 hover:text-[#EA4335] border-white/5 hover:border-[#EA4335]/30 transition-all group" onClick={() => handleSimulatedSocialAuth("Google")}>
                        <i className="fab fa-google mr-2 text-text-muted group-hover:text-[#EA4335] transition-colors"></i>
                        <span className="text-sm font-semibold">Google</span>
                    </Button>
                    <Button variant="outline" className="w-full bg-white/5 hover:bg-[#1877F2]/10 hover:text-[#1877F2] border-white/5 hover:border-[#1877F2]/30 transition-all group" onClick={() => handleSimulatedSocialAuth("Facebook")}>
                        <i className="fab fa-facebook-f mr-2 text-text-muted group-hover:text-[#1877F2] transition-colors"></i>
                        <span className="text-sm font-semibold">Facebook</span>
                    </Button>
                </div>

                {/* Trust Signals */}
                <div className="mt-8 pt-6 border-t border-white/5 text-center flex flex-col items-center gap-2">
                    <p className="flex items-center justify-center gap-1.5 text-[12px] font-medium text-text-muted">
                        <ShieldCheck className="w-4 h-4 text-success" />
                        Your data is encrypted and secure
                    </p>
                    <div className="text-[10px] text-text-muted/50 font-black tracking-widest uppercase mt-0.5">
                        Trusted by 10,000+ Teams
                    </div>
                </div>
            </div>

            <p className="text-center text-[15px] font-medium text-text-muted mt-8 mb-4 relative z-10 hidden sm:block">
                Don't have an account? <Link href="/register" className="text-white relative inline-block group ml-1">
                    Create one free
                    <span className="absolute -bottom-1 left-0 w-0 h-px bg-white group-hover:w-full transition-all duration-300" />
                </Link>
            </p>
        </div>
    );
}
