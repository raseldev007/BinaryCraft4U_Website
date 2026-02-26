"use client";

import { useState } from "react";
import { Building, Plug, AlertTriangle, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toast";

export default function AdminSettingsPage() {
    const [isSaving, setIsSaving] = useState(false);

    const [siteName, setSiteName] = useState("Binary Craft");
    const [siteEmail, setSiteEmail] = useState("raseloffcial89@gmail.com");
    const [sitePhone, setSitePhone] = useState("01569150874");
    const { success } = useToast();

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => {
            success("System parameters updated successfully.");
            setIsSaving(false);
        }, 1000);
    };

    return (
        <div className="animate-fadeIn">
            <div className="mb-10">
                <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-2">Platform Configuration</h1>
                <p className="text-sm font-medium text-text-muted">Manage global system parameters and integration protocols</p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {/* Entity Identification */}
                <div className="glass-panel border border-border rounded-xl p-6 md:p-8 shadow-xl flex flex-col">
                    <h2 className="text-xl font-black flex items-center gap-3 mb-6 text-text-primary">
                        <Building className="w-5 h-5 text-primary" /> Entity Identification
                    </h2>

                    <div className="space-y-6 flex-1">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-text-secondary mb-2 uppercase tracking-widest">Platform Designation</label>
                                <Input
                                    value={siteName}
                                    onChange={e => setSiteName(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-text-secondary mb-2 uppercase tracking-widest">Primary Uplink (Email)</label>
                                <Input
                                    type="email"
                                    value={siteEmail}
                                    onChange={e => setSiteEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-text-secondary mb-2 uppercase tracking-widest">Support Frequency (Phone)</label>
                            <Input
                                value={sitePhone}
                                onChange={e => setSitePhone(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-border flex justify-end shrink-0">
                        <Button onClick={handleSave} isLoading={isSaving} className="shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                            <Save className="w-4 h-4 mr-2" /> Apply Modifications
                        </Button>
                    </div>
                </div>

                {/* Integrations */}
                <div className="glass-panel border border-border rounded-xl p-6 md:p-8 shadow-xl flex flex-col">
                    <h2 className="text-xl font-black flex items-center gap-3 mb-6 text-text-primary">
                        <Plug className="w-5 h-5 text-primary" /> Secure Integrations
                    </h2>

                    <div className="bg-warning/10 border border-warning/20 rounded-xl p-4 mb-6 flex gap-4 items-start">
                        <AlertTriangle className="w-6 h-6 text-warning shrink-0" />
                        <div>
                            <div className="font-bold text-warning mb-1">Pending Protocol</div>
                            <div className="text-sm text-warning/80 leading-relaxed">
                                Stripe payment infrastructure is currently offline for this sector.
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-xs font-bold text-text-secondary mb-2 uppercase tracking-widest">Stripe Public Vector</label>
                            <Input
                                placeholder="pk_test_************************"
                                disabled
                                className="opacity-50 cursor-not-allowed bg-black/20"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-text-secondary mb-2 uppercase tracking-widest">Stripe Private Vector</label>
                            <Input
                                placeholder="sk_test_************************"
                                disabled
                                className="opacity-50 cursor-not-allowed bg-black/20"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
