import React from "react";

interface FaqItemProps {
  question: string;
  answer: string;
}

const faqItems: FaqItemProps[] = [
  {
    question: "Is this safe to use?",
    answer:
      "Any form of automation is against the osu! community rules. Using this on official servers carries a high risk of being banned. This tool works by reading map files, not game memory, but it is still detectable. We are not responsible for any account restrictions. <strong>Use it offline or on private servers only.</strong>",
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
      "The most common reason for a miss is an imperfect initial sync. Try starting the map again and press the <strong>'q' key</strong> at the exact moment the very first circle appears. If misses persist, ensure your system isn't under heavy load, or try running the calibration again.",
  },
  {
    question: "What operating systems does this work on?",
    answer:
      "Currently, osu!pilot is only compatible with <strong>Windows</strong>. This is because it relies on specific libraries to detect the game window and control the cursor which are unique to the Windows OS.",
  },
];

const FaqItem: React.FC<FaqItemProps> = ({ question, answer }) => (
  <details className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 group hover:shadow-2xl hover:shadow-cyan-500/10">
    <summary className="font-semibold text-white cursor-pointer list-none relative flex justify-between items-center">
      {question}
      <span className="text-cyan-400 transform transition-transform duration-200 group-open:rotate-45">
        +
      </span>
    </summary>
    <p
      className="mt-4 text-slate-400"
      dangerouslySetInnerHTML={{ __html: answer }}
    ></p>
  </details>
);

const Faq: React.FC = () => {
  return (
    <section
      id="faq"
      className="animate-in"
      style={{ animationDelay: "400ms" }}
    >
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-white">
          Frequently Asked Questions
        </h2>
        <p className="mt-3 max-w-2xl mx-auto text-slate-400">
          Have questions? We have answers.
        </p>
      </div>
      <div className="max-w-3xl mx-auto space-y-4">
        {faqItems.map((item) => (
          <FaqItem
            key={item.question}
            question={item.question}
            answer={item.answer}
          />
        ))}
      </div>
    </section>
  );
};

export default Faq;