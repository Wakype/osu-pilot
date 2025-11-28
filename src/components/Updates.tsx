import React from "react";

const updates = [
  {
    version: "v1.1.0",
    date: "August 24, 2025",
    title: "The Flow Update",
    changes: [
      "Added 'Flow Aim' algorithm for curved movement.",
      "Fixed issue where spinners would sometimes break combo.",
      "Improved overlay performance on low-end PCs.",
    ],
    highlight: true,
  },
  {
    version: "v1.0.0",
    date: "August 9, 2025",
    title: "Initial Release",
    changes: [
      "Core gameplay loop implemented.",
      "Support for HR, DT, and NC mods.",
      "Automatic .osu file parsing.",
      "Reaction time calibration wizard.",
    ],
    highlight: false,
  },
];

const Updates: React.FC = () => {
  return (
    <section id="updates" className="scroll-mt-32 max-w-4xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Changelog
        </h2>
        <p className="text-slate-400">Tracking the evolution of the project.</p>
      </div>

      <div className="relative border-l border-slate-800 ml-4 md:ml-10 space-y-12">
        {updates.map((update, idx) => (
          <div key={idx} className="relative pl-8 md:pl-12">
            {/* Timeline Dot */}
            <div
              className={`absolute -left-[5px] top-2 w-2.5 h-2.5 rounded-full border-2 ${
                update.highlight
                  ? "bg-cyan-500 border-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.8)]"
                  : "bg-slate-900 border-slate-600"
              }`}
            ></div>

            <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-4 mb-2">
              <h3
                className={`text-2xl font-bold ${
                  update.highlight ? "text-white" : "text-slate-300"
                }`}
              >
                {update.version}
              </h3>
              <span className="text-sm font-mono text-slate-500 bg-slate-900/50 px-2 py-1 rounded border border-slate-800">
                {update.date}
              </span>
            </div>

            <h4 className="text-lg font-semibold text-cyan-400 mb-4">
              {update.title}
            </h4>

            <ul className="space-y-2">
              {update.changes.map((change, cIdx) => (
                <li
                  key={cIdx}
                  className="text-slate-400 flex items-start gap-3 text-sm md:text-base group"
                >
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-slate-700 group-hover:bg-cyan-500 transition-colors"></span>
                  {change}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Updates;
