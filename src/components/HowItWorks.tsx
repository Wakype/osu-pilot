import React, { useState, useEffect, useRef } from "react";
import {
  MagnifyingGlassIcon,
  DocumentTextIcon,
  PlayIcon,
} from "@heroicons/react/24/outline";

// --- TYPES & HELPER MATH ---

type Point = { x: number; y: number };
type HitObject = {
  id: number;
  type: "circle" | "slider";
  position: Point;
  sliderControl?: Point; // Untuk titik lengkung slider
  sliderEnd?: Point;
  timeToHit: number; // Waktu tempuh ke object ini
};

// Fungsi menghitung posisi kurva Bezier (Quadratic) untuk Slider
const getQuadraticBezierXY = (
  t: number,
  start: Point,
  control: Point,
  end: Point
) => {
  const x =
    (1 - t) * (1 - t) * start.x + 2 * (1 - t) * t * control.x + t * t * end.x;
  const y =
    (1 - t) * (1 - t) * start.y + 2 * (1 - t) * t * control.y + t * t * end.y;
  return { x, y };
};

const steps = [
  {
    id: "01",
    title: "Detect",
    desc: "Identifies the active map window title.",
    icon: <MagnifyingGlassIcon className="w-6 h-6" />,
  },
  {
    id: "02",
    title: "Parse",
    desc: "Reads local .osu files instantly.",
    icon: <DocumentTextIcon className="w-6 h-6" />,
  },
  {
    id: "03",
    title: "Execute",
    desc: "Simulates input with humanized delay.",
    icon: <PlayIcon className="w-6 h-6" />,
  },
];

const HowItWorks: React.FC = () => {
  // State Visual
  const [cursor, setCursor] = useState<Point>({ x: 50, y: 50 });
  const [objects, setObjects] = useState<HitObject[]>([]);
  const [hitEffect, setHitEffect] = useState<{
    x: number;
    y: number;
    id: number;
  } | null>(null);
  const [activeSliderPath, setActiveSliderPath] = useState<string | null>(null);

  // Refs untuk Logic Loop (agar tidak re-render berat)
  const reqRef = useRef<number>(0);
  const queueRef = useRef<HitObject[]>([]);
  const lastPosRef = useRef<Point>({ x: 50, y: 50 });
  const nextIdRef = useRef(0);
  const progressRef = useRef(0); // 0.0 sampai 1.0 progress menuju note berikutnya

  // --- GENERATOR LOGIC (Random Patterns) ---
  const generatePattern = (startPos: Point) => {
    const patterns = ["stream", "jump", "slider"];
    const type = patterns[Math.floor(Math.random() * patterns.length)];
    const newObjects: HitObject[] = [];
    let currentPos = { ...startPos };

    // Batas layar aman (10% - 90%)
    const clamp = (val: number) => Math.max(10, Math.min(90, val));

    if (type === "stream") {
      // Generate 5-8 note rapat (Stream)
      const count = 5 + Math.floor(Math.random() * 4);
      const angle = Math.random() * Math.PI * 2;
      const spacing = 4; // Jarak dekat
      for (let i = 0; i < count; i++) {
        currentPos.x = clamp(currentPos.x + Math.cos(angle) * spacing);
        currentPos.y = clamp(currentPos.y + Math.sin(angle) * spacing);
        newObjects.push({
          id: nextIdRef.current++,
          type: "circle",
          position: { ...currentPos },
          timeToHit: 400, // Cepat (ms per note)
        });
      }
    } else if (type === "jump") {
      // Generate 3-5 note jauh (Jumps)
      const count = 3 + Math.floor(Math.random() * 3);
      for (let i = 0; i < count; i++) {
        // Random posisi jauh
        currentPos.x = clamp(Math.random() * 80 + 10);
        currentPos.y = clamp(Math.random() * 80 + 10);
        newObjects.push({
          id: nextIdRef.current++,
          type: "circle",
          position: { ...currentPos },
          timeToHit: 900, // Waktu travel jump
        });
      }
    } else if (type === "slider") {
      // Generate 1 Slider Curved
      const endX = clamp(Math.random() * 80 + 10);
      const endY = clamp(Math.random() * 80 + 10);
      // Control point random di antara start dan end untuk curve
      const controlX = (currentPos.x + endX) / 2 + (Math.random() * 40 - 20);
      const controlY = (currentPos.y + endY) / 2 + (Math.random() * 40 - 20);

      newObjects.push({
        id: nextIdRef.current++,
        type: "slider",
        position: { ...currentPos },
        sliderControl: { x: controlX, y: controlY },
        sliderEnd: { x: endX, y: endY },
        timeToHit: 800, // Slider duration
      });
      currentPos = { x: endX, y: endY }; // Update posisi terakhir ke ujung slider
    }

    return newObjects;
  };

  // --- GAME LOOP ---

  useEffect(() => {
    // Init pertama kali
    queueRef.current = generatePattern({ x: 50, y: 50 });
    setObjects([...queueRef.current]);

    const loop = () => {
      // Jika antrian habis, generate baru
      if (queueRef.current.length === 0) {
        queueRef.current = generatePattern(lastPosRef.current);
        setObjects([...queueRef.current]); // Update state visual
        progressRef.current = 0;
      }

      const currentTarget = queueRef.current[0];
      const speedMultiplier = 0.035; // Kecepatan global simulasi (Makin besar makin cepat)

      // Hitung kecepatan berdasarkan tipe object
      const step = speedMultiplier * (100 / currentTarget.timeToHit) * 16;

      progressRef.current += step;

      let nextCursorPos: Point = { x: 0, y: 0 };

      // Logika Pergerakan Kursor
      if (
        currentTarget.type === "slider" &&
        currentTarget.sliderControl &&
        currentTarget.sliderEnd
      ) {
        // Logika Slider (Bezier Curve)
        setActiveSliderPath(
          `M ${currentTarget.position.x} ${currentTarget.position.y} Q ${currentTarget.sliderControl.x} ${currentTarget.sliderControl.y} ${currentTarget.sliderEnd.x} ${currentTarget.sliderEnd.y}`
        );

        // Jika progress < 0.2, bergerak mendekati head slider. Jika > 0.2, bergerak menelusuri slider
        // Ini penyederhanaan agar kursor 'snapping' ke slider head lalu jalan
        if (progressRef.current > 1) {
          nextCursorPos = currentTarget.sliderEnd;
        } else {
          nextCursorPos = getQuadraticBezierXY(
            progressRef.current,
            currentTarget.position,
            currentTarget.sliderControl,
            currentTarget.sliderEnd
          );
        }
      } else {
        // Logika Circle (Linear Movement / Snapping)
        setActiveSliderPath(null);
        const dx = currentTarget.position.x - lastPosRef.current.x;
        const dy = currentTarget.position.y - lastPosRef.current.y;

        nextCursorPos = {
          x: lastPosRef.current.x + dx * Math.min(progressRef.current, 1),
          y: lastPosRef.current.y + dy * Math.min(progressRef.current, 1),
        };
      }

      setCursor(nextCursorPos);

      // Logika HIT (Jika progress selesai)
      if (progressRef.current >= 1) {
        // Trigger Hit Effect
        setHitEffect({
          x: nextCursorPos.x,
          y: nextCursorPos.y,
          id: Date.now(),
        });

        // Update referensi posisi terakhir untuk gerakan selanjutnya
        if (currentTarget.type === "slider" && currentTarget.sliderEnd) {
          lastPosRef.current = currentTarget.sliderEnd;
        } else {
          lastPosRef.current = currentTarget.position;
        }

        // Hapus object dari antrian
        queueRef.current.shift();
        setObjects([...queueRef.current]); // Render ulang visual circles
        progressRef.current = 0; // Reset progress untuk note berikutnya
      }

      reqRef.current = requestAnimationFrame(loop);
    };

    reqRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(reqRef.current!);
  }, []);

  return (
    <section id="how-it-works" className="scroll-mt-32">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Side: Text */}
          <div className="order-2 md:order-1">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              How It <br />
              <span className="text-cyan-400">Works</span>
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed mb-8">
              The bot operates entirely outside the game's memory space. It acts
              as a visual observer and a hardware input simulator, creating a
              layer of separation between the cheat and the game client.
            </p>
            <div className="flex flex-col gap-4">
              {steps.map((step) => (
                <div
                  key={step.id}
                  className="flex items-center gap-4 p-4 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-cyan-500/50 transition-colors group"
                >
                  <div className="h-12 w-12 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-cyan-400 group-hover:bg-cyan-500/10 transition-all">
                    {step.icon}
                  </div>
                  <div>
                    <h4 className="text-white font-bold">{step.title}</h4>
                    <p className="text-slate-500 text-sm">{step.desc}</p>
                  </div>
                  <span className="ml-auto text-3xl font-black text-slate-800 group-hover:text-cyan-500/20 select-none">
                    {step.id}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side: High-Octane Simulation */}
          <div className="order-1 md:order-2 w-full h-full bg-slate-950 rounded-2xl border border-slate-700 relative overflow-hidden shadow-2xl shadow-black/50 select-none">
            {/* Background Grid */}
            <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>

            {/* HUD Info */}
            <div className="absolute top-4 left-4 z-40 flex flex-col gap-2 pointer-events-none">
              <div className="glass-panel px-3 py-1 rounded text-xs font-mono text-cyan-400 border border-cyan-500/30">
                <span className="text-slate-400 mr-2">POS:</span>
                {cursor.x.toFixed(0)},{cursor.y.toFixed(0)}
              </div>
            </div>

            {/* --- GAMEPLAY LAYER --- */}
            {/* 1. SVG Layer untuk Lines/Trails & Slider Bodies */}
            <svg className="absolute inset-0 w-full h-full z-10 pointer-events-none">
              {/* Draw Slider Body */}
              {activeSliderPath && (
                <path
                  d={activeSliderPath.replaceAll(
                    /([0-9.]+) ([0-9.]+)/g,
                    (_, x, y) => `${x}% ${y}%`
                  )}
                  fill="none"
                  stroke="rgba(6, 182, 212, 0.3)"
                  strokeWidth="40"
                  strokeLinecap="round"
                  className="animate-pulse"
                />
              )}
              {activeSliderPath && (
                <path
                  d={activeSliderPath.replaceAll(
                    /([0-9.]+) ([0-9.]+)/g,
                    (_, x, y) => `${x}% ${y}%`
                  )}
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                />
              )}

              {/* Draw Follow Lines (Garis penghubung antar note) */}
              {objects.map((obj, i) => {
                if (i === 0 && objects.length > 0) return null; // Jangan gambar garis ke diri sendiri
                const prev = objects[i - 1];
                if (!prev) return null;
                return (
                  <line
                    key={`line-${obj.id}`}
                    x1={`${
                      prev.type === "slider" && prev.sliderEnd
                        ? prev.sliderEnd.x
                        : prev.position.x
                    }%`}
                    y1={`${
                      prev.type === "slider" && prev.sliderEnd
                        ? prev.sliderEnd.y
                        : prev.position.y
                    }%`}
                    x2={`${obj.position.x}%`}
                    y2={`${obj.position.y}%`}
                    stroke="rgba(255, 255, 255, 0.4)"
                    strokeWidth="2"
                  />
                );
              })}
            </svg>

            {/* 2. Object Layer (Circles) */}
            {objects.map((obj, index) => (
              <div
                key={obj.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20"
                style={{
                  left: `${obj.position.x}%`,
                  top: `${obj.position.y}%`,
                }}
              >
                {/* Hit Circle */}
                <div
                  className={`w-10 h-10 rounded-full border-2 border-white flex items-center justify-center text-white font-bold text-sm shadow-[0_0_10px_rgba(0,0,0,0.5)]
                    ${
                      index === 0
                        ? "bg-cyan-500 scale-110 ring-4 ring-cyan-500/30"
                        : "bg-slate-800/90"
                    }
                 `}
                >
                  {obj.type === "slider" ? "S" : index + 1}
                </div>

                {/* Approach Rate Ring (Hanya visual sederhana) */}
                {index === 0 && (
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full border border-slate-400 opacity-50 animate-[ping_0.5s_cubic-bezier(0,0,0.2,1)_infinite]"></div>
                )}
              </div>
            ))}

            {/* 3. Hit Effect Layer (Muncul sesaat) */}
            {hitEffect && (
              <div
                key={hitEffect.id}
                className="absolute z-10 w-20 h-20 bg-cyan-400 rounded-full blur-xl opacity-0 animate-[ping_0.3s_ease-out_forwards]"
                style={{
                  left: `${hitEffect.x}%`,
                  top: `${hitEffect.y}%`,
                  transform: "translate(-50%, -50%)",
                }}
              />
            )}

            {/* 4. Cursor Layer (High Precision) */}
            <div
              className="absolute w-8 h-8 z-50 pointer-events-none"
              style={{
                left: `${cursor.x}%`,
                top: `${cursor.y}%`,
                transform: "translate(-50%, -50%)",
                transition: "none", // Disable CSS transition for 1:1 raw JS performance
              }}
            >
              <div className="w-full h-full bg-cyan-400 rounded-full shadow-[0_0_20px_rgba(34,211,238,1)] border-2 border-white relative">
                {/* Cursor Trail */}
                <div className="absolute top-0 left-0 w-full h-full bg-cyan-400/50 rounded-full blur-md animate-pulse"></div>
              </div>
            </div>

            {/* Bottom Status */}
            <div className="absolute bottom-0 w-full bg-slate-900/90 backdrop-blur px-4 py-2 border-t border-slate-800 flex justify-between items-center text-[10px] uppercase tracking-widest font-bold">
              <span className="text-cyan-400 animate-pulse">
                ● Osu!pilot Active
              </span>
              <span className="text-slate-500">
                Simulation
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;