"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Bot, ChevronRight, FileCode2, FunctionSquare, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";

export function Skeleton({ lines = 4 }: { lines?: number }) {
  return (
    <div className="space-y-3 py-4">
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="skeleton h-4" style={{ width: `${75 - i * 12}%` }} />
      ))}
    </div>
  );
}

function getFileExt(f: string) {
  return f.split(".").pop()?.toLowerCase() ?? "";
}

function fileIconColor(f: string) {
  const map: Record<string, string> = {
    py: "text-blue-400", ts: "text-sky-400", tsx: "text-sky-400",
    js: "text-yellow-400", jsx: "text-yellow-400", json: "text-gray-400",
    md: "text-gray-300", css: "text-cyan-400", html: "text-orange-400",
    go: "text-teal-400", rs: "text-amber-400", java: "text-red-400",
    rb: "text-red-500", php: "text-violet-400",
  };
  return map[getFileExt(f)] ?? "text-slate-500";
}

interface MainContentProps {
  summaryData: any;
  summaryCollapsed: boolean;
  setSummaryCollapsed: (v: boolean) => void;
  selectedFile: string | null;
  fileExplanation: string | null;
  isLoadingFile: boolean;
  functions: string[];
  isLoadingFunctions: boolean;
  selectedFunction: string | null;
  functionExplanation: string | null;
  isLoadingFunction: boolean;
  handleFunctionSelect: (func: string) => void;
  fileExplRef: React.RefObject<HTMLDivElement | null>;
}

export function MainContent({
  summaryData,
  summaryCollapsed,
  setSummaryCollapsed,
  selectedFile,
  fileExplanation,
  isLoadingFile,
  functions,
  isLoadingFunctions,
  selectedFunction,
  functionExplanation,
  isLoadingFunction,
  handleFunctionSelect,
  fileExplRef,
}: MainContentProps) {
  return (
    <section className="lg:col-span-8 xl:col-span-9 space-y-5">
      {/* AI Summary */}
      <div className="bg-[#0c0d14] border border-white/15 rounded-xl overflow-hidden relative">
        <div className="absolute top-0 inset-x-0 h-1 bg-orange-500" />
        <button
          onClick={() => setSummaryCollapsed(!summaryCollapsed)}
          className="w-full flex items-center gap-3 p-5 text-left hover:bg-white/2 transition-colors"
        >
          <div className="bg-orange-500/15 p-2 rounded-lg">
            <Bot className="w-4 h-4 text-orange-400" />
          </div>
          <h2 className="text-base font-semibold text-white flex-1">Project Summary</h2>
          <ChevronRight className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${summaryCollapsed ? "" : "rotate-90"}`} />
        </button>
        <AnimatePresence initial={false}>
          {!summaryCollapsed && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="px-5 pb-6 border-t border-white/4">
                <div className="prose prose-sm prose-invert prose-blue max-w-none pt-4 prose-p:text-slate-300 prose-headings:text-slate-100 prose-a:text-blue-400 prose-code:text-orange-300 prose-pre:bg-black/40 prose-pre:border prose-pre:border-white/15">
                  <ReactMarkdown>{summaryData.ai_summary}</ReactMarkdown>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* File Explanation */}
      <AnimatePresence mode="wait">
        {selectedFile && (
          <motion.div
            ref={fileExplRef}
            key={`file-${selectedFile}`}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-[#0c0d14] border border-white/15 rounded-xl overflow-hidden"
          >
            {/* File header */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-white/4 bg-white/1">
              <FileCode2 className={`w-4 h-4 shrink-0 ${fileIconColor(selectedFile)}`} />
              <h2 className="text-sm font-mono font-medium text-slate-200 truncate">{selectedFile}</h2>
              {selectedFile.endsWith(".py") && (
                <span className="ml-auto text-[10px] bg-blue-500/15 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded-md font-medium">Python</span>
              )}
            </div>

            {/* File explanation body */}
            <div className="p-5">
              {isLoadingFile ? <Skeleton lines={5} /> : fileExplanation ? (
                <div className="prose prose-sm prose-invert prose-blue max-w-none prose-p:text-slate-300 prose-pre:bg-black/40 prose-pre:border prose-pre:border-white/15 prose-code:text-orange-300">
                  <ReactMarkdown>{fileExplanation}</ReactMarkdown>
                </div>
              ) : null}
            </div>

            {/* Functions */}
            {(functions.length > 0 || isLoadingFunctions) && (
              <div className="px-5 pb-5 pt-2 border-t border-white/4">
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <FunctionSquare className="w-3.5 h-3.5" />
                  Functions
                  {isLoadingFunctions && <Loader2 className="w-3 h-3 animate-spin text-slate-600" />}
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {functions.map(func => (
                    <button
                      key={func}
                      onClick={() => handleFunctionSelect(func)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all border
                        ${selectedFunction === func
                          ? "bg-blue-500/15 text-blue-300 border-blue-500/40"
                          : "bg-white/3 text-slate-400 border-white/15 hover:bg-white/6 hover:text-slate-200"}`}
                    >
                      {func}()
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Function Explanation */}
      <AnimatePresence mode="wait">
        {selectedFunction && (
          <motion.div
            key={`func-${selectedFunction}`}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-[#0c0d14] border border-blue-500/40 rounded-xl overflow-hidden relative"
          >
            <div className="absolute top-0 bottom-0 left-0 w-1 bg-blue-500" />
            <div className="flex items-center gap-3 px-5 py-4 border-b border-white/4 bg-white/1">
              <FunctionSquare className="w-4 h-4 text-blue-400 shrink-0" />
              <div className="truncate">
                <span className="text-[10px] text-slate-500 font-mono">{selectedFile} →</span>
                <span className="text-sm font-mono font-medium text-blue-300 ml-1.5">{selectedFunction}()</span>
              </div>
            </div>
            <div className="p-5">
              {isLoadingFunction ? <Skeleton lines={4} /> : functionExplanation ? (
                <div className="prose prose-sm prose-invert prose-blue max-w-none prose-p:text-slate-300 prose-pre:bg-black/40 prose-pre:border prose-pre:border-white/15 prose-code:text-orange-300">
                  <ReactMarkdown>{functionExplanation}</ReactMarkdown>
                </div>
              ) : null}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty state when no file selected */}
      {!selectedFile && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-20 text-center"
        >
          <div className="bg-white/3 p-4 rounded-2xl border border-white/15 mb-4">
            <FileCode2 className="w-8 h-8 text-slate-600" />
          </div>
          <p className="text-slate-500 text-sm">Select a file from the sidebar to explore it with AI</p>
          <p className="text-slate-600 text-xs mt-1">Python files will also show extractable functions</p>
        </motion.div>
      )}
    </section>
  );
}
