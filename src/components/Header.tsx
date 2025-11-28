import React, { useEffect } from "react";
import { scrollToSection } from "../utils/scroll";
import { ArrowDownCircleIcon } from "@heroicons/react/24/solid";

const Header: React.FC = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://go.screenpal.com/player/appearance/cTjQqZnIWSm";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <header id="home" className="relative pt-40 pb-20 overflow-hidden">
      {/* Glow Center */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/20 blur-[120px] rounded-full -z-10" />

      <div className="container mx-auto px-6 text-center relative z-10">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/50 border border-slate-700 mb-8 animate-fade-in-up">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          <span className="text-xs font-medium text-slate-300">
            Use at your own risk!
          </span>
        </div>

        {/* Title */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tight leading-none mb-6">
          Dominate <br className="hidden md:block" />
          <span className="text-cyan-400 text-glow">
            Osu!
          </span>{" "}
          Leaderboard
        </h1>

        <p className="mt-6 text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
          The most advanced external{" "}
          <span className="text-white font-semibold">osu! tool</span>
          . Reads map files directly, simulating human-like cursor movement with
          zero memory injection.
        </p>

        {/* Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-5">
          <button
            onClick={() => scrollToSection("setup")}
            className="group relative px-8 py-4 bg-cyan-500 rounded-xl font-bold text-white shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/50 hover:-translate-y-1 transition-all cursor-pointer overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 skew-y-12"></div>
            <span className="relative flex items-center gap-2">
              <ArrowDownCircleIcon className="w-5 h-5" /> Download Now
            </span>
          </button>

          <a
            href="https://github.com/Wakype/osu-pilot"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 rounded-xl font-bold text-slate-300 border border-slate-700 hover:bg-slate-800 hover:text-white transition-all hover:-translate-y-1 flex items-center gap-2"
          >
            View Source Code
          </a>
        </div>

        {/* Video Preview Frame */}
        <div className="mt-24 relative max-w-5xl mx-auto rounded-xl bg-slate-800/50 p-2 border border-slate-700/50 shadow-2xl shadow-black/50 backdrop-blur-sm group">
          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-violet-600 rounded-2xl opacity-20 group-hover:opacity-40 blur transition duration-500"></div>
          <div className="relative aspect-video rounded-lg overflow-hidden bg-black">
            <div
              className="sp-embed-player w-full h-full"
              data-id="cTjQqZnIWSm"
            >
              <iframe
                width="100%"
                height="100%"
                title="osu!pilot Demo"
                style={{ border: 0 }}
                src="https://go.screenpal.com/player/cTjQqZnIWSm?width=100%&height=100%&ff=1&title=0&controls=0&cc=0&autoplay=1&mute=1"
                allowFullScreen={true}
                allow="autoplay"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
