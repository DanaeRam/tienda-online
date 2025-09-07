"use client";

import { useEffect, useMemo, useState } from "react";

type Summary = {
  supplements: string[];
  habits: string[];
  status: string; // breve estado general
};

export default function InicioClient() {
  const [name, setName] = useState<string>("");

  // Carga el nombre guardado
  useEffect(() => {
    try {
      const stored = localStorage.getItem("userName");
      setName(stored || "Usuario");
    } catch {
      setName("Usuario");
    }
  }, []);

  // Datos mock del día (puedes reemplazar con datos reales después)
  const summary: Summary = useMemo(
    () => ({
      supplements: ["Omega-3", "Vitamina D", "Magnesio"],
      habits: ["Hidratación", "10 min de respiración", "Caminar 20 min"],
      status: "Tu energía está en buen nivel",
    }),
    []
  );

  // Progreso semanal (0–100). 7 barras = semana
  const weeklyProgress = useMemo(() => [60, 75, 50, 80, 70, 65, 90], []);

  // Tip motivacional (simple rotación por día)
  const tips = [
    "Pequeños hábitos, grandes cambios.",
    "Respira profundo: 4-4-4 durante 1 minuto.",
    "Hidrátate: un vaso de agua ahora.",
    "Muévete 5 minutos: tu cuerpo lo agradece.",
    "Duerme mejor: apaga pantallas 30 min antes.",
    "Agradece 3 cosas de tu día.",
    "Tu constancia vale más que la perfección.",
  ];
  const tip = tips[new Date().getDay() % tips.length];

  // Animación de entrada (crecimiento de barras)
  const [animateBars, setAnimateBars] = useState(false);

    useEffect(() => {
    // Si quieres respetar reduced motion, descomenta este bloque:
    // const prefersReduced = typeof window !== "undefined" &&
    //   window.matchMedia &&
    //   window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // if (prefersReduced) {
    //   setAnimateBars(true); // pinta directo sin animación
    //   return;
    // }

    // Forzamos un frame intermedio para que sí anime:
    let raf1 = 0, raf2 = 0;
    raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        setAnimateBars(true);
      });
    });
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, []);


  return (
    <main className="min-h-svh w-full bg-white">
      {/* Header simple */}
      <header className="px-6 pt-8 pb-4">
        <h1 className="text-2xl font-semibold text-gray-900">
          Hola, {name}. <span className="font-normal">Hoy es un buen día para cuidar tu bienestar.</span>
        </h1>
      </header>

      {/* Contenido */}
      <section className="px-6 space-y-6 pb-10">
        {/* Estado general */}
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500 mb-1">Estado general</p>
          <p className="text-gray-800">{summary.status}</p>
        </div>

        {/* Resumen del día */}
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500 mb-3">Resumen del día</p>
          <div className="grid gap-4">
            <div>
              <p className="text-xs text-gray-500 mb-1">Suplementos recomendados</p>
              <ul className="flex flex-wrap gap-2">
                {summary.supplements.map((s) => (
                  <li
                    key={s}
                    className="rounded-full border px-3 py-1 text-sm text-gray-800"
                  >
                    {s}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Hábitos activos</p>
              <ul className="flex flex-wrap gap-2">
                {summary.habits.map((h) => (
                  <li
                    key={h}
                    className="rounded-full border px-3 py-1 text-sm text-gray-800"
                  >
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

                {/* Gráfica rápida (mini-barras semanales animadas) */}
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500 mb-3">Progreso semanal</p>

          <div className="flex items-end justify-between gap-2 h-28">
            {weeklyProgress.map((v, i) => {
              const clamped = Math.max(6, Math.min(100, v));
              const height = animateBars ? `${clamped}%` : "0%";
              const delayMs = i * 120; // escalonado por barra

              return (
                <div key={i} className="flex flex-col items-center gap-2">
                  <div
                    className="w-7 rounded-lg bg-gradient-to-b from-blue-600 to-green-400"
                    style={{
                      height,
                      transition: "height 800ms ease-out",
                      transitionDelay: `${delayMs}ms`,
                      willChange: "height",
                    }}
                    title={`${v}%`}
                    aria-label={`Día ${i + 1}: ${v}%`}
                  />
                  <span className="text-[10px] text-gray-500">
                    {"DLMMJVS"[i]}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mt-2 text-right">
            <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs text-green-700">
              +{Math.max(0, weeklyProgress[6] - weeklyProgress[0])}% vs. inicio de semana
            </span>
          </div>
        </div>


        {/* Tip motivacional + CTA */}
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
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
        </div>
      </section>
    </main>
  );
}
