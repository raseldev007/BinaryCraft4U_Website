"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Mail, RefreshCw, Reply, SatelliteDish } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface ContactMessage {
    _id: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    isRead: boolean;
    createdAt: string;
}

export default function AdminMessagesPage() {
    const [messages, setMessages] = useState<ContactMessage[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentMsgId, setCurrentMsgId] = useState<string | null>(null);

    const loadMessages = async () => {
        setIsLoading(true);
        try {
            const data = await api("/admin/messages");
            setMessages(data.messages || []);
        } catch (err: any) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadMessages();
    }, []);

    const activeMessage = messages.find(m => m._id === currentMsgId);

    const viewMessage = async (id: string) => {
        setCurrentMsgId(id);
        const msg = messages.find(m => m._id === id);
        if (!msg) return;

        if (!msg.isRead) {
            try {
                await api(`/admin/messages/${id}/read`, "PUT");
                setMessages(messages.map(m => m._id === id ? { ...m, isRead: true } : m));
            } catch (err) {
                console.error("Failed to mark message as read", err);
            }
        }
    };

    return (
        <div className="animate-fadeIn h-[calc(100vh-140px)] flex flex-col">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 shrink-0">
                <div>
                    <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-2">Correspondence Hub</h1>
                    <p className="text-sm font-medium text-text-muted">Manage intercepted communications and technical inquiries</p>
                </div>
                <Button onClick={loadMessages} variant="outline" className="shrink-0" isLoading={isLoading}>
                    <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} /> Synchronize
                </Button>
            </div>

            <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
                {/* List Pane */}
                <div className={`lg:w-[400px] shrink-0 flex flex-col glass-panel border border-border rounded-xl overflow-hidden shadow-xl ${currentMsgId ? 'hidden lg:flex' : 'flex'}`}>
                    <div className="p-5 border-b border-border/50 bg-white/[0.02] text-xs font-bold uppercase tracking-widest text-text-muted shrink-0">
                        Signal Stream
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        {isLoading ? (
                            Array(6).fill(0).map((_, i) => (
                                <div key={i} className="p-5 border-b border-border/50">
                                    <div className="flex justify-between mb-2">
                                        <div className="h-3 w-20 bg-white/5 rounded animate-pulse" />
                                        <div className="h-3 w-10 bg-white/5 rounded animate-pulse" />
                                    </div>
                                    <div className="h-4 w-48 bg-white/5 rounded mb-2 animate-pulse" />
                                    <div className="h-3 w-full bg-white/5 rounded mb-1 animate-pulse" />
                                    <div className="h-3 w-[60%] bg-white/5 rounded animate-pulse" />
                                </div>
                            ))
                        ) : messages.length === 0 ? (
                            <div className="p-10 text-center text-text-muted text-sm font-medium">
                                No signal detected. Inbox empty.
                            </div>
                        ) : (
                            messages.map((m) => (
                                <button
                                    key={m._id}
                                    onClick={() => viewMessage(m._id)}
                                    className={`w-full text-left p-5 border-b border-border/50 transition-all relative outline-none flex flex-col gap-2 ${m._id === currentMsgId
                                        ? 'bg-primary/5 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-primary before:shadow-[0_0_10px_var(--primary)]'
                                        : 'hover:bg-white/[0.02]'
                                        }`}
                                >
                                    <div className="flex justify-between items-center text-[11px] font-bold text-text-muted w-full">
                                        <span className="truncate pr-2">{m.name.toUpperCase()}</span>
                                        <span className="shrink-0">{new Date(m.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                                    </div>
                                    <div className={`text-sm font-bold w-full truncate ${!m.isRead ? 'text-primary' : 'text-text-primary'}`}>
                                        {m.subject}
                                    </div>
                                    <div className="text-xs text-text-muted line-clamp-2 leading-relaxed">
                                        {m.message}
                                    </div>
                                </button>
                            ))
                        )}
                    </div>
                </div>

                {/* View Pane */}
                <div className={`flex-1 flex flex-col glass-panel border border-border rounded-xl overflow-hidden shadow-xl ${!currentMsgId ? 'hidden lg:flex' : 'flex'}`}>
                    {!activeMessage ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-center p-8 opacity-50 space-y-4">
                            <SatelliteDish className="w-20 h-20 text-primary opacity-50" />
                            <div className="text-xl font-black">No Uplink Established</div>
                            <p className="text-sm font-medium text-text-muted max-w-[260px]">
                                Select a transmission from the stream to initialize data link
                            </p>
                        </div>
                    ) : (
                        <>
                            {/* Mobile Back Button */}
                            <div className="lg:hidden p-4 border-b border-border/50 bg-white/[0.02]">
                                <Button variant="outline" size="sm" onClick={() => setCurrentMsgId(null)}>
                                    &larr; Back to Stream
                                </Button>
                            </div>

                            <div className="p-8 border-b border-border/50 bg-white/[0.01] shrink-0">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="text-xs font-medium text-text-muted">
                                        {new Date(activeMessage.createdAt).toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })}
                                    </div>
                                    {!activeMessage.isRead && (
                                        <span className="text-[10px] font-black uppercase tracking-widest bg-primary text-black px-2 py-0.5 rounded-full shadow-[0_0_10px_rgba(0,212,255,0.3)]">
                                            Unread
                                        </span>
                                    )}
                                </div>
                                <h2 className="text-2xl md:text-3xl font-black text-text-primary mb-6">
                                    {activeMessage.subject}
                                </h2>

                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center font-black text-white text-xl shadow-[0_4px_10px_rgba(0,212,255,0.2)] shrink-0">
                                        {activeMessage.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <div className="text-base font-bold text-text-primary">{activeMessage.name}</div>
                                        <div className="text-sm text-text-muted">{activeMessage.email}</div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 p-8 overflow-y-auto custom-scrollbar text-text-secondary text-sm md:text-base leading-relaxed whitespace-pre-wrap">
                                {activeMessage.message}
                            </div>

                            <div className="p-6 md:p-8 border-t border-border bg-black/20 flex justify-end shrink-0">
                                <a
                                    href={`mailto:${activeMessage.email}?subject=Re: ${encodeURIComponent(activeMessage.subject)}`}
                                    className="shadow-[0_0_15px_rgba(59,130,246,0.2)] inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                                >
                                    <Reply className="w-4 h-4 mr-2" /> Initialize Response
                                </a>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
