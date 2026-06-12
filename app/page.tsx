"use client";

import { useState, useRef, useCallback, useMemo } from "react";
import { Loader2, ShieldAlert, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { Header } from "@/components/Header";
import { StepIndicator } from "@/components/StepIndicator";
import { SearchForm } from "@/components/SearchForm";
import { Sidebar } from "@/components/Sidebar";
import { MainContent } from "@/components/MainContent";

import {
  fetchSummary,
  fetchFiles,
  fetchFileExplanation,
  fetchFunctions,
  fetchFunctionExplanation
} from "./actions";

export default function Home() {
  const [repoUrl, setRepoUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [summaryData, setSummaryData] = useState<any>(null);
  const [files, setFiles] = useState<string[]>([]);
  const [fileFilter, setFileFilter] = useState("");
  
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [fileExplanation, setFileExplanation] = useState<string | null>(null);
  const [isLoadingFile, setIsLoadingFile] = useState(false);
  
  const [functions, setFunctions] = useState<string[]>([]);
  const [isLoadingFunctions, setIsLoadingFunctions] = useState(false);
  
  const [selectedFunction, setSelectedFunction] = useState<string | null>(null);
  const [functionExplanation, setFunctionExplanation] = useState<string | null>(null);
  const [isLoadingFunction, setIsLoadingFunction] = useState(false);
  
  const [summaryCollapsed, setSummaryCollapsed] = useState(false);

  const contentRef = useRef<HTMLDivElement>(null);
  const fileExplRef = useRef<HTMLDivElement>(null);

  const currentStep = summaryData ? (selectedFile ? 2 : 1) : 0;

  const filteredFiles = useMemo(() => {
    if (!fileFilter) return files;
    const q = fileFilter.toLowerCase();
    return files.filter(f => f.toLowerCase().includes(q));
  }, [files, fileFilter]);

  const handleAnalyze = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!repoUrl) return;
    setIsAnalyzing(true);
    setError(null);
    setSummaryData(null);
    setFiles([]);
    setSelectedFile(null);
    setFileExplanation(null);
    setFunctions([]);
    setSelectedFunction(null);
    setFunctionExplanation(null);
    setSummaryCollapsed(false);

    try {
      // Use Server Actions instead of API Routes
      const [summaryJson, filesJson] = await Promise.all([
        fetchSummary(repoUrl),
        fetchFiles(repoUrl)
      ]);
      
      setSummaryData(summaryJson);
      if (filesJson.files) {
        setFiles(filesJson.files);
      }

      setTimeout(() => contentRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 200);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsAnalyzing(false);
    }
  }, [repoUrl]);

  const handleFileSelect = useCallback(async (path: string) => {
    setSelectedFile(path);
    setFileExplanation(null);
    setIsLoadingFile(true);
    setFunctions([]);
    setSelectedFunction(null);
    setFunctionExplanation(null);
    setSummaryCollapsed(true);

    setTimeout(() => fileExplRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);

    try {
      const expJson = await fetchFileExplanation(repoUrl, path);
      setFileExplanation(expJson.explanation || "Failed to generate explanation.");

      if (path.endsWith(".py")) {
        setIsLoadingFunctions(true);
        const funcJson = await fetchFunctions(repoUrl, path);
        if (funcJson.functions) setFunctions(funcJson.functions);
        setIsLoadingFunctions(false);
      }
    } catch {
      setFileExplanation("An error occurred while fetching the explanation.");
      setIsLoadingFunctions(false);
    } finally {
      setIsLoadingFile(false);
    }
  }, [repoUrl]);

  const handleFunctionSelect = useCallback(async (funcName: string) => {
    if (!selectedFile) return;
    setSelectedFunction(funcName);
    setFunctionExplanation(null);
    setIsLoadingFunction(true);

    try {
      const json = await fetchFunctionExplanation(repoUrl, selectedFile, funcName);
      setFunctionExplanation(json.explanation || "Failed to generate explanation.");
    } catch {
      setFunctionExplanation("An error occurred.");
    } finally {
      setIsLoadingFunction(false);
    }
  }, [repoUrl, selectedFile]);

  return (
    <div className="min-h-screen bg-[#060608] text-slate-200 font-sans selection:bg-blue-500/30 relative overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-blue-600/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-orange-600/5 rounded-full blur-[100px]" />
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <Header />

        {/* <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <StepIndicator current={currentStep} />
        </motion.div> */}

        <SearchForm 
          repoUrl={repoUrl} 
          setRepoUrl={setRepoUrl} 
          isAnalyzing={isAnalyzing} 
          onSubmit={handleAnalyze} 
        />

        {/* Loading Bar */}
        <AnimatePresence>
          {isAnalyzing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-3xl mx-auto mb-8"
            >
              <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full w-1/4 bg-blue-500 rounded-full progress-bar" />
              </div>
              <p className="text-center text-xs text-slate-500 mt-3 flex items-center justify-center gap-2">
                <Loader2 className="w-3 h-3 animate-spin" />
                Cloning repo & generating AI summary … this may take a moment
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="max-w-3xl mx-auto bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl flex items-center gap-3 mb-8"
            >
              <ShieldAlert className="w-5 h-5 shrink-0" />
              <p className="text-sm flex-1">{error}</p>
              <button onClick={() => setError(null)} className="hover:text-red-300 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content */}
        <AnimatePresence>
          {summaryData && (
            <motion.div
              ref={contentRef}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-6"
            >
              <Sidebar 
                summaryData={summaryData}
                files={files}
                filteredFiles={filteredFiles}
                fileFilter={fileFilter}
                setFileFilter={setFileFilter}
                selectedFile={selectedFile}
                handleFileSelect={handleFileSelect}
              />
              <MainContent 
                summaryData={summaryData}
                summaryCollapsed={summaryCollapsed}
                setSummaryCollapsed={setSummaryCollapsed}
                selectedFile={selectedFile}
                fileExplanation={fileExplanation}
                isLoadingFile={isLoadingFile}
                functions={functions}
                isLoadingFunctions={isLoadingFunctions}
                selectedFunction={selectedFunction}
                functionExplanation={functionExplanation}
                isLoadingFunction={isLoadingFunction}
                handleFunctionSelect={handleFunctionSelect}
                fileExplRef={fileExplRef}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
