"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ProductGrid } from "@/components/products/ProductGrid";
import { ServiceGrid } from "@/components/services/ServiceGrid";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import {
  ArrowRight,
  Zap,
  Shield,
  HeadphonesIcon,
  Globe,
  Lock,
  Rocket,
  Star,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

function CountUp({ end, suffix = "", duration = 2000 }: { end: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = Date.now();
          const tick = () => {
            const elapsed = Date.now() - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.round(eased * end));
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration]);

  return (
    <div ref={ref} className="text-3xl md:text-4xl font-black text-white">
      {count.toLocaleString()}
      {suffix}
    </div>
  );
}

const FEATURES = [
  { icon: <Zap className="w-6 h-6" />, title: "Lightning Fast", desc: "Optimized for speed. All products are built for performance from day one.", color: "from-yellow-500/20 to-orange-500/10" },
  { icon: <Shield className="w-6 h-6" />, title: "Enterprise Security", desc: "Bank-grade encryption and security audits on all our solutions.", color: "from-green-500/20 to-emerald-500/10" },
  { icon: <HeadphonesIcon className="w-6 h-6" />, title: "24/7 Support", desc: "Our expert team is always available to assist you at any time.", color: "from-blue-500/20 to-cyan-500/10" },
  { icon: <Globe className="w-6 h-6" />, title: "Global Reach", desc: "Serving clients in 50+ countries with localized support and solutions.", color: "from-purple-500/20 to-violet-500/10" },
  { icon: <Lock className="w-6 h-6" />, title: "Privacy First", desc: "Your data is yours. We never sell or share your information.", color: "from-red-500/20 to-pink-500/10" },
  { icon: <Rocket className="w-6 h-6" />, title: "Rapid Deployment", desc: "From order to delivery in record time. We move as fast as you do.", color: "from-indigo-500/20 to-blue-500/10" },
];

const TESTIMONIALS = [
  {
    name: "Alex Morrison",
    role: "CTO, NovaTech Inc.",
    rating: 5,
    text: "BinaryNexa delivered exactly what we needed — a premium template that saved us weeks of work. The code quality is outstanding.",
    avatar: "AM",
  },
  {
    name: "Sarah Chen",
    role: "Founder, DesignStack",
    rating: 5,
    text: "I've tried many digital marketplaces, but BinaryNexa is in a league of its own. The support team is incredibly responsive.",
    avatar: "SC",
  },
  {
    name: "Marcus Wagner",
    role: "Senior Dev, CloudBridge",
    rating: 5,
    text: "The hosting service exceeded our expectations. 99.9% uptime for 6 months straight, and their support team is phenomenal.",
    avatar: "MW",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-bg-primary">
      <Navbar />

      <main className="flex-1">
        {/* =================== HERO =================== */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 mesh-bg">
          {/* Background Grid */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 parallax-grid opacity-30" />
            <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-transparent to-bg-primary/50" />

            {/* Orbs */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px] animate-orb-1" />
            <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-accent/15 rounded-full blur-[120px] animate-orb-2" />
          </div>

          <div className="max-w-5xl mx-auto px-6 text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/25 bg-primary/8 text-sm font-medium text-primary mb-8 animate-fadeInUp">
              <Sparkles className="w-4 h-4" />
              <span>Premium IT Solutions for Modern Teams</span>
              <ChevronRight className="w-4 h-4 opacity-60" />
            </div>

            {/* Headline */}
            <h1
              className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-8 leading-[1.05] animate-fadeInUp"
              style={{ animationDelay: "100ms" }}
            >
              Build{" "}
              <span className="relative inline-block">
                <span className="gradient-text">Smarter</span>
                <span className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-primary to-accent rounded-full opacity-50" />
              </span>
              ,<br />
              Ship Faster.
            </h1>

            {/* Subheadline */}
            <p
              className="text-lg md:text-xl text-text-muted mb-12 max-w-2xl mx-auto leading-relaxed animate-fadeInUp"
              style={{ animationDelay: "180ms" }}
            >
              Explore our curated marketplace of premium templates, hosting solutions,
              and digital services — designed to accelerate your workflow and impress
              your clients.
            </p>

            {/* CTAs */}
            <div
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fadeInUp"
              style={{ animationDelay: "260ms" }}
            >
              <Link href="#products">
                <Button
                  variant="gradient"
                  size="lg"
                  className="w-full sm:w-auto px-10 text-lg shadow-[0_0_30px_rgba(59,130,246,0.35)] hover:shadow-[0_0_50px_rgba(59,130,246,0.5)] hover:-translate-y-1 transition-all group"
                >
                  <Rocket className="w-5 h-5 mr-3 group-hover:animate-float" />
                  Explore Products
                </Button>
              </Link>
              <Link href="/services">
                <Button
                  variant="secondary"
                  size="lg"
                  className="w-full sm:w-auto group"
                >
                  View Services
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>

            {/* Social proof */}
            <div
              className="flex flex-wrap items-center justify-center gap-8 text-sm text-text-muted animate-fadeInUp"
              style={{ animationDelay: "340ms" }}
            >
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {["A", "B", "C", "D"].map((l, i) => (
                    <div
                      key={i}
                      className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-[10px] font-bold border-2 border-bg-primary"
                    >
                      {l}
                    </div>
                  ))}
                </div>
                <span>500+ happy clients in BD</span>
              </div>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-4 h-4 fill-warning text-warning" />
                ))}
                <span className="ml-1 font-bold text-white">4.9/5 rating</span>
              </div>
              <div className="flex items-center gap-1.5 font-bold text-success/90">
                <CheckCircle2 className="w-4 h-4" />
                <span>SSL Secured</span>
              </div>
            </div>
          </div>
        </section>

        {/* =================== MARQUEE LOGOS =================== */}
        <section className="py-10 border-b border-border bg-bg-secondary/20 overflow-hidden flex items-center opacity-60 hover:opacity-100 transition-opacity duration-500 hidden sm:flex">
          <div className="w-full inline-flex flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
            <ul className="flex items-center justify-center md:justify-start [&_li]:mx-8 [&_img]:max-w-none animate-infinite-scroll space-x-12 shrink-0">
              <li className="text-xl font-black text-white/50 grayscale hover:grayscale-0 transition-all flex items-center gap-2"><Zap className="w-6 h-6" /> TechCorp</li>
              <li className="text-xl font-black text-white/50 grayscale hover:grayscale-0 transition-all flex items-center gap-2"><Shield className="w-6 h-6" /> SecureNet</li>
              <li className="text-xl font-black text-white/50 grayscale hover:grayscale-0 transition-all flex items-center gap-2"><Users className="w-6 h-6" /> PeopleFirst</li>
              <li className="text-xl font-black text-white/50 grayscale hover:grayscale-0 transition-all flex items-center gap-2"><Rocket className="w-6 h-6" /> LaunchPad</li>
              <li className="text-xl font-black text-white/50 grayscale hover:grayscale-0 transition-all flex items-center gap-2"><Globe className="w-6 h-6" /> GlobalLogix</li>
            </ul>
            <ul className="flex items-center justify-center md:justify-start [&_li]:mx-8 [&_img]:max-w-none animate-infinite-scroll space-x-12 shrink-0" aria-hidden="true">
              <li className="text-xl font-black text-white/50 grayscale hover:grayscale-0 transition-all flex items-center gap-2"><Zap className="w-6 h-6" /> TechCorp</li>
              <li className="text-xl font-black text-white/50 grayscale hover:grayscale-0 transition-all flex items-center gap-2"><Shield className="w-6 h-6" /> SecureNet</li>
              <li className="text-xl font-black text-white/50 grayscale hover:grayscale-0 transition-all flex items-center gap-2"><Users className="w-6 h-6" /> PeopleFirst</li>
              <li className="text-xl font-black text-white/50 grayscale hover:grayscale-0 transition-all flex items-center gap-2"><Rocket className="w-6 h-6" /> LaunchPad</li>
              <li className="text-xl font-black text-white/50 grayscale hover:grayscale-0 transition-all flex items-center gap-2"><Globe className="w-6 h-6" /> GlobalLogix</li>
            </ul>
          </div>
        </section>

        {/* =================== STATS =================== */}
        <section className="py-16 border-y border-border relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/3 via-transparent to-accent/3" />
          <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: "Products Available", end: 500, suffix: "+" },
              { label: "Happy Customers", end: 10000, suffix: "+" },
              { label: "Uptime Guarantee", end: 99, suffix: ".9%" },
              { label: "Expert Support", end: 24, suffix: "/7" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <CountUp end={stat.end} suffix={stat.suffix} />
                <p className="text-text-muted text-sm mt-1 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* =================== PRODUCTS =================== */}
        <section id="products" className="py-24">
          <div className="max-w-[1400px] mx-auto px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
              <div>
                <div className="section-label mb-4">
                  <TrendingUp className="w-3 h-3" />
                  Marketplace
                </div>
                <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-3">
                  Featured Products
                </h2>
                <p className="text-text-muted max-w-md">
                  Premium digital goods built to the highest standards. Everything you need to ship faster.
                </p>
              </div>
              <Link href="/products">
                <Button variant="outline" className="group shrink-0">
                  Browse All Products
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
            <ProductGrid limit={6} />
          </div>
        </section>

        {/* =================== SERVICES TEASER =================== */}
        <section className="py-24 bg-bg-secondary/30 border-y border-border">
          <div className="max-w-[1400px] mx-auto px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
              <div>
                <div className="section-label mb-4">
                  <Zap className="w-3 h-3" />
                  Services
                </div>
                <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-3">
                  Professional IT Services
                </h2>
                <p className="text-text-muted max-w-md">
                  Expert development, design, and consulting services tailored to your business goals.
                </p>
              </div>
              <Link href="/services">
                <Button variant="outline" className="group shrink-0">
                  View All Services
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
            <ServiceGrid limit={3} />
          </div>
        </section>

        {/* =================== WHY US =================== */}
        <section className="py-24">
          <div className="max-w-[1400px] mx-auto px-6">
            <div className="text-center mb-16">
              <div className="section-label mb-4 mx-auto">
                <Shield className="w-3 h-3" />
                Why BinaryNexa
              </div>
              <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-4">
                Everything You Need, Nothing You Don't
              </h2>
              <p className="text-text-muted max-w-xl mx-auto">
                We obsess over every detail so you don't have to — from performance to security to design.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {FEATURES.map((feature, i) => (
                <div
                  key={feature.title}
                  className="feature-card p-7 animate-fadeInUp"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-primary mb-5`}>
                    {feature.icon}
                  </div>
                  <h3 className="font-bold text-white text-lg mb-2">{feature.title}</h3>
                  <p className="text-text-muted text-sm leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =================== TESTIMONIALS =================== */}
        <section className="py-24 bg-bg-secondary/30 border-y border-border">
          <div className="max-w-[1400px] mx-auto px-6">
            <div className="text-center mb-16">
              <div className="section-label mb-4 mx-auto">
                <Star className="w-3 h-3" />
                Testimonials
              </div>
              <h2 className="text-3xl md:text-4xl font-black tracking-tight">
                Loved by Developers Worldwide
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {TESTIMONIALS.map((t, i) => (
                <div
                  key={t.name}
                  className="glass-panel flex flex-col gap-6 relative group overflow-hidden rounded-3xl p-8 hover:-translate-y-2 transition-all duration-300 animate-fadeInUp shadow-lg"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  {/* Decorative background orb */}
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors" />

                  <div className="flex gap-1">
                    {Array(t.rating).fill(0).map((_, s) => (
                      <Star key={s} className="w-5 h-5 fill-warning text-warning drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
                    ))}
                  </div>
                  <p className="text-white font-medium text-lg leading-relaxed flex-1 italic relative z-10">
                    "{t.text}"
                  </p>
                  <div className="flex items-center gap-4 pt-6 border-t border-border/50">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-black text-lg shadow-[0_4px_10px_rgba(59,130,246,0.3)] border border-white/10 shrink-0">
                      {t.avatar}
                    </div>
                    <div>
                      <div className="font-black text-white text-base tracking-tight">{t.name}</div>
                      <div className="text-sm font-bold text-primary/80">{t.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =================== CTA BANNER =================== */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_50%_50%,rgba(59,130,246,0.08),transparent)]" />
          <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
            <div className="section-label mb-6 mx-auto">
              <Users className="w-3 h-3" />
              Get Started Today
            </div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-6">
              Ready to Build Something{" "}
              <span className="gradient-text">Amazing?</span>
            </h2>
            <p className="text-text-muted text-lg mb-10 leading-relaxed">
              Join thousands of developers and businesses who trust BinaryNexa
              to power their digital products.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register">
                <Button size="lg" className="shadow-[0_0_30px_rgba(59,130,246,0.35)] w-full sm:w-auto">
                  Start for Free — No Credit Card
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" size="lg" className="w-full sm:w-auto group">
                  Talk to Sales
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
