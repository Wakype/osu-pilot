import React, { useState, useEffect } from "react";
import { Link } from "react-scroll";

const Navbar: React.FC = () => {
  const [isTop, setIsTop] = useState<boolean>(false);

  const toggleVisibility = () => {
    if (window.pageYOffset > 30) {
      setIsTop(true);
    } else {
      setIsTop(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  return (
    <nav
      className={`fixed w-full top-0 z-50 bg-slate-900/80 backdrop-blur-lg ease-in-out transition-all duration-700 ${
        isTop ? "py-0" : "py-3"
      }`}
    >
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-x-2">
          <a href="#" className="text-2xl font-bold text-white">
            osu!<span className="text-cyan-400 text-glow-cyan">pilot</span>
          </a>
          <div className="bg-slate-600/50 rounded-sm text-sm font-mono text-white font-bold relative px-4 py-1 mt-1">
            <code className="block overflow-x-auto">v1.0</code>
          </div>
        </div>
        <div className="hidden md:flex items-center space-x-8 text-sm font-medium">
          <Link
            to="features"
            smooth={true}
            duration={500}
            offset={-80}
            className="text-slate-400 hover:text-cyan-400 transition-colors cursor-pointer"
          >
            Features
          </Link>
          <Link
            to="how-it-works"
            smooth={true}
            duration={500}
            offset={-80}
            className="text-slate-400 hover:text-cyan-400 transition-colors cursor-pointer"
          >
            How It Works
          </Link>
          <Link
            to="setup"
            smooth={true}
            duration={500}
            offset={-80}
            className="text-slate-400 hover:text-cyan-400 transition-colors cursor-pointer"
          >
            Get Started
          </Link>
          <Link
            to="faq"
            smooth={true}
            duration={500}
            offset={-80}
            className="text-slate-400 hover:text-cyan-400 transition-colors cursor-pointer"
          >
            FAQ
          </Link>
          <Link
            to="updates"
            smooth={true}
            duration={500}
            offset={-80}
            className="text-slate-400 hover:text-cyan-400 transition-colors cursor-pointer"
          >
            Changelog
          </Link>

          {/* Tombol GitHub dengan Gaya Baru */}
          <a
            href="https://github.com/Wakype/osu-pilot"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-x-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-4 py-2 rounded-lg transition-colors duration-300"
          >
            {/* SVG Ikon GitHub */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.91 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            GitHub
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
