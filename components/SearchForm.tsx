"use client";

import { motion } from "framer-motion";
import { Search, Loader2, Sparkles } from "lucide-react";

interface SearchFormProps {
  repoUrl: string;
  setRepoUrl: (url: string) => void;
  isAnalyzing: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export function SearchForm({ repoUrl, setRepoUrl, isAnalyzing, onSubmit }: SearchFormProps) {
  return (
    <motion.form
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      onSubmit={onSubmit}
      className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 bg-white/4 p-2 sm:p-1.5 rounded-2xl border border-white/20 shadow-md shadow-blue-500/10 backdrop-blur-md w-full max-w-3xl mx-auto mb-10 focus-within:border-blue-500/40 focus-within:shadow-md focus-within:shadow-blue-500/20 transition-all duration-300"
    >
      <div className="flex items-center flex-1 bg-transparent px-3">
        <Search className="w-5 h-5 text-slate-500 mr-2 shrink-0" />
        <input
          type="url"
          placeholder="https://github.com/username/repository"
          className="flex-1 bg-transparent border-none outline-none text-slate-200 placeholder:text-slate-600 py-3 text-sm sm:text-base w-full"
          value={repoUrl}
          onChange={(e) => setRepoUrl(e.target.value)}
          required
        />
      </div>
      <button
        type="submit"
        disabled={isAnalyzing}
        className="w-full sm:w-auto justify-center bg-orange-600 hover:bg-orange-500 active:scale-[0.97] text-white px-5 py-3 sm:py-2.5 rounded-xl font-medium text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm shadow-orange-500/20"
      >
        {isAnalyzing ? (
          <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing…</>
        ) : (
          <><Sparkles className="w-4 h-4" /> Analyze</>
        )}
      </button>
    </motion.form>
    
  );
}
