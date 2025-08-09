import React from "react";
import {
  ClockIcon,
  BoltIcon as ZapIcon,
  CursorArrowRaysIcon,
} from "@heroicons/react/24/outline";

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: <CursorArrowRaysIcon className="h-7 w-7 text-cyan-400" />,
    title: "Human-like Movement",
    description:
      "Moves like a real player using curved Bezier paths, natural jitter, and an optional 'Flow Aim' mode for realistic, flowing aim.",
  },
  {
    icon: <ClockIcon className="h-7 w-7 text-cyan-400" />,
    title: "Perfect Synchronization",
    description:
      "A one-time reaction calibration test ensures the bot's timing is perfectly synced to your personal reaction speed.",
  },
  {
    icon: <ZapIcon className="h-7 w-7 text-cyan-400" />,
    title: "Full Mod Support",
    description:
      "Natively handles HR, DT, and NC by recalculating map data on the fly, all controlled from a clean UI overlay.",
  },
];

const Features: React.FC = () => {
  return (
    <section
      id="features"
      className="animate-in"
      style={{ animationDelay: "200ms" }}
    >
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold text-white">Core Features</h2>
        <p className="mt-3 max-w-2xl mx-auto text-slate-400">
          A powerful feature set designed for accuracy and ease of use.
        </p>
      </div>
      <div className="grid md:grid-cols-3 gap-8">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="bg-slate-800/50 border hover:shadow-2xl hover:shadow-cyan-500/10 border-slate-700 p-8 rounded-2xl text-center hover:-translate-y-2 transition-transform"
          >
            <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-slate-700 mb-5 border border-slate-600">
              {feature.icon}
            </div>
            <h3 className="text-xl font-semibold text-white">
              {feature.title}
            </h3>
            <p className="mt-2 text-slate-400">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;
