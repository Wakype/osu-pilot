import React from "react";

const updates = [
  {
    version: "Version 1.0 - Initial Release",
    description:
      "The first public release of osu!pilot. This version includes all core features: human-like movement with curved aim, zero-config setup that automatically finds your osu! folder, support for HR/DT/NC mods, and a in-game overlay.",
    date: "Released on August 9, 2025",
    link: "https://github.com/Caius-A/osu-pilot/releases/tag/v1.0.0",
  },
];

const Updates: React.FC = () => {
  return (
    <section
      id="updates"
      className="animate-in"
      style={{ animationDelay: "500ms" }}
    >
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-white">Latest Updates</h2>
        <p className="mt-3 max-w-2xl mx-auto text-slate-400">
          Stay informed about the latest improvements and fixes.
        </p>
      </div>
      <div className="max-w-3xl mx-auto space-y-6">
        {updates.map((update) => (
          <div
            key={update.version}
            className="bg-slate-800/50 border border-slate-700 p-6 rounded-lg space-y-5"
          >
            <a
              href={update.link}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors"
            >
              <h3 className="text-xl font-semibold text-white mb-3 hover:text-cyan-400">
                {update.version}
              </h3>
            </a>
            <p className="text-slate-400">{update.description}</p>
            <p className="text-sm text-slate-500 mt-1">{update.date}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Updates;
