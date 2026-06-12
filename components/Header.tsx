"use client";

import { motion } from "framer-motion";
import { GitBranch } from "lucide-react";
import Image from "next/image";

export function Header() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col items-center mb-10 text-center"
    >
      <div className="relative mb-6">
        {/* <div className="absolute inset-0 bg-blue-500/10 rounded-2xl blur-xl scale-150" /> */}
        <div className="relative bg-white/20 p-4 rounded-2xl border border-blue-500/20">
          <GitBranch className=" absolute w-10 h-10 text-orange-400" />
          <Image src="/gitb.svg" alt="Logo" width={100} height={100} />
        </div>
      </div>
      <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-3 text-white">
        AI Git Explorer
      </h1>
      <p className="text-slate-400 max-w-xl text-base sm:text-lg leading-relaxed">
        Paste a GitHub URL and let <span className="text-orange-400 font-medium">Gemini AI</span> break down the architecture, files, and functions for you.
      </p>
    </motion.header>
  );
}
