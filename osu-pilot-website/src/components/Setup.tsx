import React, { useState } from "react";

interface CodeBlockProps {
  children: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ children }) => {
  const [copyText, setCopyText] = useState<"Copy" | "Copied!">("Copy");

  const handleCopy = () => {
    navigator.clipboard.writeText(children).then(() => {
      setCopyText("Copied!");
      setTimeout(() => setCopyText("Copy"), 2000);
    });
  };

  return (
    <div className="mt-2 bg-slate-900 rounded-lg p-3 text-sm font-mono text-slate-300 relative">
      <code className="block overflow-x-auto">{children}</code>
      <button
        onClick={handleCopy}
        className={`cursor-pointer absolute top-2 right-2 bg-slate-700 hover:bg-slate-600 text-slate-300 px-3 py-1 text-xs rounded-md transition-all ${
          copyText === "Copied!" ? "!bg-green-600 !text-white" : ""
        }`}
      >
        {copyText}
      </button>
    </div>
  );
};

const Setup: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"exe" | "source">("exe");

  const renderContent = () => {
    if (activeTab === "exe") {
      return (
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-white">
              1. Download the Executable
            </h3>
            <p className="mt-1 text-sm text-slate-400">
              Get the latest `osu!pilot.exe` from the GitHub Releases page.
            </p>
            <a
              href="https://github.com/Wakype/osu-pilot/releases"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block text-cyan-400 hover:underline text-sm"
            >
              Go to Releases &rarr;
            </a>
          </div>
          <div className="border-t border-slate-700 my-4"></div>
          <div>
            <h3 className="text-lg font-semibold text-white">
              2. Run & Calibrate (First Time Only)
            </h3>
            <p className="mt-1 text-sm text-slate-400">
              Run the `.exe`. The first time, you'll complete a quick reaction time
              test. On future launches, you can use the "Use Previous" button
              to skip this instantly.
            </p>
          </div>
          <div className="border-t border-slate-700 my-4"></div>
          <div>
            <h3 className="text-lg font-semibold text-white">3. Play!</h3>
            <p className="mt-1 text-sm text-slate-400">
              That's it! The bot will automatically find your osu! folder. Open
              osu!, pick a map, and follow the on-screen overlay.
            </p>
          </div>
        </div>
      );
    }
    return (
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-white">
            1. Clone & Install Dependencies
          </h3>
          <p className="mt-1 text-sm text-slate-400">
            With Python 3.8+ and Git installed, clone the repository and
            install the required packages.
          </p>
          <CodeBlock>
            git clone https://github.com/Wakype/osu-pilot.git
          </CodeBlock>
          <CodeBlock>pip install -r requirements.txt</CodeBlock>
        </div>
        <div className="border-t border-slate-700 my-4"></div>
        <div>
          <h3 className="text-lg font-semibold text-white">
            2. Run the Bot
          </h3>
          <p className="mt-1 text-sm text-slate-400">
            That's it! No manual configuration is needed. Navigate to the
            project folder and run the script. The first launch will require
            calibration.
          </p>
          <CodeBlock>python main.py</CodeBlock>
        </div>
      </div>
    );
  };

  return (
    <section
      id="setup"
      className="animate-in"
      style={{ animationDelay: "300ms" }}
    >
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-white">Get Started</h2>
        <p className="mt-3 max-w-2xl mx-auto text-slate-400">
          The bot automatically finds your osu! folder. Just download and run.
        </p>
      </div>
      <div className="max-w-3xl mx-auto bg-slate-800/50 border border-slate-700 rounded-2xl p-2">
        <div className="flex p-1 bg-slate-700/50 rounded-lg mb-6">
          <button
            onClick={() => setActiveTab("exe")}
            className={`cursor-pointer flex-1 py-2 px-4 text-sm font-semibold rounded-md transition-colors ${
              activeTab === "exe" ? "bg-cyan-500 text-white" : "text-slate-400"
            }`}
          >
            For Users (.exe)
          </button>
          <button
            onClick={() => setActiveTab("source")}
            className={`cursor-pointer flex-1 py-2 px-4 text-sm font-semibold rounded-md transition-colors ${
              activeTab === "source"
                ? "bg-cyan-500 text-white"
                : "text-slate-400"
            }`}
          >
            For Developers (Source)
          </button>
        </div>
        <div className="px-6 pb-6">{renderContent()}</div>
      </div>
    </section>
  );
};

export default Setup;