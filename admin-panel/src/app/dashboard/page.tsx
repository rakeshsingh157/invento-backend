"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Download, LogOut, Users, Search, RefreshCw, Trash2 } from "lucide-react";

interface Member {
    name: string;
    email: string;
    phone: string;
}

interface Team {
    _id: string;
    team_name: string;
    college_name: string;
    leader: Member;
    member2?: Member;
    member3?: Member;
    member4?: Member;
    member5?: Member;
    idea?: string;
    gameName?: string;
    status: string;
    registeredAt: string;
}

export default function DashboardPage() {
    const router = useRouter();
    const [teams, setTeams] = useState<Team[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [error, setError] = useState("");

    const fetchTeams = async () => {
        setLoading(true);
        setError("");
        const token = localStorage.getItem("adminToken");

        if (!token) {
            router.push("/login");
            return;
        }

        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
            const res = await fetch(`${API_URL}/api/teams`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();

            if (data.success) {
                setTeams(data.data);
            } else {
                if (res.status === 401) {
                    localStorage.removeItem("adminToken");
                    router.push("/login");
                } else {
                    setError(data.message || "Failed to fetch teams");
                }
            }
        } catch (err) {
            setError("Failed to connect to server");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTeams();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminUser");
        router.push("/login");
    };

    const exportToCSV = () => {
        if (teams.length === 0) return;

        const headers = [
            "Team Name",
            "College",
            "Status",
            "Registration Date",
            "Leader Name", "Leader Email", "Leader Phone",
            "Member 2 Name", "Member 2 Email", "Member 2 Phone",
            "Member 3 Name", "Member 3 Email", "Member 3 Phone",
            "Member 4 Name", "Member 4 Email", "Member 4 Phone",
            "Member 5 Name", "Member 5 Email", "Member 5 Phone",
            "Project Idea",
            "Game Name"
        ];

        const csvRows = [headers.join(",")];

        teams.forEach(team => {
            const row = [
                `"${team.team_name.replace(/"/g, '""')}"`,
                `"${(team.college_name || "").replace(/"/g, '""')}"`,
                `"${team.status || "registered"}"`,
                `"${new Date(team.registeredAt).toLocaleDateString()}"`,

                // Leader
                `"${team.leader.name}"`, `"${team.leader.email}"`, `"${team.leader.phone}"`,

                // Members (2-5)
                `"${team.member2?.name || ""}"`, `"${team.member2?.email || ""}"`, `"${team.member2?.phone || ""}"`,
                `"${team.member3?.name || ""}"`, `"${team.member3?.email || ""}"`, `"${team.member3?.phone || ""}"`,
                `"${team.member4?.name || ""}"`, `"${team.member4?.email || ""}"`, `"${team.member4?.phone || ""}"`,
                `"${team.member5?.name || ""}"`, `"${team.member5?.email || ""}"`, `"${team.member5?.phone || ""}"`,

                // Extra
                `"${(team.idea || "").replace(/"/g, '""')}"`,
                `"${(team.gameName || "").replace(/"/g, '""')}"`
            ];
            csvRows.push(row.join(","));
        });

        const csvString = csvRows.join("\n");
        const blob = new Blob([csvString], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `invento-teams-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    const filteredTeams = teams.filter(team =>
        team.team_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        team.leader.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-yellow-50 font-sans text-gray-900 pb-8">
            {/* Navbar */}
            <nav className="bg-white border-b-4 border-black p-4 sticky top-0 z-20 shadow-sm">
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-brand-pink border-2 border-black flex items-center justify-center text-white font-bold text-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                A
                            </div>
                            <h1 className="font-display text-2xl uppercase tracking-wide">Invento Admin</h1>
                        </div>

                        {/* Mobile Logout (Icon only) */}
                        <button
                            onClick={handleLogout}
                            className="sm:hidden p-2 border-2 border-black bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                            aria-label="Logout"
                        >
                            <LogOut size={20} />
                        </button>
                    </div>

                    <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                        <span className="font-bold text-sm bg-gray-100 px-3 py-1 border border-black rounded-full">
                            Teams: {teams.length}
                        </span>
                        {/* Desktop Logout */}
                        <button
                            onClick={handleLogout}
                            className="hidden sm:flex px-4 py-2 border-2 border-black bg-red-100 hover:bg-red-200 font-bold items-center gap-2 transition-colors box-shadow-card active:translate-y-1 active:shadow-none"
                        >
                            <LogOut size={18} /> Logout
                        </button>
                    </div>
                </div>
            </nav>

            <main className="p-4 md:p-8 max-w-7xl mx-auto">
                {/* Header & Actions */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-8 gap-6">
                    <div>
                        <h2 className="font-display text-3xl md:text-4xl mb-2">Registered Teams</h2>
                        <p className="text-gray-600 font-bold text-sm md:text-base">Manage and export team data.</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                        <div className="relative w-full sm:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search teams..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border-2 border-black focus:outline-none focus:border-brand-pink focus:ring-1 focus:ring-brand-pink font-mono transition-all"
                            />
                        </div>

                        <div className="flex gap-3 w-full sm:w-auto">
                            <button
                                onClick={fetchTeams}
                                className="flex-1 sm:flex-none px-4 py-2 border-2 border-black bg-white hover:bg-gray-100 font-bold flex items-center justify-center gap-2 transition-colors box-shadow-card active:translate-y-1 active:shadow-none"
                            >
                                <RefreshCw size={18} /> <span className="sm:hidden lg:inline">Refresh</span>
                            </button>

                            <button
                                onClick={exportToCSV}
                                className="flex-1 sm:flex-none px-6 py-2 border-2 border-black bg-brand-yellow hover:bg-yellow-400 font-bold flex items-center justify-center gap-2 transition-colors box-shadow-card active:translate-y-1 active:shadow-none"
                            >
                                <Download size={18} /> <span className="sm:hidden lg:inline">Export</span><span className="hidden sm:inline lg:hidden">CSV</span>
                            </button>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 text-sm font-bold flex items-center gap-2">
                        <span className="text-xl">!</span> {error}
                    </div>
                )}

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-brand-pink"></div>
                    </div>
                ) : (
                    <>
                        {/* Desktop Table View */}
                        <div className="hidden md:block overflow-x-auto border-2 border-black bg-white box-shadow-retro">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-100 border-b-2 border-black font-display tracking-wider text-sm uppercase">
                                        <th className="p-4 border-r-2 border-black">Team Name</th>
                                        <th className="p-4 border-r-2 border-black">College</th>
                                        <th className="p-4 border-r-2 border-black">Leader</th>
                                        <th className="p-4 border-r-2 border-black">Members</th>
                                        <th className="p-4 border-r-2 border-black">Saved At</th>
                                        <th className="p-4">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="font-mono text-sm">
                                    {filteredTeams.length > 0 ? filteredTeams.map((team) => (
                                        <tr key={team._id} className="border-b border-gray-200 hover:bg-yellow-50 transition-colors">
                                            <td className="p-4 border-r border-gray-200 font-bold text-brand-pink">
                                                {team.team_name}
                                            </td>
                                            <td className="p-4 border-r border-gray-200 max-w-50 truncate" title={team.college_name}>
                                                {team.college_name || "N/A"}
                                            </td>
                                            <td className="p-4 border-r border-gray-200">
                                                <div className="font-bold">{team.leader.name}</div>
                                                <div className="text-xs text-gray-500">{team.leader.email}</div>
                                                <div className="text-xs text-gray-500">{team.leader.phone}</div>
                                            </td>
                                            <td className="p-4 border-r border-gray-200">
                                                <div className="flex items-center gap-1">
                                                    <Users size={14} className="text-gray-400" />
                                                    <span>{(team.member5 ? 5 : team.member4 ? 4 : team.member3 ? 3 : team.member2 ? 2 : 1)} / 5</span>
                                                </div>
                                            </td>
                                            <td className="p-4 border-r border-gray-200">
                                                {new Date(team.registeredAt).toLocaleDateString()}
                                            </td>
                                            <td className="p-4">
                                                <span className={`inline-block px-2 py-1 rounded-full text-xs font-bold border border-black ${team.status === 'registered' ? 'bg-green-100 text-green-800' : 'bg-gray-100'}`}>
                                                    {team.status.toUpperCase()}
                                                </span>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={6} className="p-8 text-center text-gray-500 font-bold">
                                                No teams found matching your search.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Card View */}
                        <div className="md:hidden space-y-4">
                            {filteredTeams.length > 0 ? filteredTeams.map((team) => (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    key={team._id}
                                    className="bg-white border-2 border-black p-4 box-shadow-card"
                                >
                                    <div className="flex justify-between items-start mb-3 border-b-2 border-gray-100 pb-2">
                                        <div>
                                            <h3 className="font-display text-xl text-brand-pink">{team.team_name}</h3>
                                            <p className="text-xs text-gray-500 font-mono truncate max-w-50">{team.college_name || "No College"}</p>
                                        </div>
                                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold border border-black uppercase ${team.status === 'registered' ? 'bg-green-100 text-green-800' : 'bg-gray-100'}`}>
                                            {team.status}
                                        </span>
                                    </div>

                                    <div className="space-y-3 text-sm">
                                        <div className="bg-gray-50 p-2 rounded border border-gray-200">
                                            <p className="font-bold text-xs uppercase text-gray-400 mb-1">Team Leader</p>
                                            <p className="font-bold">{team.leader.name}</p>
                                            <p className="font-mono text-xs text-gray-600 break-all">{team.leader.email}</p>
                                            <p className="font-mono text-xs text-gray-600">{team.leader.phone}</p>
                                        </div>

                                        <div className="flex justify-between items-center text-xs font-bold text-gray-500">
                                            <div className="flex items-center gap-1">
                                                <Users size={14} />
                                                <span>Members: {(team.member5 ? 5 : team.member4 ? 4 : team.member3 ? 3 : team.member2 ? 2 : 1)}</span>
                                            </div>
                                            <div className="font-mono">
                                                {new Date(team.registeredAt).toLocaleDateString()}
                                            </div>
                                        </div>

                                        {/* Collapsible details could go here, but for now simple view is better */}
                                    </div>
                                </motion.div>
                            )) : (
                                <div className="text-center p-8 bg-white border-2 border-black border-dashed text-gray-500 font-bold">
                                    No teams found.
                                </div>
                            )}
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}
