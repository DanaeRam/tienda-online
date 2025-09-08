"use client";

import { useEffect, useMemo, useState } from "react";

/** Utilidad: texto con degradado de marca */
const GradText = ({ children }: { children: React.ReactNode }) => (
  <span className="bg-gradient-to-r from-blue-600 to-green-400 bg-clip-text text-transparent">
    {children}
  </span>
);

/** Badge minimal */
const Badge = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
    {children}
  </span>
);

export default function ResultadosClient() {
  // Nombre para saludo (si viene de /auth)
  const [name, setName] = useState("Usuario");
  useEffect(() => {
    try {
      const n = localStorage.getItem("userName");
      if (n) setName(n);
    } catch {}
  }, []);

  // Datos mock (cámbialos cuando conectes tu API real)
  const epiScore = 82; // score epigenético
  const epiAgeDelta = -3; // años biológicos vs cronológicos (mejor si negativo)
  const epiTags = ["Inflamación baja", "Sueño aceptable", "Estrés moderado"];

  // Serie semanal compacta (L a D)
  // Cada punto: { ex: ejercicio (min), hr: heart rate (bpm medio), steps: pasos/1000 }
  const weekly = useMemo(
    () => ([
      { d: "L", ex: 20, hr: 78, steps: 4.2 },
      { d: "M", ex: 35, hr: 80, steps: 5.1 },
      { d: "M", ex: 15, hr: 84, steps: 3.3 },
      { d: "J", ex: 40, hr: 77, steps: 6.0 },
      { d: "V", ex: 30, hr: 82, steps: 4.9 },
      { d: "S", ex: 25, hr: 79, steps: 5.6 },
      { d: "D", ex: 10, hr: 81, steps: 2.7 },
    ]),
    []
  );

  // Animación de entrada
  const [animate, setAnimate] = useState(false);
  useEffect(() => {
    let r1 = 0, r2 = 0;
    r1 = requestAnimationFrame(() => { r2 = requestAnimationFrame(() => setAnimate(true)); });
    return () => { cancelAnimationFrame(r1); cancelAnimationFrame(r2); };
  }, []);

  return (
    <main className="min-h-svh w-full bg-white">
      {/* encabezado */}
      <header className="px-6 pt-8 pb-4">
        <h1 className="text-2xl font-semibold text-gray-900">
          Hola, {name}. <span className="font-normal">Aquí están tus <GradText>Resultados</GradText>.</span>
        </h1>
      </header>

      <section className="px-6 space-y-6 pb-10">
        {/* Tarjeta: Resultados epigenéticos */}
<article className="rounded-2xl p-5 shadow-sm border relative overflow-hidden
                    bg-gradient-to-b from-blue-50 to-green-50">
  <div className="flex items-start justify-between gap-4">
    <div>
      <p className="text-sm text-gray-700">Resultados epigenéticos</p>
      <div className="mt-1 flex items-baseline gap-2">
        <p className="text-3xl font-bold">
          <GradText>{epiScore}</GradText>
        </p>
        <span className="text-sm text-gray-500">/100</span>
      </div>
      <p className="mt-1 text-sm text-gray-600">
        Edad biológica: <GradText>{epiAgeDelta >= 0 ? `+${epiAgeDelta}` : epiAgeDelta}</GradText> años vs. tu edad cronológica
      </p>
      <div className="mt-2 flex flex-wrap gap-2">
        {epiTags.map((t) => <Badge key={t}>{t}</Badge>)}
      </div>
    </div>

    <button
      className="rounded-full px-4 py-2 text-white text-sm font-medium
                 bg-gradient-to-r from-blue-600 to-green-400 shadow
                 hover:opacity-90 active:scale-95 transition"
      onClick={() => alert("Abrir detalle de resultados epigenéticos")}
    >
      Ver resultados
    </button>
  </div>
</article>


        {/* Tarjeta: Progreso semanal (gráfica compacta tipo “overall statistics”) */}
        <article className="rounded-2xl p-5 shadow-sm border bg-white">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-base font-semibold text-gray-900">
              Progreso semanal
            </h3>
            <div className="flex items-center gap-3 text-xs">
              <span className="inline-flex items-center gap-1 text-gray-600">
                <span className="h-2 w-2 rounded-full bg-blue-500" /> Ejercicio
              </span>
              <span className="inline-flex items-center gap-1 text-gray-600">
                <span className="h-2 w-2 rounded-full bg-emerald-500" /> Pasos
              </span>
              <span className="inline-flex items-center gap-1 text-gray-600">
                <span className="h-2 w-2 rounded-full bg-purple-500" /> Ritmo
              </span>
            </div>
          </div>

          {/* Gráfica SVG minimal */}
          <div className="rounded-xl border bg-white p-3">
            <svg viewBox="0 0 320 120" className="w-full h-28">
              {/* ejes sutiles */}
              <line x1="8" y1="110" x2="312" y2="110" stroke="#e5e7eb" strokeWidth="1" />
              <line x1="8" y1="10"  x2="8"   y2="110" stroke="#e5e7eb" strokeWidth="1" />
              {/* barras/columnas por día */}
              {weekly.map((d, i) => {
                const x = 20 + i * 42;
                // mapeo sencillo a alturas (normaliza valores)
                const hEx = Math.min(100, d.ex * (100/60));      // máx 60 min -> 100
                const hSt = Math.min(100, d.steps * (100/8));    // 8k pasos -> 100
                const hHr = Math.min(100, (d.hr - 60) * (100/40)); // 60-100 bpm -> 0-100
                const barW = 8;

                return (
                  <g key={i}>
                    {/* ejercicio (azul) */}
                    <rect x={x} y={110 - (animate ? hEx : 0)} width={barW} height={(animate ? hEx : 0)} rx="4" fill="#3b82f6"
                          style={{ transition: "all 600ms ease-out", transitionDelay: `${i*80}ms` }} />
                    {/* pasos (verde) */}
                    <rect x={x + 12} y={110 - (animate ? hSt : 0)} width={barW} height={(animate ? hSt : 0)} rx="4" fill="#10b981"
                          style={{ transition: "all 700ms ease-out", transitionDelay: `${80 + i*80}ms` }} />
                    {/* ritmo cardiaco (línea/lollipop púrpura) */}
                    <line x1={x + 30} y1="110" x2={x + 30} y2={110 - (animate ? hHr : 0)} stroke="#8b5cf6" strokeWidth="2"
                          style={{ transition: "all 700ms ease-out", transitionDelay: `${160 + i*80}ms` }} />
                    <circle cx={x + 30} cy={110 - (animate ? hHr : 0)} r="4" fill="#8b5cf6"
                            style={{ transition: "all 700ms ease-out", transitionDelay: `${160 + i*80}ms` }} />
                    {/* label día */}
                    <text x={x + 16} y="118" textAnchor="middle" className="fill-gray-400 text-[10px]">{d.d}</text>
                  </g>
                );
              })}
            </svg>
          </div>
        </article>

        {/* Tarjeta: Insights personalizados */}
        <article className="rounded-2xl p-5 shadow-sm border bg-white">
          <h3 className="text-base font-semibold text-gray-900 mb-2">Insights</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>• Tu <GradText>actividad</GradText> mejora cuando caminas por la mañana (+15%).</li>
            <li>• El <GradText>ritmo cardiaco</GradText> promedio es estable esta semana.</li>
            <li>• Considera aumentar 10 min de <GradText>ejercicio</GradText> los días M y J.</li>
          </ul>
        </article>

        {/* Tarjeta: Sugerencias de mejora */}
        <article className="rounded-2xl p-5 shadow-sm border bg-white">
          <h3 className="text-base font-semibold text-gray-900 mb-2">Sugerencias</h3>
          <div className="grid gap-3">
            <div className="rounded-xl border p-3">
              <p className="text-sm text-gray-800"><GradText>Suplementos</GradText>: añade Magnesio por la noche (200–400 mg).</p>
              <p className="text-xs text-gray-500 mt-1">Mejor descanso y recuperación muscular.</p>
            </div>
            <div className="rounded-xl border p-3">
              <p className="text-sm text-gray-800"><GradText>Hábitos</GradText>: 10’ de respiración 4-4-4 después del almuerzo.</p>
              <p className="text-xs text-gray-500 mt-1">Reduce estrés y mejora la variabilidad cardíaca.</p>
            </div>
          </div>
          <button
            className="mt-4 w-full rounded-full px-6 py-3 text-white font-semibold
                       bg-gradient-to-r from-blue-600 to-green-400 shadow
                       hover:opacity-90 active:scale-95 transition"
            onClick={() => alert("Abrir plan detallado")}
          >
            Ver plan recomendado
          </button>
        </article>
      </section>
    </main>
  );
}
