import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-800 bg-slate-950/50 backdrop-blur-sm pt-12 pb-8">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Brand */}
          <div className="text-center md:text-left">
            <h4 className="text-xl font-bold text-white">
              osu!<span className="text-cyan-400">pilot</span>
            </h4>
            <p className="text-slate-500 text-sm mt-2 max-w-sm">
              The most advanced external osu! tool. Reads map files directly, simulating human-like cursor movement with zero memory injection.
            </p>
          </div>

          {/* Links */}
          <div className="flex gap-6 text-sm font-medium text-slate-400">
            <a
              href="https://github.com/Wakype/osu-pilot"
              className="hover:text-cyan-400 transition-colors"
            >
              GitHub
            </a>
            <a
              href="https://github.com/Wakype/osu-pilot/issues"
              className="hover:text-cyan-400 transition-colors"
            >
              Issues
            </a>
            <a
              href="https://github.com/Wakype/osu-pilot/blob/main/LICENSE"
              className="hover:text-cyan-400 transition-colors"
            >
              License
            </a>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800/50 text-center text-xs text-slate-600">
          <p>
            &copy; {new Date().getFullYear()} osu!pilot Project. Not affiliated
            with ppy or osu!.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
