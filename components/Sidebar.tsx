import { Terminal, FolderOpen, Filter, X, FileCode2, ArrowRight } from "lucide-react";

interface SidebarProps {
  summaryData: any;
  files: string[];
  filteredFiles: string[];
  fileFilter: string;
  setFileFilter: (v: string) => void;
  selectedFile: string | null;
  handleFileSelect: (path: string) => void;
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

export function Sidebar({
  summaryData,
  files,
  filteredFiles,
  fileFilter,
  setFileFilter,
  selectedFile,
  handleFileSelect
}: SidebarProps) {
  return (
    <aside className="lg:col-span-4 xl:col-span-3 space-y-4 lg:sticky lg:top-6 lg:self-start lg:max-h-[calc(100vh-3rem)] lg:overflow-hidden lg:flex lg:flex-col">
      {/* Tech Stack */}
      <div className="bg-white/3 border border-white/15 rounded-xl p-4">
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5" /> Tech Stack
        </h3>
        <div className="flex flex-wrap gap-1.5">
          {summaryData.analysis?.technologies?.length > 0 ? (
            summaryData.analysis.technologies.map((tech: string) => (
              <span key={tech} className="px-2.5 py-1 bg-blue-500/15 text-blue-300 border border-blue-500/30 rounded-md text-[11px] font-medium">
                {tech}
              </span>
            ))
          ) : (
            <span className="text-slate-600 text-xs">No technologies detected</span>
          )}
        </div>
      </div>

      {/* File Explorer */}
      <div className="bg-white/3 border border-white/15 rounded-xl flex flex-col flex-1 min-h-0 max-h-[400px] lg:max-h-none">
        <div className="p-4 pb-3 border-b border-white/15">
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
            <FolderOpen className="w-3.5 h-3.5" /> Files
            <span className="ml-auto text-[10px] font-normal text-slate-600 normal-case tracking-normal">{filteredFiles.length}/{files.length}</span>
          </h3>
          {/* Filter input */}
          <div className="flex items-center gap-2 bg-white/4 rounded-lg px-2.5 py-1.5 border border-white/15">
            <Filter className="w-3 h-3 text-slate-600" />
            <input
              type="text"
              placeholder="Filter files…"
              className="flex-1 bg-transparent border-none outline-none text-xs text-slate-300 placeholder:text-slate-600"
              value={fileFilter}
              onChange={(e) => setFileFilter(e.target.value)}
            />
            {fileFilter && (
              <button onClick={() => setFileFilter("")} className="text-slate-600 hover:text-slate-400">
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
        <div className="overflow-y-auto custom-scrollbar p-2 flex-1">
          {filteredFiles.length === 0 ? (
            <p className="text-xs text-slate-600 text-center py-6">No files match your filter</p>
          ) : (
            filteredFiles.map(file => (
              <button
                key={file}
                onClick={() => handleFileSelect(file)}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-all flex items-center gap-2 group mb-0.5
                  ${selectedFile === file
                    ? "bg-blue-500/15 text-blue-300 border border-blue-500/30"
                    : "text-slate-400 hover:bg-white/4 hover:text-slate-200 border border-transparent"}`}
              >
                <FileCode2 className={`w-3 h-3 shrink-0 ${fileIconColor(file)}`} />
                <span className="truncate font-mono">{file}</span>
                <ArrowRight className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-50 shrink-0 transition-opacity" />
              </button>
            ))
          )}
        </div>
      </div>
    </aside>
  );
}
