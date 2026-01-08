"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, Mail, ArrowRight, AlertCircle } from "lucide-react";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            // Try port 5000 first, then 3000 if needed (or just assume 5000 as per my plan)
            // I'll stick to a hardcoded logic or env var if I could.
            // For now, let's assume valid API is at http://localhost:5000 based on standard Express practices when Next is on 3000.
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

            const res = await fetch(`${API_URL}/api/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (data.success) {
                localStorage.setItem("adminToken", data.data.token);
                localStorage.setItem("adminUser", JSON.stringify(data.data.admin));
                router.push("/dashboard");
            } else {
                setError(data.message || "Login failed");
            }
        } catch (err) {
            setError("Failed to connect to server. Is the backend running?");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-yellow-50 p-4 font-sans">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md bg-white p-6 md:p-8 border-4 border-black box-shadow-retro"
            >
                <div className="text-center mb-8">
                    <h1 className="font-display text-4xl mb-2 uppercase tracking-wide text-brand-pink text-shadow">
                        Admin Panel
                    </h1>
                    <p className="text-gray-600 font-bold">Secure Access Only</p>
                </div>

                {error && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 flex items-center gap-2">
                        <AlertCircle size={20} />
                        <p>{error}</p>
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold mb-2 uppercase tracking-wider">
                            Email Address
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 border-2 border-black focus:outline-none focus:border-brand-pink focus:ring-1 focus:ring-brand-pink transition-colors font-mono"
                                placeholder="admin@invento.com"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold mb-2 uppercase tracking-wider">
                            Password
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 border-2 border-black focus:outline-none focus:border-brand-pink focus:ring-1 focus:ring-brand-pink transition-colors font-mono"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={loading}
                        className={`w-full bg-brand-pink text-white font-display text-xl py-4 border-2 border-black box-shadow-card flex items-center justify-center gap-2 hover:bg-pink-500 transition-colors ${loading ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                    >
                        {loading ? "AUTHENTICATING..." : "ENTER SYSTEM"}
                        {!loading && <ArrowRight size={24} />}
                    </motion.button>
                </form>
            </motion.div>
        </div>
    );
}
