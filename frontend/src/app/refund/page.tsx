"use client";

import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { RefreshCcw, CreditCard, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function RefundPage() {
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
                            <RefreshCcw className="w-3 h-3" />
                            Money Back Guarantee
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">
                            Refund <span className="gradient-text">Policy</span>
                        </h1>
                        <p className="text-text-muted text-lg max-w-2xl mx-auto">
                            We stand by the quality of our products. Here is how our refund process works.
                            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                        </p>
                    </div>
                </section>

                <section className="py-16">
                    <div className="max-w-3xl mx-auto px-6 prose prose-invert prose-blue">
                        <div className="glass-panel p-8 md:p-12 rounded-2xl border border-border shadow-xl">
                            <h2 className="text-2xl font-bold mb-4 text-white">1. Our 7-Day Guarantee</h2>
                            <p className="text-text-secondary leading-relaxed mb-4">
                                Binary Craft offers a comprehensive 7-day money-back guarantee on all digital products and eligible services. If you are not satisfied with your purchase, let us know within 7 days and we will issue a full refund.
                            </p>
                            <div className="bg-primary/10 border border-primary/20 rounded-xl p-5 mb-8 text-primary font-medium text-sm">
                                💡 Note: Refunds are processed back to the original payment method and may take 5-10 business days to appear on your statement.
                            </div>

                            <h2 className="text-2xl font-bold mb-4 text-white">2. Eligibility for Refunds</h2>
                            <p className="text-text-secondary leading-relaxed mb-4">
                                To be eligible for a refund, the following conditions must be met:
                            </p>
                            <ul className="list-disc pl-6 text-text-secondary mb-8 space-y-2">
                                <li>The request must be made within 7 days of the original purchase date.</li>
                                <li>The digital product must not have been extensively used, modified, or deployed to a live production environment.</li>
                                <li>For services, work must not have already commenced. If work has commenced, a partial refund may be issued based on the project's completion percentage.</li>
                            </ul>

                            <h2 className="text-2xl font-bold mb-4 text-white">3. Non-Refundable Items</h2>
                            <p className="text-text-secondary leading-relaxed mb-8">
                                Certain items are explicitly non-refundable. These include:
                                <br /><br />
                                • Custom development services where the initial milestone has been approved.<br />
                                • Domain name registrations and SSL certificates.<br />
                                • Products acquired during special promotional sales marked as "Final Sale".
                            </p>

                            <CreditCard className="w-12 h-12 text-primary/40 mx-auto my-8" />

                            <h2 className="text-2xl font-bold mb-4 text-white">4. How to Request a Refund</h2>
                            <p className="text-text-secondary leading-relaxed">
                                To request a refund, simply send an email to support@binarycraft4u.com with your order number and the reason for the request. Our team will review your request within 24 hours.
                            </p>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
