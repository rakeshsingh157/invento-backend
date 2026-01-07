"use client";

import React from "react";
import { MoveRight, Zap, Send, Eye, Users, Code, Heart } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";

// Section Separator Component (Wavy Line)
const WavySeparator = ({ color = "#FACC15" }) => (
  <div className="w-full overflow-hidden leading-[0]">
    <svg
      viewBox="0 0 1200 120"
      preserveAspectRatio="none"
      className="relative block w-full h-[60px] md:h-[100px]"
      style={{ fill: color }}
    >
      <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
    </svg>
  </div>
);

const Navbar = () => (
  <nav className="fixed top-0 left-0 right-0 z-50 bg-black text-white py-4 px-6 md:px-12 flex justify-between items-center border-b-4 border-white">
    <div className="text-2xl font-black tracking-tighter uppercase">INVENTO</div>
    <div className="hidden md:flex gap-8 text-sm font-bold tracking-wide">
      {["Home", "Guidelines", "Winners", "Mentorship", "Sponsors"].map((item) => (
        <Link key={item} href={item === "Home" ? "/" : `#${item.toLowerCase()}`} className="hover:text-brand-pink transition-colors">
          {item}
        </Link>
      ))}
    </div>
    <Link href="/register" className="bg-white text-black px-6 py-2 font-bold hover:bg-brand-pink hover:text-white transition-colors border-2 border-transparent hover:border-black shadow-[4px_4px_0px_0px_rgba(255,255,255,0.5)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
      Register
    </Link>
  </nav>
);

export default function Home() {
  return (
    <div className="min-h-screen font-sans bg-brand-yellow text-black selection:bg-brand-pink selection:text-white pt-20">
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative bg-brand-pink min-h-[90vh] flex flex-col justify-center overflow-hidden pb-20">
        <div className="container mx-auto px-6 md:px-12 grid md:grid-cols-2 gap-12 items-center relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <h1 className="text-7xl md:text-9xl font-black text-white leading-[0.9] tracking-tighter drop-shadow-xl">
              super<br />
              <span className="text-brand-yellow text-shadow-retro">invent</span>
            </h1>
            <p className="text-2xl md:text-3xl font-bold bg-black text-white inline-block px-4 py-2 transform -rotate-1 rounded-sm shadow-xl">
              A hackathon....kinda
            </p>
            <p className="text-lg md:text-xl font-medium max-w-md">
              Unlimited coffee, code, and chaos. Join the ultimate developer showdown alongside mentors and sponsors.
            </p>
            <Link href="/register">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-4 bg-brand-orange text-black text-xl font-black px-10 py-5 rounded-md box-shadow-retro flex items-center gap-3 hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all border-4 border-black"
              >
                Register Now <MoveRight className="w-6 h-6" />
              </motion.button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: 10 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative h-[400px] md:h-[600px] flex items-center justify-center p-10"
          >
            {/* Robot Image */}
            <div className="relative w-full h-full">
              <Image
                src="/hero-robot.png"
                alt="Robot Mascot"
                fill
                className="object-contain drop-shadow-2xl"
                priority
              />
            </div>

            {/* Floating elements */}
            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              className="absolute top-10 right-10 bg-white border-4 border-black p-4 rounded-full shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
            >
              <Zap className="w-8 h-8 text-brand-yellow fill-current" />
            </motion.div>
          </motion.div>
        </div>

        {/* Background Patterns */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
      </section>

      <WavySeparator color="#FACC15" />

      {/* GUIDELINES SECTION (How it works style) */}
      <section id="guidelines" className="py-24 px-6 md:px-12 bg-brand-yellow relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-black mb-6">Guidelines</h2>
            <p className="text-xl font-medium max-w-2xl mx-auto">Everything you need to know to crush the competition. Follow the rules, build something cool.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Register", icon: Zap, desc: "Sign up your team of 2-4 members. Choose a cool name.", color: "bg-pink-300" },
              { title: "Build", icon: Send, desc: "48 hours of non-stop coding. Turn coffee into code.", color: "bg-purple-300" },
              { title: "Submit", icon: Eye, desc: "Demo your project to the judges. Win glory and prizes.", color: "bg-green-300" }
            ].map((item) => (
              <motion.div
                key={item.title}
                whileHover={{ y: -10 }}
                className="bg-brand-pink/10 rounded-3xl p-4"
              >
                <div className={`h-full bg-white rounded-2xl p-8 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center text-center gap-6`}>
                  <div className={`w-20 h-20 ${item.color} rounded-full border-4 border-black flex items-center justify-center -mt-16 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}>
                    <item.icon className="w-10 h-10 w-full" />
                  </div>
                  <h3 className="text-3xl font-black mt-4">{item.title}</h3>
                  <p className="font-medium text-lg leading-snug">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* LAST YEAR WINNERS */}
      <section id="winners" className="py-24 px-6 md:px-12 bg-white border-t-4 border-black">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <h2 className="text-5xl md:text-6xl font-black mb-2">Hall of Fame</h2>
              <p className="text-xl font-bold text-gray-500">Last Year's Legends</p>
            </div>
            <button className="bg-black text-white px-8 py-3 font-bold rounded-full hover:bg-brand-pink transition-colors">
              View All Projects
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="group relative aspect-video bg-gray-100 rounded-xl border-4 border-black overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <div className="absolute inset-0 bg-brand-pink/20 flex items-center justify-center p-8 text-center group-hover:bg-brand-pink/90 transition-colors">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <h3 className="text-4xl font-black text-white">Team Alpha</h3>
                  <p className="text-white font-bold text-xl">Best Innovation</p>
                </div>
              </div>
              <div className="absolute top-4 left-4 bg-yellow-400 border-2 border-black px-3 py-1 font-bold text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">1st Place</div>
            </div>
            <div className="group relative aspect-video bg-gray-100 rounded-xl border-4 border-black overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <div className="absolute inset-0 bg-blue-400/20 flex items-center justify-center p-8 text-center group-hover:bg-blue-500/90 transition-colors">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <h3 className="text-4xl font-black text-white">Code Bashers</h3>
                  <p className="text-white font-bold text-xl">Best Design</p>
                </div>
              </div>
              <div className="absolute top-4 left-4 bg-gray-300 border-2 border-black px-3 py-1 font-bold text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">2nd Place</div>
            </div>
            <div className="group relative aspect-video bg-gray-100 rounded-xl border-4 border-black overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <div className="absolute inset-0 bg-green-400/20 flex items-center justify-center p-8 text-center group-hover:bg-green-500/90 transition-colors">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <h3 className="text-4xl font-black text-white">Pixel Punks</h3>
                  <p className="text-white font-bold text-xl">Best UI/UX</p>
                </div>
              </div>
              <div className="absolute top-4 left-4 bg-orange-400 border-2 border-black px-3 py-1 font-bold text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">3rd Place</div>
            </div>
          </div>
        </div>
      </section>

      {/* MENTORSHIP */}
      <section id="mentorship" className="py-24 px-6 md:px-12 bg-pink-50 border-t-4 border-black">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black mb-12 flex items-center gap-4">
            <Users className="w-12 h-12" /> Mentorship
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={`mentor-${i}`} className="flex flex-col gap-4 bg-white p-6 rounded-xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all cursor-pointer">
                <div className="w-20 h-20 bg-gray-200 rounded-full border-4 border-black"></div>
                <div>
                  <h4 className="font-black text-2xl mb-1">Mentor Name {i}</h4>
                  <p className="text-md font-bold text-brand-pink uppercase tracking-wider">Tech Lead @ Google</p>
                  <p className="text-sm font-medium text-gray-600 mt-2">Expert guidance on tech stack, scalable architecture, and game design principles.</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SPONSORS */}
      <section id="sponsors" className="py-24 px-6 md:px-12 bg-brand-yellow border-t-4 border-black">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black mb-12 flex items-center gap-4 text-black">
            <Heart className="w-12 h-12 text-red-500 fill-current" /> Our Sponsors
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={`sponsor-${i}`} className="aspect-[3/2] bg-white rounded-xl border-4 border-black flex items-center justify-center font-black text-gray-300 text-3xl hover:bg-brand-pink hover:text-white hover:-translate-y-2 transition-all cursor-pointer shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                LOGO
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DEVELOPER / FOOTER */}
      <footer id="developer" className="bg-black text-white py-12 px-6 border-t-8 border-brand-pink">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
          <div>
            <h2 className="text-3xl font-black mb-2">INVENTO</h2>
            <p className="text-gray-400 max-w-sm">Built by developers, for developers. <br /> Making the web fun again.</p>
          </div>

          <div className="flex gap-4">
            <div className="bg-white/10 p-3 rounded-full hover:bg-brand-pink transition-colors cursor-pointer">
              <Code className="w-6 h-6" />
            </div>
            <div className="bg-white/10 p-3 rounded-full hover:bg-brand-pink transition-colors cursor-pointer">
              <Users className="w-6 h-6" />
            </div>
          </div>
        </div>
        <div className="mt-12 text-center text-gray-600 font-bold text-sm">
          © 2026 INVENTO. ALL RIGHTS RESERVED.
        </div>
      </footer>
    </div>
  );
}
