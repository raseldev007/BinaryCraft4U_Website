"use client";

import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { FileText, Shield, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function TermsPage() {
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
                            <FileText className="w-3 h-3" />
                            Legal
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">
                            Terms of <span className="gradient-text">Service</span>
                        </h1>
                        <p className="text-text-muted text-lg max-w-2xl mx-auto">
                            Please read these terms carefully before using our platform.
                            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                        </p>
                    </div>
                </section>

                <section className="py-16">
                    <div className="max-w-3xl mx-auto px-6 prose prose-invert prose-blue">
                        <div className="glass-panel p-8 md:p-12 rounded-2xl border border-border shadow-xl">
                            <h2 className="text-2xl font-bold mb-4 text-white">1. Agreement to Terms</h2>
                            <p className="text-text-secondary leading-relaxed mb-8">
                                By accessing or using Binary Craft's services, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, then you may not access the service.
                            </p>

                            <h2 className="text-2xl font-bold mb-4 text-white">2. User Accounts</h2>
                            <p className="text-text-secondary leading-relaxed mb-4">
                                When you create an account with us, you must provide accurate, complete, and current information. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account.
                            </p>
                            <ul className="list-disc pl-6 text-text-secondary mb-8 space-y-2">
                                <li>You are responsible for safeguarding your password.</li>
                                <li>You agree not to disclose your password to any third party.</li>
                                <li>You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.</li>
                            </ul>

                            <h2 className="text-2xl font-bold mb-4 text-white">3. Intellectual Property</h2>
                            <p className="text-text-secondary leading-relaxed mb-8">
                                The Service and its original content, features, and functionality are and will remain the exclusive property of Binary Craft and its licensors. Our services are protected by copyright, trademark, and other laws.
                            </p>

                            <h2 className="text-2xl font-bold mb-4 text-white">4. Purchases & Payments</h2>
                            <p className="text-text-secondary leading-relaxed mb-8">
                                If you wish to purchase any product or service made available through the platform ("Purchase"), you may be asked to supply certain information relevant to your Purchase including, without limitation, your credit card number, the expiration date of your credit card, and your billing address.
                            </p>

                            <Shield className="w-12 h-12 text-primary/40 mx-auto my-8" />

                            <h2 className="text-2xl font-bold mb-4 text-white">5. Contact Us</h2>
                            <p className="text-text-secondary leading-relaxed">
                                If you have any questions about these Terms, please contact us at support@binarycraft4u.com.
                            </p>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
