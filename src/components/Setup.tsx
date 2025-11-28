import React, { useState } from "react";
import {
  ClipboardDocumentCheckIcon,
  ClipboardIcon,
  CloudArrowDownIcon,
  CommandLineIcon,
  PlayCircleIcon,
  CheckBadgeIcon,
} from "@heroicons/react/24/outline";

// --- Components ---

interface CodeBlockProps {
  children: string;
  label?: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ children, label }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(children.replace(/^\$ /, "")); // Hapus tanda $ saat copy
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group rounded-xl overflow-hidden border border-slate-700 bg-[#0d1117] shadow-xl">
      {/* Header Terminal */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-800/80 border-b border-slate-700 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-500 transition-colors"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/80 hover:bg-yellow-500 transition-colors"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/80 hover:bg-green-500 transition-colors"></div>
          </div>
          {label && (
            <span className="ml-3 text-xs text-slate-400 font-mono font-bold tracking-wide flex items-center gap-1">
              <CommandLineIcon className="w-3 h-3" />
              {label}
            </span>
          )}
        </div>
        <button
          onClick={handleCopy}
          className="text-slate-500 hover:text-white transition-colors"
          title="Copy command"
        >
          {copied ? (
            <ClipboardDocumentCheckIcon className="w-5 h-5 text-green-400" />
          ) : (
            <ClipboardIcon className="w-5 h-5" />
          )}
        </button>
      </div>
      
      {/* Body Code */}
      <div className="p-5 overflow-x-auto custom-scrollbar">
        <code className="font-mono text-sm text-cyan-300 whitespace-pre">
          {children.startsWith("$") ? (
            <>
              <span className="text-violet-400 select-none font-bold mr-2">$</span>
              {children.substring(1)}
            </>
          ) : (
            children
          )}
        </code>
      </div>
    </div>
  );
};

// --- Main Setup Component ---

const Setup: React.FC = () => {
  const [method, setMethod] = useState<"exe" | "python">("exe");

  return (
    <section id="setup" className="scroll-mt-32 max-w-5xl mx-auto px-4">
      {/* Header Section */}
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
          Start Your <span className="text-cyan-400">Engine</span>
        </h2>
        
        {/* Fancy Toggle Switch */}
        <div className="inline-flex bg-slate-900/80 backdrop-blur p-1.5 rounded-2xl border border-slate-800 shadow-lg relative z-10">
          <button
            onClick={() => setMethod("exe")}
            className={`relative px-8 py-3 rounded-xl text-sm font-bold transition-all duration-300 flex items-center gap-2 ${
              method === "exe"
                ? "bg-gradient-to-r from-cyan-600 to-cyan-500 text-white shadow-[0_0_20px_rgba(6,182,212,0.3)] ring-1 ring-white/20"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <CloudArrowDownIcon className="w-5 h-5" />
            Windows Executable
            {method === "exe" && (
                <span className="absolute -top-2 -right-2 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
                </span>
            )}
          </button>
          <button
            onClick={() => setMethod("python")}
            className={`px-8 py-3 rounded-xl text-sm font-bold transition-all duration-300 flex items-center gap-2 ${
              method === "python"
                ? "bg-gradient-to-r from-violet-600 to-violet-500 text-white shadow-[0_0_20px_rgba(139,92,246,0.3)] ring-1 ring-white/20"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <CommandLineIcon className="w-5 h-5" />
            Python Source
          </button>
        </div>
        
        <p className="mt-4 text-sm text-slate-500">
            {method === "exe" ? "Recommended for most users. No coding knowledge required." : "For developers and advanced users who want full control."}
        </p>
      </div>

      {/* Content Container */}
      <div className="relative min-h-[400px]">
        {/* Glow Effect Background */}
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 rounded-full blur-[100px] -z-10 transition-colors duration-700 ${method === 'exe' ? 'bg-cyan-500/10' : 'bg-violet-500/10'}`}></div>

        {method === "exe" ? (
          <div className="grid md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Card 1: Download */}
            <div className="glass-panel p-8 rounded-3xl border border-slate-700/50 hover:border-cyan-500/30 transition-colors group relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <CloudArrowDownIcon className="w-32 h-32 text-cyan-400 -rotate-12 transform translate-x-8 -translate-y-8" />
                </div>
                
                <div className="w-12 h-12 bg-cyan-500/20 rounded-2xl flex items-center justify-center text-cyan-400 mb-6 border border-cyan-500/20 group-hover:scale-110 transition-transform">
                    <span className="font-bold text-xl">1</span>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-2">Download Release</h3>
                <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                    Get the latest bundled executable. It contains everything needed to run the bot without installing Python.
                </p>

                <a
                  href="https://github.com/Wakype/osu-pilot/releases"
                  target="_blank"
                  className="w-full block text-center py-3 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-white font-bold shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/50 transition-all active:scale-95"
                >
                  Download .zip
                </a>
                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-500">
                    <CheckBadgeIcon className="w-4 h-4 text-green-500" />
                    <span>Virus Total Clean</span>
                </div>
            </div>

            {/* Card 2: Run */}
            <div className="glass-panel p-8 rounded-3xl border border-slate-700/50 hover:border-cyan-500/30 transition-colors group relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <PlayCircleIcon className="w-32 h-32 text-cyan-400 -rotate-12 transform translate-x-8 -translate-y-8" />
                </div>

                <div className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center text-white mb-6 border border-slate-700 group-hover:scale-110 transition-transform">
                    <span className="font-bold text-xl">2</span>
                </div>

                <h3 className="text-xl font-bold text-white mb-2">Run & Calibrate</h3>
                <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                    Extract the zip file and run <code className="bg-slate-800 text-cyan-300 px-1 py-0.5 rounded text-xs font-mono">osu-pilot.exe</code>.
                </p>
                
                <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-800 text-sm text-slate-300">
                    <p className="font-semibold text-white mb-1 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></span>
                        First Run Note:
                    </p>
                    <p className="text-xs opacity-80">
                        You will see a calibration screen. Click the circle when it appears to sync the bot with your system latency.
                    </p>
                </div>
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Step 1 */}
            <div className="flex gap-6">
                <div className="flex-col items-center hidden md:flex">
                    <div className="w-8 h-8 rounded-full bg-violet-500/20 text-violet-400 border border-violet-500/30 flex items-center justify-center font-bold text-sm">01</div>
                    <div className="w-px h-full bg-slate-800 my-2"></div>
                </div>
                <div className="flex-1">
                    <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                        <span className="md:hidden w-6 h-6 rounded-full bg-violet-500/20 text-violet-400 text-xs flex items-center justify-center">1</span>
                        Clone Repository
                    </h3>
                    <p className="text-slate-400 text-sm mb-3">Download the source code to your local machine.</p>
                    <CodeBlock label="Git">$ git clone https://github.com/Wakype/osu-pilot.git</CodeBlock>
                </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-6">
                <div className="flex-col items-center hidden md:flex">
                    <div className="w-8 h-8 rounded-full bg-violet-500/20 text-violet-400 border border-violet-500/30 flex items-center justify-center font-bold text-sm">02</div>
                    <div className="w-px h-full bg-slate-800 my-2"></div>
                </div>
                <div className="flex-1">
                    <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                         <span className="md:hidden w-6 h-6 rounded-full bg-violet-500/20 text-violet-400 text-xs flex items-center justify-center">2</span>
                        Install Dependencies
                    </h3>
                    <p className="text-slate-400 text-sm mb-3">Ensure you have Python 3.10+ installed.</p>
                    <CodeBlock label="Terminal">$ pip install -r requirements.txt</CodeBlock>
                </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-6">
                <div className="flex-col items-center hidden md:flex">
                    <div className="w-8 h-8 rounded-full bg-violet-500/20 text-violet-400 border border-violet-500/30 flex items-center justify-center font-bold text-sm">03</div>
                </div>
                <div className="flex-1">
                    <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                        <span className="md:hidden w-6 h-6 rounded-full bg-violet-500/20 text-violet-400 text-xs flex items-center justify-center">3</span>
                        Launch Bot
                    </h3>
                    <p className="text-slate-400 text-sm mb-3">Run the entry script.</p>
                    <CodeBlock label="Terminal">$ python main.py</CodeBlock>
                </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Setup;