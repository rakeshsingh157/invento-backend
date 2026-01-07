"use client";

import React from "react";
import { MoveRight, Gamepad2, Trophy, Users } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ThreeDCard } from "@/components/ui/ThreeDCard";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden font-sans selection:bg-purple-500/30">

      {/* Background Grid & ambient light */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-500/20 blur-[120px] rounded-full sm:animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/20 blur-[120px] rounded-full sm:animate-pulse delay-700"></div>

      {/* Navbar */}
      <nav className="relative z-50 w-full max-w-7xl mx-auto py-6 px-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Gamepad2 className="w-8 h-8 text-purple-500" />
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
            INVENTO
          </span>
        </div>
        {/* <Button variant="outline" className="hidden sm:block">Login</Button> */}
      </nav>

      <main className="relative z-10 flex flex-col items-center justify-center pt-20 pb-32 px-4 text-center">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto space-y-8"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-purple-300 mb-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
            </span>
            Registration Open for 2024
          </div>

          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[1.1]">
            THE ULTIMATE <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 animate-gradient-x">
              GAME SHOWCASE
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Showcase your creativity. Compete with the best. <br className="hidden sm:block" />
            Join creators from around the world in this epic event.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
            <Link href="/register">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group relative px-8 py-4 bg-white text-black rounded-lg font-bold text-lg flex items-center gap-2 hover:bg-gray-100 transition-colors"
              >
                Register Team
                <MoveRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                <div className="absolute inset-0 -z-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur-lg opacity-50 group-hover:opacity-100 transition-opacity duration-200"></div>
              </motion.button>
            </Link>
          </div>
        </motion.div>

        {/* 3D Cards Section */}
        <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl mx-auto perspective-1000">
          <div className="h-64 cursor-pointer group perspective-1000">
            <div className="relative w-full h-full duration-500 group-hover:rotate-y-12 preserve-3d">
              <div className="absolute inset-0 bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm hover:border-purple-500/50 transition-colors flex flex-col items-center justify-center text-center gap-4">
                <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 mb-2">
                  <Trophy className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold">Showcase</h3>
                <p className="text-gray-400 text-sm">Present your game to industry experts and peers.</p>
              </div>
            </div>
          </div>

          <div className="h-64 cursor-pointer group perspective-1000">
            <div className="relative w-full h-full duration-500 group-hover:rotate-y-12 preserve-3d">
              <div className="absolute inset-0 bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm hover:border-blue-500/50 transition-colors flex flex-col items-center justify-center text-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 mb-2">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold">Connect</h3>
                <p className="text-gray-400 text-sm">Network with other developers and build your team.</p>
              </div>
            </div>
          </div>

          <div className="h-64 cursor-pointer group perspective-1000">
            <div className="relative w-full h-full duration-500 group-hover:rotate-y-12 preserve-3d">
              <div className="absolute inset-0 bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm hover:border-pink-500/50 transition-colors flex flex-col items-center justify-center text-center gap-4">
                <div className="w-12 h-12 rounded-full bg-pink-500/20 flex items-center justify-center text-pink-400 mb-2">
                  <Gamepad2 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold">Play</h3>
                <p className="text-gray-400 text-sm">Experience innovative games created by the community.</p>
              </div>
            </div>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 bg-black/50 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto py-12 px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Gamepad2 className="w-6 h-6 text-gray-500" />
            <span className="font-semibold text-gray-400">INVENTO</span>
          </div>
          <p className="text-sm text-gray-600">© 2024 Invento Gamathon. Crafted for Gamers.</p>
          <div className="flex gap-6">
            {/* Social placeholders could go here */}
          </div>
        </div>
      </footer>
    </div>
  );
}
