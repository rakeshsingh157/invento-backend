"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Download, LogOut, Users, Search, RefreshCw, Trash2, Eye } from "lucide-react";

interface Member {
    name: string;
    email: string;
    phone: string;
    year?: string;
    class?: string;
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
    screenShot?: string;
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
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://invento-backend.vercel.app';
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
            "Game Name",
            "College",
            "Status",
            "Registration Date",
            "Leader Name", "Leader Email", "Leader Phone", "Leader Year", "Leader Class",
            "Member 2 Name", "Member 2 Email", "Member 2 Phone", "Member 2 Year", "Member 2 Class",
            "Member 3 Name", "Member 3 Email", "Member 3 Phone", "Member 3 Year", "Member 3 Class",
            "Member 4 Name", "Member 4 Email", "Member 4 Phone", "Member 4 Year", "Member 4 Class",
            "Member 5 Name", "Member 5 Email", "Member 5 Phone", "Member 5 Year", "Member 5 Class"
        ];

        const csvRows = [headers.join(",")];

        teams.forEach(team => {
            const row = [
                `"${team.team_name.replace(/"/g, '""')}"`,
                `"${(team.gameName || "").replace(/"/g, '""')}"`,
                `"${(team.college_name || "").replace(/"/g, '""')}"`,
                `"${team.status || "registered"}"`,
                `"${new Date(team.registeredAt).toLocaleDateString()}"`,

                // Leader
                `"${team.leader.name}"`,
                `"${team.leader.email}"`,
                `"${team.leader.phone}"`,
                `"${team.leader.year || ""}"`,
                `"${team.leader.class || ""}"`,

                // Members (2-5)
                `"${team.member2?.name || ""}"`, `"${team.member2?.email || ""}"`, `"${team.member2?.phone || ""}"`, `"${team.member2?.year || ""}"`, `"${team.member2?.class || ""}"`,
                `"${team.member3?.name || ""}"`, `"${team.member3?.email || ""}"`, `"${team.member3?.phone || ""}"`, `"${team.member3?.year || ""}"`, `"${team.member3?.class || ""}"`,
                `"${team.member4?.name || ""}"`, `"${team.member4?.email || ""}"`, `"${team.member4?.phone || ""}"`, `"${team.member4?.year || ""}"`, `"${team.member4?.class || ""}"`,
                `"${team.member5?.name || ""}"`, `"${team.member5?.email || ""}"`, `"${team.member5?.phone || ""}"`, `"${team.member5?.year || ""}"`, `"${team.member5?.class || ""}"`
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

    // Function to fetch and open screenshot in new tab
    const handleViewScreenshot = async (teamId: string, teamName: string) => {
        const token = localStorage.getItem("adminToken");
        if (!token) {
            alert("Please login to view screenshots");
            return;
        }

        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://invento-backend.vercel.app';
            const res = await fetch(`${API_URL}/api/teams/${teamId}/screenshot`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await res.json();

            if (data.success && data.data && data.data.screenShot) {
                const win = window.open();
                if (win) {
                    win.document.write(`
                        <html>
                            <head><title>Payment Receipt - ${teamName}</title></head>
                            <body style="margin:0; display:flex; justify-content:center; align-items:center; background:#f0f0f0; min-height:100vh;">
                                <img src="${data.data.screenShot}" style="max-width:90%; box-shadow: 0 4px 6px rgba(0,0,0,0.1); border: 2px solid #000;" />
                            </body>
                        </html>
                    `);
                }
            } else {
                alert("No payment screenshot found for this team.");
            }
        } catch (error) {
            console.error("Error fetching screenshot:", error);
            alert("Failed to fetch screenshot.");
        }
    };

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
                                <Download size={18} /> <span className="sm:hidden lg:inline">Export CSV</span>
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
                                        <th className="p-4 border-r-2 border-black">Team / Game</th>
                                        <th className="p-4 border-r-2 border-black">College</th>
                                        <th className="p-4 border-r-2 border-black">Leader</th>
                                        <th className="p-4 border-r-2 border-black">Members</th>
                                        <th className="p-4 border-r-2 border-black">Payment</th>
                                        <th className="p-4">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="font-mono text-sm">
                                    {filteredTeams.length > 0 ? filteredTeams.map((team) => (
                                        <tr key={team._id} className="border-b border-gray-200 hover:bg-yellow-50 transition-colors">
                                            <td className="p-4 border-r border-gray-200">
                                                <div className="font-bold text-brand-pink text-base">{team.team_name}</div>
                                                {team.gameName && (
                                                    <div className="text-xs bg-black text-white px-2 py-0.5 rounded-full inline-block mt-1">
                                                        🎮 {team.gameName}
                                                    </div>
                                                )}
                                                <div className="text-xs text-gray-500 mt-2">
                                                    Saved: {new Date(team.registeredAt).toLocaleDateString()}
                                                </div>
                                            </td>
                                            <td className="p-4 border-r border-gray-200 max-w-50 truncate" title={team.college_name}>
                                                {team.college_name || "N/A"}
                                            </td>
                                            <td className="p-4 border-r border-gray-200">
                                                <div className="font-bold">{team.leader.name}</div>
                                                <div className="text-xs text-gray-500">{team.leader.email}</div>
                                                <div className="text-xs text-gray-500">{team.leader.phone}</div>
                                                {(team.leader.year || team.leader.class) && (
                                                    <div className="text-xs bg-gray-200 px-1 py-0.5 rounded mt-1 inline-block">
                                                        {team.leader.year} • {team.leader.class}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="p-4 border-r border-gray-200">
                                                <div className="flex flex-col gap-2">
                                                    {[team.member2, team.member3, team.member4, team.member5].map((member, idx) => (
                                                        member && member.name ? (
                                                            <div key={idx} className="text-xs border-b border-gray-100 last:border-0 pb-1 last:pb-0">
                                                                <span className="font-bold block">{member.name}</span>
                                                                <div className="flex justify-between items-center text-gray-500 text-[10px]">
                                                                    <span>{member.phone}</span>
                                                                    {(member.year || member.class) && (
                                                                        <span>{member.year} - {member.class}</span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        ) : null
                                                    ))}
                                                    {(!team.member2) && <span className="text-gray-400 italic text-xs">No other members</span>}
                                                </div>
                                            </td>
                                            <td className="p-4 border-r border-gray-200 text-center">
                                                <button
                                                    onClick={() => handleViewScreenshot(team._id, team.team_name)}
                                                    className="text-xs bg-blue-100 text-blue-700 border border-blue-500 px-2 py-1 rounded font-bold hover:bg-blue-200 flex items-center justify-center gap-1 mx-auto"
                                                >
                                                    <Eye size={12} /> Check Receipt
                                                </button>
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
                                            <h3 className="font-display text-xl text-brand-pink leading-none mb-1">{team.team_name}</h3>
                                            {team.gameName && (
                                                <div className="text-[10px] bg-black text-white px-1.5 py-0.5 rounded inline-block">
                                                    {team.gameName}
                                                </div>
                                            )}
                                            <p className="text-xs text-gray-500 font-mono truncate max-w-50 mt-1">{team.college_name || "No College"}</p>
                                        </div>
                                        <div className="flex flex-col items-end gap-1">
                                            <span className={`px-2 py-1 rounded-full text-[10px] font-bold border border-black uppercase ${team.status === 'registered' ? 'bg-green-100 text-green-800' : 'bg-gray-100'}`}>
                                                {team.status}
                                            </span>
                                            <button
                                                onClick={() => handleViewScreenshot(team._id, team.team_name)}
                                                className="text-[10px] text-blue-600 font-bold underline"
                                            >
                                                Check Receipt
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-3 text-sm">
                                        <div className="bg-gray-50 p-2 rounded border border-gray-200">
                                            <p className="font-bold text-xs uppercase text-gray-400 mb-1">Team Leader</p>
                                            <p className="font-bold">{team.leader.name}</p>
                                            <div className="flex justify-between items-center text-xs text-gray-600 mt-1">
                                                <p className="font-mono">{team.leader.phone}</p>
                                                {(team.leader.year || team.leader.class) && <span>{team.leader.year} • {team.leader.class}</span>}
                                            </div>
                                            <p className="font-mono text-xs text-gray-500 truncate">{team.leader.email}</p>
                                        </div>

                                        {/* Additional Members for Mobile */}
                                        {(team.member2 || team.member3 || team.member4 || team.member5) && (
                                            <div className="bg-white p-2 rounded border border-gray-200">
                                                <p className="font-bold text-xs uppercase text-gray-400 mb-2">Team Members</p>
                                                <div className="space-y-2">
                                                    {[team.member2, team.member3, team.member4, team.member5].map((member, idx) => (
                                                        member && member.name ? (
                                                            <div key={idx} className="text-xs border-b border-gray-100 last:border-0 pb-1 last:pb-0">
                                                                <div className="flex justify-between font-bold">
                                                                    <span>{member.name}</span>
                                                                    {(member.year || member.class) && <span className="font-normal text-[10px] text-gray-500">{member.year} {member.class}</span>}
                                                                </div>
                                                                <span className="font-mono text-gray-500 block">{member.phone}</span>
                                                            </div>
                                                        ) : null
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex justify-between items-center text-xs font-bold text-gray-500 pt-2 border-t border-gray-100">
                                            <div className="flex items-center gap-1">
                                                <Users size={14} />
                                                <span>Total: {(team.member5 ? 5 : team.member4 ? 4 : team.member3 ? 3 : team.member2 ? 2 : 1)}</span>
                                            </div>
                                            <div className="font-mono">
                                                {new Date(team.registeredAt).toLocaleDateString()}
                                            </div>
                                        </div>
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
