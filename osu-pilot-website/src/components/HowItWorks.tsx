import React from 'react';
// Impor ikon yang kita butuhkan
import {
  MagnifyingGlassIcon,
  DocumentTextIcon,
  ShieldCheckIcon,
  ClockIcon,
  PlayIcon,
} from '@heroicons/react/24/outline';

// Data untuk setiap langkah
const steps = [
  {
    icon: <MagnifyingGlassIcon className="w-10 h-10 text-cyan-400" />,
    title: 'Detect',
    description:
      'The bot watches the osu! window title to identify the current beatmap, knowing exactly when a song is selected.',
  },
  {
    icon: <DocumentTextIcon className="w-10 h-10 text-cyan-400" />,
    title: 'Parse',
    description:
      'It instantly finds and reads the corresponding `.osu` file to understand every circle, slider, and spinner on the map.',
  },
  {
    icon: <ShieldCheckIcon className="w-10 h-10 text-cyan-400" />,
    title: 'Standby',
    description:
      "All map data is processed. The system is now in standby mode, awaiting user initiation to execute the play.",
  },
  {
    icon: <ClockIcon className="w-10 h-10 text-cyan-400" />,
    title: 'Sync',
    description:
      "On your hotkey press, the bot syncs its internal clock with the song, using your personal reaction offset for perfect timing.",
  },
  {
    icon: <PlayIcon className="w-10 h-10 text-cyan-400" />,
    title: 'Execute',
    description:
      'The bot takes full control, playing through the map with calculated precision until the very last note is hit.',
  },
];

const HowItWorks: React.FC = () => {
  return (
    <section
      id="how-it-works"
      className="animate-in"
      style={{ animationDelay: '250ms' }}
    >
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold text-white">How It Works</h2>
        <p className="mt-3 max-w-2xl mx-auto text-slate-400">
          A transparent, five-step process ensures safe and accurate gameplay.
        </p>
      </div>

      {/* Container untuk Grid Ikon */}
      <div className="container max-w-5xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Item kelima perlu perlakuan khusus agar center di grid 2 kolom */}
          {steps.map((step, index) => (
            <div
              key={step.title}
              className={`p-8 overflow-hidden relative bg-slate-800/50 rounded-2xl group transition-all duration-300 ease-in-out hover:-translate-y-2 hover:shadow-2xl hover:shadow-cyan-500/10 border border-slate-700
                ${index === 4 ? 'md:col-span-2 md:max-w-md md:mx-auto' : ''}
              `}
            >
              <p className='font-bold text-white text-[150px] absolute -bottom-16 -left-10 opacity-15 -z-50'>0{index + 1}</p>
              <div className="flex items-start gap-6 z-50">
                {/* Ikon */}
                <div className="flex-shrink-0 w-16 h-16 bg-slate-800 rounded-lg flex items-center justify-center border border-slate-700">
                  {step.icon}
                </div>
                {/* Teks */}
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-slate-400 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;