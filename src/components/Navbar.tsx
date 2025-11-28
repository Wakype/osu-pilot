import React, { useState, useEffect } from "react";
import { scrollToSection } from "../utils/scroll";

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { to: "features", label: "Features" },
    { to: "how-it-works", label: "How It Works" },
    { to: "setup", label: "Installation" },
    { to: "faq", label: "FAQ" },
  ];

  return (
    <nav
      className={`fixed w-full top-0 z-50 transition-all duration-500 ${
        scrolled ? "py-4" : "py-6"
      }`}
    >
      <div className={`container mx-auto px-6 max-w-6xl`}>
        <div
          className={`flex justify-between items-center rounded-2xl px-6 py-3 transition-all duration-500 ${
            scrolled
              ? "glass-panel bg-slate-900/70 border-slate-700/50 shadow-lg shadow-cyan-900/5"
              : "bg-transparent border-transparent"
          }`}
        >
          {/* Logo Area */}
          <div className="flex items-center gap-3">
            <div className="relative group cursor-default">
              <div className="absolute -inset-1 rounded-lg opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
              <a
                href="#"
                className="relative text-2xl font-black tracking-tighter text-white flex items-center"
              >
                osu!<span className="text-cyan-400">pilot</span>
              </a>
            </div>
            <span className="hidden sm:block px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
              v1.1 BETA
            </span>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.to}
                onClick={() => scrollToSection(link.to)}
                className="text-sm font-medium text-slate-400 hover:text-white transition-colors cursor-pointer relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-cyan-400 transition-all duration-300 group-hover:w-full"></span>
              </button>
            ))}
          </div>

          {/* GitHub Button */}
          <a
            href="https://github.com/Wakype/osu-pilot"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-2 bg-slate-800/80 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all border border-slate-700 hover:border-slate-500 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]"
          >
            <svg
              viewBox="0 0 24 24"
              className="w-5 h-5 fill-current"
              aria-hidden="true"
            >
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.05-.015-2.055-3.33.72-4.035-1.605-4.035-1.605-.54-1.38-1.335-1.755-1.335-1.755-1.085-.735.09-.72.09-.72 1.2.075 1.83 1.23 1.83 1.23 1.065 1.83 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3.005-.405 1.02 0 2.04.135 3.005.405 2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.92 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.285 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            <span className="hidden lg:inline">Star on GitHub</span>
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
