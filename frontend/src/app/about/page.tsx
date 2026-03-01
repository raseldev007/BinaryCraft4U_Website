import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card } from "@/components/ui/Card";
import { Users, Target, Shield, Zap, Code2, Cpu, Globe, Award } from "lucide-react";

const TEAM = [
    {
        name: "Md Rasel",
        role: "Founder & CTO",
        bio: "Full-stack app developer (Flutter) and Prompt Engineer with a passion for building premium Mobile Apps and Websites. 2+ years of experience in App architecture, cloud infrastructure, UI/UX design, and API Integration.",
        avatar: "/rasel.jpg",
        skills: ["Flutter", "Dart", "API Integration", "CI/CD (Github Actions)", "Frontend Web", "HTML", "Tailwind CSS", "JavaScript"],
    },
];

const VALUES = [
    { icon: <Zap className="w-7 h-7" />, title: "Innovation", desc: "Constantly pushing the boundaries of what's possible with modern technology.", color: "text-yellow-400 bg-yellow-400/10" },
    { icon: <Shield className="w-7 h-7" />, title: "Quality", desc: "No compromises. Every line of code is crafted with precision and care.", color: "text-green-400 bg-green-400/10" },
    { icon: <Users className="w-7 h-7" />, title: "Community", desc: "Building a global network of empowered developers and businesses.", color: "text-blue-400 bg-blue-400/10" },
    { icon: <Target className="w-7 h-7" />, title: "Impact", desc: "Solutions that drive real, measurable results for your bottom line.", color: "text-purple-400 bg-purple-400/10" },
];

const TECH = [
    { label: "Next.js", color: "border-white/20 text-white" },
    { label: "React", color: "border-cyan-400/30 text-cyan-400" },
    { label: "Node.js", color: "border-green-400/30 text-green-400" },
    { label: "MongoDB", color: "border-green-500/30 text-green-500" },
    { label: "TypeScript", color: "border-blue-400/30 text-blue-400" },
    { label: "Tailwind CSS", color: "border-cyan-400/30 text-cyan-400" },
    { label: "AWS", color: "border-orange-400/30 text-orange-400" },
    { label: "Docker", color: "border-blue-500/30 text-blue-500" },
];

export default function AboutPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />

            <main className="flex-1 pt-20">
                {/* Hero */}
                <section className="relative pt-24 pb-16 bg-bg-secondary/30 border-b border-border text-center overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.08),transparent_60%)]" />
                    <div className="max-w-2xl mx-auto px-6 relative z-10 animate-fadeInUp">
                        <div className="section-label mb-5 mx-auto">
                            <Globe className="w-3 h-3" />
                            Our Story
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black mb-4">
                            Empowering the{" "}
                            <span className="gradient-text">Digital Future</span>
                        </h1>
                        <p className="text-text-muted text-lg leading-relaxed">
                            BinaryNexa is a premium IT solutions provider dedicated to helping businesses and professionals accelerate their digital transformation.
                        </p>
                    </div>
                </section>

                {/* Mission */}
                <section className="py-20">
                    <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-14 items-center">
                        <div className="animate-slideInLeft">
                            <div className="section-label mb-5">
                                <Target className="w-3 h-3" />
                                Our Mission
                            </div>
                            <h2 className="text-3xl font-bold mb-5">
                                Building Technology That{" "}
                                <span className="gradient-text">Actually Works</span>
                            </h2>
                            <p className="text-text-secondary leading-relaxed mb-4">
                                We believe that great software should be accessible, beautifully designed, and built to perform. Our mission is to bridge the gap between complex technology and intuitive user experiences.
                            </p>
                            <p className="text-text-secondary leading-relaxed">
                                Founded in 2026, BinaryNexa has quickly grown into a trusted marketplace and service provider, delivering enterprise-grade solutions with the agility and design sensibility of a modern startup.
                            </p>

                            <div className="grid grid-cols-3 gap-4 mt-8">
                                {[
                                    { num: "500+", label: "Products" },
                                    { num: "10K+", label: "Customers" },
                                    { num: "50+", label: "Countries" },
                                ].map((s) => (
                                    <div key={s.label} className="glass rounded-xl p-4 text-center">
                                        <div className="text-2xl font-black gradient-text">{s.num}</div>
                                        <div className="text-xs text-text-muted mt-1">{s.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="glass-panel p-2 rounded-2xl relative animate-slideInRight">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl blur-xl -z-10 scale-105" />
                            <img
                                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                                alt="Team collaborating"
                                className="rounded-xl shadow-2xl w-full h-72 object-cover"
                            />
                        </div>
                    </div>
                </section>

                {/* Values */}
                <section className="py-20 bg-bg-secondary/30 border-y border-border">
                    <div className="max-w-[1200px] mx-auto px-6">
                        <div className="text-center mb-12">
                            <div className="section-label mb-4 mx-auto">
                                <Award className="w-3 h-3" />
                                Our Values
                            </div>
                            <h2 className="text-3xl font-bold">What Drives Us</h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {VALUES.map((val, i) => (
                                <Card key={val.title} className="text-center animate-fadeInUp" style={{ animationDelay: `${i * 100}ms` }}>
                                    <div className={`w-14 h-14 rounded-2xl ${val.color} flex items-center justify-center mx-auto mb-4`}>
                                        {val.icon}
                                    </div>
                                    <h3 className="font-bold text-white text-lg mb-2">{val.title}</h3>
                                    <p className="text-text-muted text-sm leading-relaxed">{val.desc}</p>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Team */}
                <section className="py-20">
                    <div className="max-w-[1200px] mx-auto px-6">
                        <div className="text-center mb-12">
                            <div className="section-label mb-4 mx-auto">
                                <Users className="w-3 h-3" />
                                Meet the Team
                            </div>
                            <h2 className="text-3xl font-bold">The People Behind BinaryNexa</h2>
                        </div>
                        <div className="flex justify-center">
                            {TEAM.map((member) => (
                                <div key={member.name} className="glass-panel rounded-2xl p-8 max-w-md w-full text-center animate-fadeInUp hover:border-primary/30 transition-all">
                                    <div className="w-24 h-24 rounded-full overflow-hidden flex items-center justify-center text-white text-3xl font-black mx-auto mb-5 shadow-[0_0_30px_rgba(59,130,246,0.4)] border-2 border-primary/20">
                                        <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white">{member.name}</h3>
                                    <p className="text-primary font-semibold text-sm mt-1 mb-4">{member.role}</p>
                                    <p className="text-text-secondary text-sm leading-relaxed mb-5">{member.bio}</p>
                                    <div className="flex flex-wrap justify-center gap-2">
                                        {member.skills.map((skill) => (
                                            <span key={skill} className="text-[11px] px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 font-medium">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Tech Stack */}
                <section className="py-20 bg-bg-secondary/30 border-t border-border">
                    <div className="max-w-[1200px] mx-auto px-6 text-center">
                        <div className="section-label mb-5 mx-auto">
                            <Code2 className="w-3 h-3" />
                            Tech Stack
                        </div>
                        <h2 className="text-2xl font-bold mb-3">Built With the Best Tools</h2>
                        <p className="text-text-muted mb-10">We only use battle-tested, modern technologies in our products and services.</p>
                        <div className="flex flex-wrap justify-center gap-3">
                            {TECH.map((tech) => (
                                <span key={tech.label} className={`px-4 py-2 rounded-xl border font-semibold text-sm ${tech.color} bg-white/3 hover:scale-105 transition-transform cursor-default`}>
                                    {tech.label}
                                </span>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
