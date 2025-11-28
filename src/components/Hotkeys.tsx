import React from "react";

const Hotkeys: React.FC = () => {
  const commands = [
    {
      key: "Q",
      label: "Sync / Start",
      desc: "Press on the first note to sync & engage.",
      width: "w-16",
    },
    {
      key: "Esc",
      label: "Stop",
      desc: "Instantly pauses the bot logic.",
      width: "w-16",
    },
    {
      key: "Ctrl + PgUp",
      label: "Overlay Toggle",
      desc: "Shows or hides the in-game menu.",
      width: "w-32",
    },
    {
      key: "Ctrl + PgDn",
      label: "Kill Switch",
      desc: "Terminates the entire program immediately.",
      width: "w-32",
    },
  ];

  return (
    <section id="hotkeys" className="scroll-mt-32">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Hotkeys
        </h2>
        <p className="text-slate-400">
          Master the controls for seamless automation.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {commands.map((cmd) => (
          <div
            key={cmd.key}
            className="group relative flex items-center gap-6 bg-slate-900/40 border border-slate-800 p-6 rounded-2xl hover:bg-slate-800/60 hover:border-cyan-500/30 transition-all duration-300"
          >
            {/* Mechanical Keycap Visual */}
            <div className="flex-shrink-0">
              <div
                className={`relative h-14 ${cmd.width} bg-slate-800 rounded-lg border-b-4 border-slate-950 shadow-lg group-hover:translate-y-[2px] group-hover:border-b-2 group-hover:shadow-none transition-all duration-150 flex items-center justify-center`}
              >
                <span className="text-cyan-400 font-bold font-mono text-sm tracking-wider group-hover:text-cyan-300">
                  {cmd.key}
                </span>
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-cyan-400/10 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-white font-bold text-lg mb-1 group-hover:text-cyan-400 transition-colors">
                {cmd.label}
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                {cmd.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Hotkeys;