"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Mail, MessageSquare, Send, User, Phone, MapPin, Clock, CheckCircle2 } from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/components/ui/Toast";
import { useState } from "react";

export default function ContactPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const { success, error } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await api("/contact", "POST", { name, email, subject, message });
            setSent(true);
            success("Message sent! We'll get back to you within 24 hours.");
            setName(""); setEmail(""); setSubject(""); setMessage("");
        } catch (err: any) {
            error(err.message || "Failed to send message. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />

            <main className="flex-1 pt-20">
                {/* Hero */}
                <section className="relative pt-24 pb-16 bg-bg-secondary/30 border-b border-border text-center overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.08),transparent_60%)]" />
                    <div className="max-w-2xl mx-auto px-6 relative z-10 animate-fadeInUp">
                        <div className="section-label mb-5 mx-auto">
                            <MessageSquare className="w-3 h-3" />
                            Contact Us
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black mb-4">
                            Get in{" "}
                            <span className="gradient-text">Touch</span>
                        </h1>
                        <p className="text-text-muted text-lg leading-relaxed">
                            Have a project in mind? Need support? Our team responds within 24 hours.
                        </p>
                    </div>
                </section>

                <section className="py-20">
                    <div className="max-w-[1100px] mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-10">
                        {/* Contact Info */}
                        <div className="animate-slideInLeft">
                            <div className="glass-panel p-8 rounded-2xl sticky top-28">
                                <h3 className="text-2xl font-bold mb-8">Contact Information</h3>
                                <div className="space-y-6">
                                    {[
                                        { Icon: Mail, label: "Email", value: "raseloffcial89@gmail.com", sub: "Reply within 24 hours" },
                                        { Icon: Phone, label: "Phone / WhatsApp", value: "01569150874", sub: "Mon–Sat, 9AM–8PM" },
                                        { Icon: MapPin, label: "Location", value: "Dhaka, Bangladesh", sub: "Remote-first, serving globally" },
                                    ].map(({ Icon, label, value, sub }) => (
                                        <div key={label} className="flex items-start gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                                                <Icon className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <div className="text-xs font-bold text-text-muted uppercase tracking-wider mb-1">{label}</div>
                                                <div className="font-semibold text-white">{value}</div>
                                                <div className="text-sm text-text-muted mt-0.5">{sub}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-8 pt-8 border-t border-border">
                                    <h4 className="font-bold text-primary mb-4 flex items-center gap-2">
                                        <Clock className="w-4 h-4" /> Working Hours
                                    </h4>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-text-muted">Saturday – Thursday</span>
                                            <span className="text-success font-semibold">9AM – 8PM</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-text-muted">Friday</span>
                                            <span className="text-warning font-semibold">2PM – 6PM</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Form */}
                        <div className="glass-panel p-8 md:p-10 rounded-2xl shadow-2xl animate-slideInRight relative overflow-hidden">
                            <div className="absolute -top-12 -right-12 w-40 h-40 bg-primary/10 blur-3xl rounded-full" />
                            <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-accent/10 blur-3xl rounded-full" />

                            {sent ? (
                                <div className="flex flex-col items-center justify-center py-12 text-center relative z-10">
                                    <CheckCircle2 className="w-16 h-16 text-success mb-5" />
                                    <h3 className="text-2xl font-bold mb-3">Message Sent!</h3>
                                    <p className="text-text-muted mb-6">We'll get back to you within 24 hours.</p>
                                    <Button onClick={() => setSent(false)} variant="outline">
                                        Send Another Message
                                    </Button>
                                </div>
                            ) : (
                                <>
                                    <h3 className="text-2xl font-bold mb-2 flex items-center gap-2 relative z-10">
                                        Send a Message <Send className="w-5 h-5" />
                                    </h3>
                                    <p className="text-text-muted text-sm mb-8 relative z-10">
                                        Fill out the form and our team will get back to you shortly.
                                    </p>

                                    <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                            <div>
                                                <label className="block text-sm font-bold text-text-secondary mb-2">Full Name <span className="text-danger">*</span></label>
                                                <Input icon={<User className="w-5 h-5" />} placeholder="Md Rasel" value={name} onChange={(e) => setName(e.target.value)} required />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-text-secondary mb-2">Email <span className="text-danger">*</span></label>
                                                <Input type="email" icon={<Mail className="w-5 h-5" />} placeholder="you@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-text-secondary mb-2">Subject <span className="text-danger">*</span></label>
                                            <Input placeholder="How can we help?" value={subject} onChange={(e) => setSubject(e.target.value)} required />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-text-secondary mb-2">Message <span className="text-danger">*</span></label>
                                            <textarea
                                                className="w-full bg-bg-primary border border-border rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-300 p-4 min-h-[140px] resize-y"
                                                placeholder="Tell us about your project..."
                                                value={message}
                                                onChange={(e) => setMessage(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <Button type="submit" size="lg" className="w-full" isLoading={isLoading}>
                                            <Send className="w-5 h-5 mr-2" /> Send Message
                                        </Button>
                                    </form>
                                </>
                            )}
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
