"use client";

import { ChevronRight } from "lucide-react";

const STEPS = [
  { key: "input", label: "Repository" },
  { key: "summary", label: "Summary" },
  { key: "files", label: "Explore" },
] as const;

export function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-center gap-1 mb-10">
      {STEPS.map((s, i) => (
        <div key={s.key} className="flex items-center gap-1">
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300
            ${i <= current
              ? "bg-blue-500/20 text-blue-300 border border-blue-500/50"
              : "bg-white/5 text-slate-500 border border-white/20"}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold
              ${i < current ? "bg-orange-500 text-white" : i === current ? "bg-blue-500 text-white" : "bg-white/10 text-slate-500"}`}>
              {i < current ? "✓" : i + 1}
            </span>
            {s.label}
          </div>
          {i < STEPS.length - 1 && <ChevronRight className="w-3 h-3 text-slate-600 mx-1" />}
        </div>
      ))}
    </div>
  );
}
