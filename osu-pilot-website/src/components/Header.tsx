import React, { useEffect } from "react";
import { Link } from "react-scroll";

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
    <header
      id="home"
      className="py-24 md:py-32 text-center relative overflow-hidden animate-in"
      style={{ animationDelay: "100ms" }}
    >
      <div className="absolute -top-1/2 -left-1/4 w-full h-[150%] animate-pulse"></div>
      <div className="container mx-auto px-6 relative z-20 pt-10">
        <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight">
          Achieve Flawless{" "}
          <span className="text-cyan-400 text-glow-cyan">osu!</span> Gameplay
        </h1>
        <p className="mt-6 text-lg md:text-xl max-w-3xl mx-auto text-slate-400">
          <span className="text-cyan-400 text-glow-cyan">osu!pilot</span> is a bot that plays osu! with high accuracy by reading the beatmap files. It performs based on the map's data, without touching the game's memory.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
          <Link
            to="setup"
            smooth={true}
            duration={500}
            offset={-80}
            className="w-full sm:w-auto bg-cyan-500 text-white font-bold py-3 px-8 rounded-lg hover:bg-cyan-600 transition-all transform hover:scale-105 button-glow cursor-pointer"
          >
            Get Started
          </Link>
          <a
            href="https://github.com/Wakype/osu-pilot"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto bg-slate-700 text-slate-200 font-bold py-3 px-8 rounded-lg hover:bg-slate-600 transition-all"
          >
            View Source
          </a>
        </div>
        <div className="mt-20 max-w-5xl mx-auto aspect-video bg-slate-900 rounded-2xl shadow-2xl border border-slate-700 flex items-center justify-center p-2 card-glow overflow-hidden">
          <div
            className="sp-embed-player w-full h-full"
            data-id="cTjQqZnIWSm"
          >
            <iframe
              width="100%"
              height="100%"
              title="osu!pilot Demo"
              style={{ border: 0, borderRadius: '12px' }}
              src="https://go.screenpal.com/player/cTjQqZnIWSm?width=100%&height=100%&ff=1&title=0&controls=0&cc=0&autoplay=1&mute=1"
              allowFullScreen={true}
              allow="autoplay"
            ></iframe>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;