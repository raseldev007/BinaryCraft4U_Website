"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { User, MapPin, Lock, Save, Key } from "lucide-react";

export default function ProfilePage() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState("info");

    // Tab states
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [memberSince, setMemberSince] = useState("");

    const [address, setAddress] = useState({ street: "", city: "", state: "", zip: "", country: "BD" });

    const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });

    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ type: "error" | "success", text: string } | null>(null);

    useEffect(() => {
        // Read hash for tab
        if (typeof window !== "undefined" && window.location.hash === "#security") {
            setActiveTab("security");
        }

        const loadProfile = async () => {
            try {
                const data = await api("/users/profile");
                const u = data.user;
                setName(u.name || "");
                setPhone(u.phone || "");
                setEmail(u.email || "");
                setMemberSince(new Date(u.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }));

                if (u.address) {
                    setAddress({
                        street: u.address.street || "",
                        city: u.address.city || "",
                        state: u.address.state || "",
                        zip: u.address.zip || "",
                        country: u.address.country || "BD"
                    });
                }
            } catch (e) {
                if (user) {
                    setName(user.name);
                    setEmail(user.email);
                }
            }
        };
        loadProfile();
    }, [user]);

    const handleSaveInfo = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage(null);
        try {
            await api("/users/profile", "PUT", { name, phone });
            setMessage({ type: "success", text: "Profile updated successfully!" });
        } catch (err: any) {
            setMessage({ type: "error", text: err.message });
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveAddress = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage(null);
        try {
            await api("/users/profile", "PUT", { address });
            setMessage({ type: "success", text: "Address saved!" });
        } catch (err: any) {
            setMessage({ type: "error", text: err.message });
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (passwords.new !== passwords.confirm) {
            setMessage({ type: "error", text: "Passwords do not match" });
            return;
        }
        setIsLoading(true);
        setMessage(null);
        try {
            await api("/users/change-password", "PUT", { currentPassword: passwords.current, newPassword: passwords.new });
            setMessage({ type: "success", text: "Password updated successfully!" });
            setPasswords({ current: "", new: "", confirm: "" });
        } catch (err: any) {
            setMessage({ type: "error", text: err.message });
        } finally {
            setIsLoading(false);
        }
    };

    const initial = name ? name.charAt(0).toUpperCase() : (user?.name?.charAt(0).toUpperCase() || "?");

    return (
        <div className="animate-fadeIn">
            <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-2">My Profile</h1>
                <p className="text-text-muted">Manage your personal information and security settings.</p>
            </div>

            <div className="flex gap-2 p-1 bg-bg-secondary rounded-xl w-fit border border-border mb-10 overflow-x-auto max-w-full">
                <TabButton active={activeTab === "info"} onClick={() => { setActiveTab("info"); setMessage(null); }}>
                    <User className="w-4 h-4 mr-2" /> Personal Info
                </TabButton>
                <TabButton active={activeTab === "address"} onClick={() => { setActiveTab("address"); setMessage(null); }}>
                    <MapPin className="w-4 h-4 mr-2" /> Address
                </TabButton>
                <TabButton active={activeTab === "security"} onClick={() => { setActiveTab("security"); setMessage(null); }}>
                    <Lock className="w-4 h-4 mr-2" /> Security
                </TabButton>
            </div>

            <div className="max-w-3xl glass-panel border border-border rounded-2xl p-6 md:p-10 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10 -translate-y-1/2 translate-x-1/2" />

                {message && (
                    <div className={`mb-8 p-4 rounded-xl flex items-center gap-3 border text-sm font-medium animate-fadeIn ${message.type === "success"
                        ? "bg-success/10 border-success/30 text-success"
                        : "bg-danger/10 border-danger/30 text-danger"
                        }`}>
                        <span>{message.type === "success" ? "✅" : "❌"}</span>
                        {message.text}
                    </div>
                )}

                {/* Info Tab */}
                {activeTab === "info" && (
                    <div className="animate-fadeIn">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-10 pb-10 border-b border-border">
                            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center font-black text-white text-4xl shadow-[0_0_20px_rgba(59,130,246,0.4)] shrink-0">
                                {initial}
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold mb-1">{name || "..."}</h3>
                                <p className="text-text-muted">{email || "..."}</p>
                                <div className="mt-3 text-xs font-bold px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 w-fit">
                                    Member since {memberSince || "..."}
                                </div>
                            </div>
                        </div>

                        <form onSubmit={handleSaveInfo} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-text-secondary mb-2">Full Name</label>
                                    <Input
                                        value={name}
                                        onChange={e => setName(e.target.value)}
                                        placeholder="Your Name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-text-secondary mb-2">Phone Number</label>
                                    <Input
                                        type="tel"
                                        value={phone}
                                        onChange={e => setPhone(e.target.value)}
                                        placeholder="+880..."
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-text-secondary mb-2">Email Address (Read-only)</label>
                                <Input
                                    value={email}
                                    disabled
                                    className="opacity-60 cursor-not-allowed"
                                />
                            </div>

                            <div className="pt-4">
                                <Button type="submit" isLoading={isLoading} className="shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                                    <Save className="w-4 h-4 mr-2" /> Save Changes
                                </Button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Address Tab */}
                {activeTab === "address" && (
                    <div className="animate-fadeIn">
                        <h3 className="text-xl font-bold mb-8 flex items-center gap-3">
                            <MapPin className="text-primary w-6 h-6" /> Shipping Address
                        </h3>

                        <form onSubmit={handleSaveAddress} className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-text-secondary mb-2">Street Address</label>
                                <Input
                                    value={address.street}
                                    onChange={e => setAddress({ ...address, street: e.target.value })}
                                    placeholder="House no, street name..."
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-text-secondary mb-2">City</label>
                                    <Input
                                        value={address.city}
                                        onChange={e => setAddress({ ...address, city: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-text-secondary mb-2">State / Division</label>
                                    <Input
                                        value={address.state}
                                        onChange={e => setAddress({ ...address, state: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-text-secondary mb-2">ZIP Code</label>
                                    <Input
                                        value={address.zip}
                                        onChange={e => setAddress({ ...address, zip: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-text-secondary mb-2">Country</label>
                                    <select
                                        className="w-full bg-bg-primary border border-border rounded-lg text-text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary h-12 px-4 transition-all duration-300"
                                        value={address.country}
                                        onChange={e => setAddress({ ...address, country: e.target.value })}
                                    >
                                        <option value="BD">Bangladesh</option>
                                        <option value="US">United States</option>
                                        <option value="GB">United Kingdom</option>
                                        <option value="IN">India</option>
                                        <option value="CA">Canada</option>
                                        <option value="AU">Australia</option>
                                    </select>
                                </div>
                            </div>

                            <div className="pt-4">
                                <Button type="submit" isLoading={isLoading} className="shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                                    <Save className="w-4 h-4 mr-2" /> Save Address
                                </Button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Security Tab */}
                {activeTab === "security" && (
                    <div className="animate-fadeIn">
                        <h3 className="text-xl font-bold mb-8 flex items-center gap-3">
                            <Lock className="text-primary w-6 h-6" /> Change Password
                        </h3>

                        <form onSubmit={handleUpdatePassword} className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-text-secondary mb-2">Current Password</label>
                                <Input
                                    type="password"
                                    value={passwords.current}
                                    onChange={e => setPasswords({ ...passwords, current: e.target.value })}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-text-secondary mb-2">New Password</label>
                                <Input
                                    type="password"
                                    value={passwords.new}
                                    onChange={e => setPasswords({ ...passwords, new: e.target.value })}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-text-secondary mb-2">Confirm New Password</label>
                                <Input
                                    type="password"
                                    value={passwords.confirm}
                                    onChange={e => setPasswords({ ...passwords, confirm: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="pt-4">
                                <Button type="submit" isLoading={isLoading} className="shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                                    <Key className="w-4 h-4 mr-2" /> Update Password
                                </Button>
                            </div>
                        </form>
                    </div>
                )}

            </div>
        </div>
    );
}

// Subcomponents
function TabButton({ children, active, onClick }: { children: React.ReactNode, active: boolean, onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center whitespace-nowrap ${active
                ? "bg-bg-card text-primary shadow-sm border border-border"
                : "text-text-muted hover:text-white"
                }`}
        >
            {children}
        </button>
    );
}
