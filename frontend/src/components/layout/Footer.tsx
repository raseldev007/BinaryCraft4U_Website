import Link from "next/link";
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, ArrowRight, Zap } from "lucide-react";

const FOOTER_LINKS = {
    "Quick Links": [
        { href: "/", label: "Home" },
        { href: "/services", label: "Services" },
        { href: "/products", label: "Products" },
        { href: "/about", label: "About Us" },
        { href: "/blog", label: "Blog" },
    ],
    "Legal": [
        { href: "/terms", label: "Terms of Service" },
        { href: "/privacy", label: "Privacy Policy" },
        { href: "/refund", label: "Refund Policy" },
        { href: "/contact", label: "Contact Support" },
    ],
};

const SOCIALS = [
    { Icon: Facebook, href: "#" },
    { Icon: Twitter, href: "#" },
    { Icon: Instagram, href: "#" },
    { Icon: Linkedin, href: "#" },
];

export function Footer() {
    return (
        <footer className="mt-24 border-t border-border bg-bg-primary relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(59,130,246,0.04),transparent_60%)]" />

            {/* Newsletter Row */}
            <div className="border-b border-border">
                <div className="max-w-[1400px] mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                        <h4 className="text-lg font-bold mb-1 flex items-center gap-2">
                            <Zap className="w-5 h-5 text-primary" /> Stay in the Loop
                        </h4>
                        <p className="text-text-muted text-sm">Get the latest products, updates, and insights delivered to your inbox.</p>
                    </div>
                    <div className="flex w-full md:w-auto gap-2 max-w-sm">
                        <input
                            type="email"
                            placeholder="your@email.com"
                            className="flex-1 h-11 bg-bg-secondary border border-border rounded-lg px-4 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors"
                        />
                        <button className="h-11 px-5 bg-primary text-white rounded-lg font-semibold text-sm hover:bg-primary-hover transition-colors flex items-center gap-1.5 shrink-0">
                            Subscribe <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-[1400px] mx-auto px-6 pt-14 pb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* Brand */}
                    <div>
                        <Link href="/" className="flex items-center gap-3 mb-5 group">
                            <img
                                src="/logo.png"
                                alt="Binary Craft Logo"
                                className="w-12 h-12 object-contain drop-shadow-[0_0_15px_rgba(59,130,246,0.3)] group-hover:drop-shadow-[0_0_30px_rgba(59,130,246,0.5)] transition-all duration-300"
                            />
                            <span className="font-bold text-xl tracking-tight text-white group-hover:text-primary transition-colors">Binary Craft</span>
                        </Link>
                        <p className="text-text-muted text-sm leading-relaxed mb-6">
                            Transforming businesses globally with premium SaaS solutions. Built for scale, optimized for conversion.
                        </p>

                        {/* Trust Badges */}
                        <div className="flex flex-col gap-3 mb-6">
                            <div className="flex items-center gap-2 text-xs font-bold text-success/80 bg-success/10 w-fit px-3 py-1.5 rounded-full border border-success/20">
                                <Zap className="w-3.5 h-3.5" /> 99.9% Uptime SLA Guaranteed
                            </div>
                            <div className="flex gap-2 items-center">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Trusted by</span>
                                <div className="flex gap-1">
                                    <div className="h-6 px-2 bg-white/5 rounded text-[10px] font-bold text-white flex items-center border border-white/10">bKash</div>
                                    <div className="h-6 px-2 bg-white/5 rounded text-[10px] font-bold text-white flex items-center border border-white/10">Nagad</div>
                                    <div className="h-6 px-2 bg-white/5 rounded text-[10px] font-bold text-white flex items-center border border-white/10">SSLCommerz</div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            {SOCIALS.map(({ Icon, href }, i) => (
                                <a
                                    key={i}
                                    href={href}
                                    className="w-9 h-9 rounded-lg glass flex items-center justify-center text-text-muted hover:text-primary hover:border-primary/40 transition-all duration-200"
                                >
                                    <Icon className="w-4 h-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Link Columns */}
                    {Object.entries(FOOTER_LINKS).map(([title, links]) => (
                        <div key={title}>
                            <h4 className="font-bold text-white mb-5 text-sm uppercase tracking-wider">{title}</h4>
                            <ul className="space-y-3">
                                {links.map((link) => (
                                    <li key={link.href}>
                                        <Link
                                            href={link.href}
                                            className="text-text-muted hover:text-primary transition-colors text-sm flex items-center gap-1.5 group"
                                        >
                                            <span className="opacity-0 group-hover:opacity-100 transition-opacity text-primary">›</span>
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}

                    {/* Contact */}
                    <div>
                        <h4 className="font-bold text-white mb-5 text-sm uppercase tracking-wider">Contact</h4>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <MapPin className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                                <span className="text-text-muted text-sm">Dhaka, Bangladesh</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="w-4 h-4 text-primary shrink-0" />
                                <span className="text-text-muted text-sm">01569150874</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="w-4 h-4 text-primary shrink-0" />
                                <span className="text-text-muted text-sm">raseloffcial89@gmail.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-border flex justify-center text-xs text-text-muted">
                    <p className="text-center">© {new Date().getFullYear()} Binary Craft. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
