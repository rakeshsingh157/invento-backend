import Link from "next/link";

export const Navbar = () => (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black text-white py-4 px-6 md:px-12 flex justify-between items-center border-b-4 border-white">
        <div className="text-2xl font-black tracking-tighter uppercase">INVENTO</div>
        <div className="hidden md:flex gap-8 text-sm font-bold tracking-wide">
            {["Home", "Guidelines", "Winners", "Mentorship", "Sponsors"].map((item) => (
                <Link key={item} href={item === "Home" ? "/" : `/#${item.toLowerCase()}`} className="hover:text-brand-pink transition-colors">
                    {item}
                </Link>
            ))}
        </div>
        <Link href="/register" className="bg-white text-black px-6 py-2 font-bold hover:bg-brand-pink hover:text-white transition-colors border-2 border-transparent hover:border-black shadow-[4px_4px_0px_0px_rgba(255,255,255,0.5)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            Register
        </Link>
    </nav>
);
