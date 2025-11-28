import React, { useState } from "react";
import { PlusIcon, MinusIcon } from "@heroicons/react/24/outline";

const faqData = [
  {
    question: "Is this safe to use?",
    answer:
      "Any form of automation is against the osu! community rules. Using this on official servers carries a high risk of being banned. This tool works by reading map files, not game memory, but it is still detectable via heuristics. We are not responsible for any account restrictions. <strong>Use it offline or on private servers only.</strong>",
  },
  {
    question: "How can I customize the cursor movement?",
    answer:
      "You have full control over the movement style directly from the overlay! You can toggle the <strong>\"Flow Aim\"</strong> option to switch between a momentum-based algorithm for flowing curves and the default random-curve style. For more advanced tweaks, parameters like spin speed or jitter strength can be adjusted in the <strong>`config.py`</strong> and <strong>`pilot.py`</strong> files.",
  },
  {
    question: "What is the \"Flow Aim\" option?",
    answer:
      "Flow Aim is an advanced movement style that uses momentum. It analyzes the previous note's position to create a smoother, more connected path to the next one. This results in natural-looking 'S' curves during turns, mimicking how a human player's arm would flow across the screen.",
  },
  {
    question: "Why is calibration necessary?",
    answer:
      "Calibration syncs the bot's timing with your personal reaction time and system's visual delay. It only needs to be done once, as the result is saved automatically. If you feel the timing is off, you can recalibrate anytime by clicking <strong>\"Start New Calibration\"</strong> when you launch the script.",
  },
  {
    question: "Does this work with all mods?",
    answer:
      "The bot has built-in support for <strong>Hard Rock (HR)</strong>, <strong>Double Time (DT)</strong>, and <strong>Nightcore (NC)</strong>, which can be toggled from the overlay. Other mods that don't alter note positions or timing (like Hidden) may work, but are not officially supported.",
  },
  {
    question: "The bot missed a note, what should I do?",
    answer:
      "The most common reason for a miss is an imperfect initial sync. Try starting the map again and press the <strong>'Q' key</strong> at the exact moment the very first circle appears. If misses persist, ensure your system isn't under heavy load, or try running the calibration again.",
  },
  {
    question: "What operating systems does this work on?",
    answer:
      "Currently, osu!pilot is only compatible with <strong>Windows</strong>. This is because it relies on specific libraries to detect the game window and control the cursor which are unique to the Windows OS.",
  },
];

const Faq: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="scroll-mt-32 max-w-3xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Frequently Asked <span className="text-cyan-400">Questions</span>
        </h2>
        <p className="text-slate-400">
          Everything you need to know about safety, configuration, and mechanics.
        </p>
      </div>

      <div className="space-y-4">
        {faqData.map((item, index) => (
          <div
            key={index}
            className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
              openIndex === index
                ? "bg-slate-800/60 border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.1)]"
                : "bg-slate-900/40 border-slate-800 hover:border-slate-600"
            }`}
          >
            <button
              onClick={() => toggle(index)}
              className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
            >
              <span
                className={`font-semibold text-lg transition-colors ${
                  openIndex === index ? "text-cyan-400" : "text-slate-200"
                }`}
              >
                {item.question}
              </span>
              <span
                className={`p-2 rounded-full transition-colors ${
                  openIndex === index
                    ? "bg-cyan-500/20 text-cyan-400"
                    : "bg-slate-800 text-slate-500"
                }`}
              >
                {openIndex === index ? (
                  <MinusIcon className="w-5 h-5" />
                ) : (
                  <PlusIcon className="w-5 h-5" />
                )}
              </span>
            </button>
            <div
              className={`transition-all duration-300 ease-in-out ${
                openIndex === index
                  ? "max-h-96 opacity-100"
                  : "max-h-0 opacity-0"
              }`}
            >
              <div className="px-6 pb-6 text-slate-400 leading-relaxed text-sm md:text-base">
                <p dangerouslySetInnerHTML={{ __html: item.answer }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Faq;