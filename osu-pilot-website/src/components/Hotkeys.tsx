import React from "react";

interface Hotkey {
  key: string;
  action: string;
}

const hotkeys: Hotkey[] = [
  { key: "Q", action: "Syncs the bot on the first note to start." },
  { key: "Esc", action: "Stops the bot during a run." },
  { key: "Ctrl + Page Up", action: "Toggles the overlay visibility." },
  { key: "Ctrl + Page Down", action: "Shuts down the entire script." },
];

const Hotkeys: React.FC = () => {
  return (
    <section
      id="hotkeys"
      className="animate-in"
      style={{ animationDelay: "350ms" }}
    >
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-white">Hotkeys</h2>
        <p className="mt-3 max-w-2xl mx-auto text-slate-400">
          Control the bot with these simple key combinations.
        </p>
      </div>
      <div className="max-w-2xl mx-auto bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
        <table className="w-full text-left">
          <thead className="border-b border-slate-600">
            <tr>
              <th className="p-4 text-sm font-semibold text-white">Key</th>
              <th className="p-4 text-sm font-semibold text-white">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {hotkeys.map((hotkey) => (
              <tr key={hotkey.key}>
                <td className="p-4 font-mono font-bold text-cyan-400">{hotkey.key}</td>
                <td className="p-4 text-slate-300">{hotkey.action}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default Hotkeys;
