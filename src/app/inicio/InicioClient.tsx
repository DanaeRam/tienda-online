"use client";

import { useEffect, useMemo, useState } from "react";

/* ---------- Utilidades simples ---------- */
function GradText({ children }: { children: React.ReactNode }) {
  // Mock pasos/corazón
const steps = 5460;         // de 8k objetivo
const stepsGoal = 8000;
const stepsPct = Math.min(100, Math.round((steps / stepsGoal) * 100));
const heartBpm = 105;

// Tendencia del ritmo cardiaco (mock)
const heartTrend = +3; // bpm vs. ayer (puedes calcularlo real luego)

// Animaciones
const [animateBars, setAnimateBars] = useState(false);
const [animateRing, setAnimateRing] = useState(false);

useEffect(() => {
  // doble RAF para asegurar animación en Edge
  let r1 = 0, r2 = 0, r3 = 0, r4 = 0;
  r1 = requestAnimationFrame(() => {
    r2 = requestAnimationFrame(() => setAnimateBars(true));
  });
  r3 = requestAnimationFrame(() => {
    r4 = requestAnimationFrame(() => setAnimateRing(true));
  });
  return () => {
    cancelAnimationFrame(r1); cancelAnimationFrame(r2);
    cancelAnimationFrame(r3); cancelAnimationFrame(r4);
  };
}, []);

  return (
    <span className="bg-gradient-to-r from-blue-600 to-green-400 bg-clip-text text-transparent">
      {children}
    </span>
  );
}

export default function InicioClient() {
  const [name, setName] = useState<string>("");

  // Nombre guardado
  useEffect(() => {
    try {
      const stored = localStorage.getItem("userName");
      setName(stored || "Usuario");
    } catch {
      setName("Usuario");
    }
  }, []);

  // Datos mock del día
  const summary = useMemo(
    () => ({
      supplements: ["Omega-3", "Vitamina D", "Magnesio"],
      habits: ["Hidratación", "10 min respiración", "Caminar 20 min"],
      status: "Tu energía está en buen nivel",
    }),
    []
  );

  // Progreso semanal (0–100)
  const weeklyProgress = useMemo(() => [60, 75, 50, 80, 70, 65, 90], []);

  // Animación barras
  const [animateBars, setAnimateBars] = useState(false);
  useEffect(() => {
    let raf1 = 0, raf2 = 0;
    raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => setAnimateBars(true));
    });

    
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, []);

  // Mock pasos/corazón
  const steps = 5460;         // de 8k objetivo
  const stepsGoal = 8000;
  const stepsPct = Math.min(100, Math.round((steps / stepsGoal) * 100));
  const heartBpm = 105;

  const tips = [
    "Pequeños hábitos, grandes cambios.",
    "Respira 4-4-4 durante 1 minuto.",
    "Hidrátate: un vaso de agua ahora.",
    "Camina 5 minutos, estírate.",
    "Apaga pantallas 30 min antes de dormir.",
    "Agradece 3 cosas de hoy.",
    "La constancia vence a la perfección.",
  ];
  const tip = tips[new Date().getDay() % tips.length];

  return (
    <main className="min-h-svh w-full bg-white">
      {/* Header */}
      <header className="px-6 pt-8 pb-4">
        <h1 className="text-2xl font-semibold text-gray-900">
          Hola, {name}.{" "}
          <span className="font-normal">
            Hoy es un buen día para cuidar tu <GradText>bienestar</GradText>.
          </span>
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          {new Date().toLocaleDateString("es-MX", {
            weekday: "long",
            day: "2-digit",
            month: "short",
          })}
        </p>
      </header>

      {/* Grid de tarjetas principales */}
      <section className="px-6 grid grid-cols-2 gap-4">
        {/* Card Heart */}
        <article className="col-span-1 rounded-2xl p-4 shadow-sm border relative overflow-hidden
                            bg-gradient-to-b from-blue-50 to-green-50">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-700">Ritmo Cardíaco</h3>
            {/* ícono minimal */}
            <svg viewBox="0 0 24 24" className="h-4 w-4 text-blue-500" fill="currentColor" aria-hidden>
              <path d="M12 21s-6.7-4.8-9.3-7.4A6 6 0 1 1 12 5a6 6 0 1 1 9.3 8.6C18.7 16.2 12 21 12 21z"/>
            </svg>
          </div>
          {/* Onda simple */}
          <svg viewBox="0 0 200 80" className="w-full h-20">
            <path
              d="M0,50 Q30,10 60,40 T120,40 T180,30 T220,50"
              className="stroke-[3] fill-none"
              style={{ stroke: "url(#g)" }}
            />
            <defs>
              <linearGradient id="g" x1="0" x2="1">
                <stop offset="0" stopColor="#2563eb" />
                <stop offset="1" stopColor="#22c55e" />
              </linearGradient>
            </defs>
          </svg>
          <p className="mt-2 text-2xl font-semibold">
            <GradText>{heartBpm}</GradText> <span className="text-gray-500 text-sm">bpm</span>
          </p>
        </article>

        {/* Card Walk */}
        <article className="col-span-1 rounded-2xl p-4 shadow-sm border relative overflow-hidden
                    bg-gradient-to-b from-blue-50 to-green-50">
  <div className="flex items-center justify-between mb-3">
    <h3 className="text-sm font-medium text-gray-700">Pasos</h3>
    <svg viewBox="0 0 24 24" className="h-4 w-4 text-green-500" fill="currentColor" aria-hidden>
      <path d="M13 5a2 2 0 1 0-2-2 2 2 0 0 0 2 2zM6 22l2-6 3-2 2 3v5h2v-6l-1.5-2.5 1-2.5a5 5 0 0 0-4.6-3H9l-2 5 2 1 1-3 1.6.4-.9 2.1L7 17l-1 5z"/>
    </svg>
  </div>

          {/* Aro de progreso con degradado */}
          <div className="relative mx-auto h-24 w-24">
            <svg viewBox="0 0 36 36" className="h-24 w-24">
              <defs>
                <linearGradient id="ring" x1="0" x2="1">
                  <stop offset="0" stopColor="#2563eb" />
                  <stop offset="1" stopColor="#22c55e" />
                </linearGradient>
              </defs>
              <circle cx="18" cy="18" r="15" fill="none" stroke="#e5e7eb" strokeWidth="4" />
              <circle
                cx="18" cy="18" r="15" fill="none"
                stroke="url(#ring)" strokeWidth="4" strokeLinecap="round"
                strokeDasharray={`${(stepsPct / 100) * 94.2} 94.2`}
                transform="rotate(-90 18 18)"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className="text-lg font-semibold">{steps}</p>
                <p className="text-[10px] text-gray-500">pasos</p>
              </div>
            </div>
          </div>

          <p className="mt-2 text-xs text-gray-500 text-center">
            Objetivo: {stepsGoal.toLocaleString()} — <GradText>{stepsPct}%</GradText>
          </p>
        </article>
      </section>

      {/* Resto en tarjetas minimalistas */}
      <section className="px-6 mt-4 grid gap-4">
        {/* Estado general */}
        <article className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500 mb-1">Estado general</p>
          <p className="text-gray-800">{summary.status}</p>
        </article>

        {/* Resumen del día */}
        <article className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500 mb-3">Resumen del día</p>
          <div className="grid gap-4">
            <div>
              <p className="text-xs text-gray-500 mb-1">Suplementos recomendados</p>
              <ul className="flex flex-wrap gap-2">
                {summary.supplements.map((s) => (
                  <li key={s} className="rounded-full border px-3 py-1 text-sm text-gray-800">
                    {s}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Hábitos activos</p>
              <ul className="flex flex-wrap gap-2">
                {summary.habits.map((h) => (
                  <li key={h} className="rounded-full border px-3 py-1 text-sm text-gray-800">
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </article>

        {/* Gráfica semanal animada */}
        <article className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500 mb-3">Progreso semanal</p>
          <div className="flex items-end justify-between gap-2 h-28 overflow-hidden">
            {weeklyProgress.map((v, i) => {
              const clamped = Math.max(6, Math.min(100, v));
              const scale = clamped / 100;
              const delayMs = i * 120;
              return (
                <div key={i} className="flex flex-col items-center gap-2 h-full">
                  <div
                    className="w-7 h-full rounded-lg bg-gradient-to-b from-blue-600 to-green-400"
                    style={{
                      transformOrigin: "bottom",
                      transform: `translateZ(0) scaleY(${animateBars ? scale : 0})`,
                      transition: "transform 800ms ease-out",
                      transitionDelay: `${delayMs}ms`,
                      willChange: "transform",
                    }}
                    title={`${v}%`}
                    aria-label={`Día ${i + 1}: ${v}%`}
                  />
                  <span className="text-[10px] text-gray-500">{"DLMMJVS"[i]}</span>
                </div>
              );
            })}
          </div>
          <div className="mt-2 text-right">
            <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs text-green-700">
              +{Math.max(0, weeklyProgress[6] - weeklyProgress[0])}% vs. inicio de semana
            </span>
          </div>
        </article>

        {/* Tip motivacional */}
        <article className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500 mb-2">Tip de hoy</p>
          <p className="text-gray-800">{tip}</p>
          <div className="mt-5">
            <button
              className="w-full rounded-full px-8 py-3 text-white font-semibold 
                         bg-gradient-to-r from-blue-600 to-green-400 shadow-md 
                         hover:opacity-90 active:scale-95 transition-transform duration-150"
              onClick={() => alert("Próximamente: más acciones de bienestar ✨")}
            >
              Comenzar mi rutina
            </button>
          </div>
        </article>
      </section>
    </main>
  );
}
