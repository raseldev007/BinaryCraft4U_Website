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
import { useGoogleLogin } from "@react-oauth/google";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const { login, isAuthenticated } = useAuth();
    const router = useRouter();
    const { success, error: toastError } = useToast();

    const [capsLock, setCapsLock] = useState(false);
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => setCapsLock(e.getModifierState("CapsLock"));
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    useEffect(() => {
        if (isAuthenticated) router.push("/dashboard");
    }, [isAuthenticated, router]);

    // Real Google OAuth
    const googleLogin = useGoogleLogin({
        flow: "auth-code",
        onSuccess: async (codeResponse) => {
            setIsLoading(true);
            setError("");
            try {
                // Exchange code for tokens via Google's token endpoint
                const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
                    method: "POST",
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    body: new URLSearchParams({
                        code: codeResponse.code,
                        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "",
                        client_secret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET || "",
                        redirect_uri: window.location.origin,
                        grant_type: "authorization_code",
                    }),
                });
                const tokenData = await tokenRes.json();
                if (!tokenData.id_token) throw new Error("Failed to get Google token");

                const data = await api("/auth/google", "POST", { credential: tokenData.id_token });
                setIsSuccess(true);
                setTimeout(() => {
                    login(data.token, data.user);
                    router.push(data.user.role === "admin" ? "/admin" : "/dashboard");
                }, 800);
                success("Signed in with Google!");
            } catch (err: any) {
                setError(err.message || "Google sign-in failed. Please try again.");
            } finally {
                setIsLoading(false);
            }
        },
        onError: () => {
            setError("Google sign-in was cancelled or failed.");
            setIsLoading(false);
        },
    });

    const handleGoogleLogin = () => {
        setError("");
        setIsLoading(true);
        googleLogin();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        if (!email || !password) { setError("Please fill in all fields"); return; }
        setIsLoading(true);
        try {
            const data = await api("/auth/login", "POST", { email, password });
            setIsSuccess(true);
            setTimeout(() => {
                login(data.token, data.user);
                const redirect = new URLSearchParams(window.location.search).get("redirect");
                if (redirect) router.push(redirect);
                else if (data.user.role === "admin") router.push("/admin");
                else router.push("/dashboard");
            }, 800);
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
            <div className="absolute inset-0 bg-noise opacity-[0.03] pointer-events-none mix-blend-overlay z-0" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[rgba(59,130,246,0.06)] rounded-full blur-[120px] pointer-events-none z-0 animate-pulse" style={{ animationDuration: '4s' }} />
            <div className="absolute top-[20%] left-[15%] w-2 h-2 rounded-full bg-primary/30 blur-[1px] animate-float opacity-50 z-0" />
            <div className="absolute top-[70%] right-[15%] w-3 h-3 rounded-full bg-accent/30 blur-[2px] animate-float opacity-50 z-0" style={{ animationDelay: '2s' }} />

            <nav className="absolute top-0 w-full p-6 flex justify-between items-center z-20">
                <Link href="/" className="flex items-center gap-3 group">
                    <img src="/logo.png" alt="Binary Craft Logo" className="w-12 h-12 object-contain drop-shadow-[0_0_15px_rgba(59,130,246,0.3)] group-hover:scale-110 transition-transform duration-300" />
                </Link>
                <Link href="/register">
                    <Button variant="outline" size="sm" className="backdrop-blur-md bg-white/5 hover:bg-white/10 border-white/10">Create Account</Button>
                </Link>
            </nav>

            <div className="w-full max-w-[440px] glass border border-white/10 rounded-[28px] p-8 md:p-10 relative z-10 shadow-[0_20px_80px_-20px_rgba(0,0,0,0.8)] backdrop-blur-2xl animate-fadeInUp group mt-10 md:mt-0 overflow-hidden">
                {/* Background Logo inside form */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 opacity-10">
                    <img src="/logo.png" alt="Background" className="w-[150%] max-w-[600px] h-auto object-contain -rotate-12 scale-[1.2] drop-shadow-2xl opacity-10 blur-[1px]" />
                </div>

                <div className="relative z-10">
                    <div className="text-center mb-8">
                        <div className="relative inline-block mb-6">
                            <div className="absolute inset-0 bg-primary/40 blur-2xl rounded-full scale-[1.5]" />
                            <img src="/logo.png" alt="Binary Craft Logo" className="w-16 h-16 relative object-contain drop-shadow-[0_0_15px_rgba(59,130,246,0.3)]" />
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

                    {/* Google Sign In */}
                    <button
                        type="button"
                        onClick={handleGoogleLogin}
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all duration-200 font-semibold text-white text-sm mb-6 disabled:opacity-50 disabled:cursor-not-allowed group"
                    >
                        <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                            <path fill="#EA4335" d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.27 0 3.198 2.698 1.24 6.65l4.026 3.115Z" />
                            <path fill="#34A853" d="M16.04 18.013c-1.09.703-2.474 1.078-4.04 1.078a7.077 7.077 0 0 1-6.723-4.823l-4.04 3.067A11.965 11.965 0 0 0 12 24c2.933 0 5.735-1.043 7.834-3l-3.793-2.987Z" />
                            <path fill="#4A90E2" d="M19.834 21c2.195-2.048 3.62-5.096 3.62-9 0-.71-.109-1.473-.272-2.182H12v4.637h6.436c-.317 1.559-1.17 2.766-2.395 3.558L19.834 21Z" />
                            <path fill="#FBBC05" d="M5.277 14.268A7.12 7.12 0 0 1 4.909 12c0-.782.125-1.533.357-2.235L1.24 6.65A11.934 11.934 0 0 0 0 12c0 1.92.445 3.73 1.237 5.335l4.04-3.067Z" />
                        </svg>
                        <span>{isLoading ? "Connecting..." : "Continue with Google"}</span>
                    </button>

                    <div className="flex items-center gap-4 mb-6">
                        <div className="flex-1 h-px bg-gradient-to-r from-transparent to-border"></div>
                        <span className="text-text-muted text-[11px] uppercase tracking-widest font-black">or sign in with email</span>
                        <div className="flex-1 h-px bg-gradient-to-l from-transparent to-border"></div>
                    </div>

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
                                <Link href="/forgot-password" className="text-[13px] text-text-muted hover:text-primary transition-colors font-medium">Forgot password?</Link>
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
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-white transition-colors p-1" tabIndex={-1}>
                                    {showPassword ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
                                </button>
                            </div>
                            {capsLock && (
                                <div className="text-[11px] font-bold text-warning mt-1.5 flex items-center gap-1.5 px-1 animate-fadeIn">
                                    <span className="w-1.5 h-1.5 rounded-full bg-warning animate-pulse" /> Caps Lock is ON
                                </div>
                            )}
                        </div>

                        <Button type="submit" size="lg" variant="gradient" className="w-full mt-2 shadow-[0_8px_30px_-4px_rgba(59,130,246,0.3)] hover:shadow-[0_12px_40px_-4px_rgba(59,130,246,0.5)] group relative overflow-hidden" isLoading={isLoading}>
                            <span className="relative z-10 flex items-center justify-center font-bold text-[15px]">
                                {isLoading ? "Authenticating..." : (<>Sign In <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" /></>)}
                            </span>
                        </Button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-white/5 text-center flex flex-col items-center gap-2">
                        <p className="flex items-center justify-center gap-1.5 text-[12px] font-medium text-text-muted">
                            <ShieldCheck className="w-4 h-4 text-success" />
                            Your data is encrypted and secure
                        </p>
                    </div>
                </div>
            </div>

            <p className="text-center text-[15px] font-medium text-text-muted mt-8 mb-4 relative z-10 hidden sm:block">
                Don't have an account?{" "}
                <Link href="/register" className="text-white relative inline-block group ml-1">
                    Create one free
                    <span className="absolute -bottom-1 left-0 w-0 h-px bg-white group-hover:w-full transition-all duration-300" />
                </Link>
            </p>
        </div>
    );
}
