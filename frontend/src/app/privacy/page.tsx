"use client";

import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { ShieldCheck, Lock, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function PrivacyPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />

            <main className="flex-1 pt-20">
                <section className="relative pt-24 pb-16 bg-bg-secondary/30 border-b border-border text-center overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.08),transparent_60%)]" />
                    <div className="max-w-3xl mx-auto px-6 relative z-10 animate-fadeInUp">
                        <Link href="/">
                            <Button variant="ghost" size="sm" className="mb-6 -ml-4 text-text-muted hover:text-white">
                                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
                            </Button>
                        </Link>
                        <div className="section-label mb-5 mx-auto">
                            <ShieldCheck className="w-3 h-3" />
                            Security
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">
                            Privacy <span className="gradient-text">Policy</span>
                        </h1>
                        <p className="text-text-muted text-lg max-w-2xl mx-auto">
                            How we protect and manage your data. We take your privacy seriously.
                            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                        </p>
                    </div>
                </section>

                <section className="py-16">
                    <div className="max-w-3xl mx-auto px-6 prose prose-invert prose-blue">
                        <div className="glass-panel p-8 md:p-12 rounded-2xl border border-border shadow-xl">
                            <h2 className="text-2xl font-bold mb-4 text-white">1. Information We Collect</h2>
                            <p className="text-text-secondary leading-relaxed mb-4">
                                BinaryNexa collects information to provide better services to our users. We collect information in the following ways:
                            </p>
                            <ul className="list-disc pl-6 text-text-secondary mb-8 space-y-2">
                                <li><strong>Information you give us.</strong> For example, our services require you to sign up for an account. When you do, we'll ask for personal information, like your name, email address, and telephone number.</li>
                                <li><strong>Information we get from your use of our services.</strong> We collect information about the services that you use and how you use them.</li>
                                <li><strong>Payment Information.</strong> When making purchases, secure payment information is handled by our third-party payment processors (e.g., SSLCommerz, Stripe) and is not stored on our servers.</li>
                            </ul>

                            <h2 className="text-2xl font-bold mb-4 text-white">2. How We Use Information</h2>
                            <p className="text-text-secondary leading-relaxed mb-8">
                                We use the information we collect from all of our services to provide, maintain, protect and improve them, to develop new ones, and to protect BinaryNexa and our users. We also use this information to offer you tailored content – like giving you more relevant search results and ads.
                            </p>

                            <h2 className="text-2xl font-bold mb-4 text-white">3. Information We Share</h2>
                            <p className="text-text-secondary leading-relaxed mb-8">
                                We do not share personal information with companies, organizations and individuals outside of BinaryNexa unless one of the following circumstances applies:
                                <br /><br />
                                • With your consent.<br />
                                • For external processing (trusted businesses or persons to process it for us).<br />
                                • For legal reasons (meet any applicable law, regulation, legal process or enforceable governmental request).
                            </p>

                            <Lock className="w-12 h-12 text-primary/40 mx-auto my-8" />

                            <h2 className="text-2xl font-bold mb-4 text-white">4. Data Security</h2>
                            <p className="text-text-secondary leading-relaxed">
                                We work hard to protect BinaryNexa and our users from unauthorized access to or unauthorized alteration, disclosure or destruction of information we hold. In particular: We encrypt many of our services using SSL.
                            </p>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
