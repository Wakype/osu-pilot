import React from "react";
import { KeyIcon, PlayIcon, Cog6ToothIcon } from "@heroicons/react/24/outline";

const HowToUse: React.FC = () => {
  return (
    <section id="how-to-use" className="scroll-mt-32">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-white">
          How to Use?
        </h2>
        <p className="text-slate-400 mt-2">
          Follow these steps for a perfect run.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {[
          {
            icon: <KeyIcon className="w-8 h-8" />,
            title: "1. Bind Keys",
            text: "Ensure your osu! keybindings are set to 'A' and 'S'. The bot mimics these keystrokes.",
          },
          {
            icon: <Cog6ToothIcon className="w-8 h-8" />,
            title: "2. Configure",
            text: "Select your mods (HR/DT) in the overlay before starting the map.",
          },
          {
            icon: <PlayIcon className="w-8 h-8" />,
            title: "3. Sync & Start",
            text: "Start the map. Press 'Q' exactly when the first hit-circle appears.",
          },
        ].map((item, idx) => (
          <div
            key={idx}
            className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl text-center hover:bg-slate-800/60 transition-colors"
          >
            <div className="w-16 h-16 mx-auto bg-slate-800 rounded-full flex items-center justify-center text-cyan-400 mb-4 shadow-lg shadow-cyan-900/20">
              {item.icon}
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
            <p className="text-slate-400 text-sm">{item.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HowToUse;
