import React from "react";
import {
  ClockIcon,
  BoltIcon,
  CursorArrowRaysIcon,
  CpuChipIcon,
} from "@heroicons/react/24/outline";

const Features: React.FC = () => {
  return (
    <section id="features" className="scroll-mt-32">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
          Made for <span className="text-cyan-400">Perfection</span>
        </h2>
        <p className="mt-4 text-slate-400">
          Everything you need to automate your gameplay with human-like
          precision.
        </p>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {/* Large Card Left */}
        <div className="md:col-span-2 glass-panel p-8 rounded-3xl relative overflow-hidden group hover:border-cyan-500/30 transition-colors duration-300">
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-cyan-500/20 transition-all duration-500"></div>
          <div className="relative z-10">
            <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center mb-6 border border-slate-700 text-cyan-400">
              <CursorArrowRaysIcon className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">
              Human-like Movement
            </h3>
            <p className="text-slate-400 leading-relaxed max-w-md">
              Unlike other bots, osu!pilot uses advanced Bezier curve
              algorithms and simulated jitter. Includes "Flow Aim" mode for
              momentum-based cursor physics that real players.
            </p>
          </div>
        </div>

        {/* Tall Card Right */}
        <div className="md:row-span-2 glass-panel p-8 rounded-3xl relative overflow-hidden group hover:border-violet-500/30 transition-colors duration-300 flex flex-col justify-center">
          <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-violet-500/10 to-transparent opacity-50 group-hover:opacity-100 transition-opacity"></div>
          <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center mb-6 border border-slate-700 text-violet-400">
            <BoltIcon className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-3">
            Full Mod Support
          </h3>
          <p className="text-slate-400 leading-relaxed">
            Native calculations for:
          </p>
          <ul className="mt-4 space-y-2 text-slate-300 font-medium font-mono text-sm">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-violet-400 rounded-full"></span>{" "}
              Hard Rock (HR)
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-violet-400 rounded-full"></span>{" "}
              Double Time (DT)
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-violet-400 rounded-full"></span>{" "}
              Nightcore (NC)
            </li>
          </ul>
        </div>

        {/* Small Card Bottom 1 */}
        <div className="glass-panel p-8 rounded-3xl relative overflow-hidden group hover:border-cyan-500/30 transition-colors duration-300">
          <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center mb-6 border border-slate-700 text-cyan-400">
            <ClockIcon className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Auto-Sync</h3>
          <p className="text-slate-400 text-sm">
            Calibration tools ensure 1ms precision synced to your hardware
            latency.
          </p>
        </div>

        {/* Small Card Bottom 2 */}
        <div className="glass-panel p-8 rounded-3xl relative overflow-hidden group hover:border-cyan-500/30 transition-colors duration-300">
          <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center mb-6 border border-slate-700 text-cyan-400">
            <CpuChipIcon className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">External Logic</h3>
          <p className="text-slate-400 text-sm">
            Reads .osu files from disk. No memory reading means lower ban risk.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Features;
