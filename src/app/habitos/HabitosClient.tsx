"use client";

import { useEffect, useMemo, useState } from "react";

/* ========== Tipos ========== */
type Habit = {
  id: string;
  name: string;
  icon: string;         // emoji o unicode
  freq: "Diario" | "Semanal";
  progress: number;     // 0-100 (estimado)
  streak: number;       // racha en días
  color?: string;       // tailwind color hint
};

type WeeklyPoint = { d: string; exercise: number; supplements: number };

type Friend = {
  id: string;
  name: string;
  initials: string;
  color: string; // bg color (tailwind)
  streak: number;
};

type CollabChallenge = {
  id: string;
  title: string;
  goalDays: number;            // meta de días (acumulado de equipo)
  doneDays: number;            // progreso acumulado
  members: string[];           // friend ids
  todayMarkedBy: string[];     // quién ya marcó hoy
};

/* ========== Helpers ========== */
const GradText = ({ children }: { children: React.ReactNode }) => (
  <span className="bg-gradient-to-r from-blue-600 to-green-400 bg-clip-text text-transparent">
    {children}
  </span>
);

const G = "bg-gradient-to-r from-blue-600 to-green-400";

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="h-2 w-full rounded-full bg-gray-200 overflow-hidden">
      <div
        className={`h-2 ${G}`}
        style={{
          width: `${Math.max(0, Math.min(100, value))}%`,
          transition: "width 700ms ease-out",
        }}
      />
    </div>
  );
}

function tinyId() {
  return Math.random().toString(36).slice(2, 9);
}

/* ========== Componente ========== */
export default function HabitosClient() {
  /* ---------- Estado base (persistente) ---------- */
  const [habits, setHabits] = useState<Habit[]>([]);
  const [suppReminders, setSuppReminders] = useState<boolean>(true);
  const [suppTakenToday, setSuppTakenToday] = useState<number>(1); // tomas realizadas hoy (0..3)

  useEffect(() => {
    try {
      const h = localStorage.getItem("habits");
      const r = localStorage.getItem("suppReminders");
      const t = localStorage.getItem("suppTakenToday");
      if (h) setHabits(JSON.parse(h));
      else {
        // Semilla inicial
        setHabits([
          { id: tinyId(), name: "Meditación matutina", icon: "🧘", freq: "Diario", progress: 80, streak: 7, color: "violet" },
          { id: tinyId(), name: "Lectura 30 min",      icon: "📚", freq: "Diario", progress: 28, streak: 2, color: "purple" },
          { id: tinyId(), name: "Ejercicio ligero",     icon: "🏃‍♀️", freq: "Semanal", progress: 60, streak: 3, color: "emerald" },
        ]);
      }
      if (r) setSuppReminders(r === "true");
      if (t) setSuppTakenToday(Number(t));
    } catch {}
  }, []);

  useEffect(() => {
    try { localStorage.setItem("habits", JSON.stringify(habits)); } catch {}
  }, [habits]);

  useEffect(() => {
    try { localStorage.setItem("suppReminders", String(suppReminders)); } catch {}
  }, [suppReminders]);

  useEffect(() => {
    try { localStorage.setItem("suppTakenToday", String(suppTakenToday)); } catch {}
  }, [suppTakenToday]);

  /* ---------- Crear nuevo hábito ---------- */
  const [newName, setNewName] = useState("");
  const [newIcon, setNewIcon] = useState("🌱");
  const [newFreq, setNewFreq] = useState<"Diario" | "Semanal">("Diario");

  const addHabit = (e: React.FormEvent) => {
    e.preventDefault();
    const name = newName.trim();
    if (!name) return;
    setHabits((prev) => [
      { id: tinyId(), name, icon: newIcon, freq: newFreq, progress: 0, streak: 0 },
      ...prev,
    ]);
    setNewName("");
  };

  /* ---------- Marcar progreso (check) ---------- */
  const tickHabit = (id: string) => {
    setHabits((prev) =>
      prev.map((h) =>
        h.id === id
          ? {
              ...h,
              progress: Math.min(100, h.progress + (h.freq === "Diario" ? 20 : 10)),
              streak: h.streak + 1,
            }
          : h
      )
    );
  };

  /* ---------- Suplementos ---------- */
  const incSupp = () => setSuppTakenToday((v) => Math.min(3, v + 1));
  const decSupp = () => setSuppTakenToday((v) => Math.max(0, v - 1));

  /* ---------- Gráfica semanal (mock + suplementos de hoy) ---------- */
  const weekly: WeeklyPoint[] = useMemo(() => {
    const base: WeeklyPoint[] = [
      { d: "L", exercise: 3, supplements: 2 },
      { d: "M", exercise: 2, supplements: 1 },
      { d: "M", exercise: 4, supplements: 3 },
      { d: "J", exercise: 5, supplements: 2 },
      { d: "V", exercise: 3, supplements: 2 },
      { d: "S", exercise: 4, supplements: 3 },
      { d: "D", exercise: 2, supplements: 1 },
    ];
    base[6].supplements = suppTakenToday; // último día refleja tomas de hoy (0..3)
    return base;
  }, [suppTakenToday]);

  /* ---------- Animación de gráfica ---------- */
  const [animate, setAnimate] = useState(false);
  useEffect(() => {
    let r1 = 0, r2 = 0;
    r1 = requestAnimationFrame(() => { r2 = requestAnimationFrame(() => setAnimate(true)); });
    return () => { cancelAnimationFrame(r1); cancelAnimationFrame(r2); };
  }, []);

  /* ---------- Nombre del usuario ---------- */
  const [name, setName] = useState("Usuario");
  useEffect(() => {
    try {
      const n = localStorage.getItem("userName");
      if (n) setName(n);
    } catch {}
  }, []);

  /* =========================================================
     NUEVO: Colaboración (amigos, compañeros y familiares)
     ========================================================= */
  const [friends, setFriends] = useState<Friend[]>([]);
  const [collab, setCollab] = useState<CollabChallenge[]>([]);

  useEffect(() => {
    try {
      const f = localStorage.getItem("habit_friends");
      const c = localStorage.getItem("habit_collab");
      if (f) setFriends(JSON.parse(f));
      else {
        const seed: Friend[] = [
          { id: "f1", name: "Ana",   initials: "AN", color: "bg-blue-100",   streak: 5 },
          { id: "f2", name: "Luis",  initials: "LU", color: "bg-emerald-100",streak: 8 },
          { id: "f3", name: "Mamá",  initials: "MA", color: "bg-violet-100", streak: 3 },
        ];
        setFriends(seed);
      }
      if (c) setCollab(JSON.parse(c));
      else {
        const seedC: CollabChallenge[] = [
          { id: "cc1", title: "7 días de hidratación 💧", goalDays: 28, doneDays: 13, members: ["f1","f2","f3"], todayMarkedBy: [] },
          { id: "cc2", title: "Respiración 4-7-8 por la noche 🌙", goalDays: 21, doneDays: 9, members: ["f2","f3"], todayMarkedBy: [] },
        ];
        setCollab(seedC);
      }
    } catch {}
  }, []);

  useEffect(() => { try { localStorage.setItem("habit_friends", JSON.stringify(friends)); } catch {} }, [friends]);
  useEffect(() => { try { localStorage.setItem("habit_collab", JSON.stringify(collab)); } catch {} }, [collab]);

  const markToday = (challengeId: string, who: string) => {
    setCollab(prev =>
      prev.map(c => {
        if (c.id !== challengeId) return c;
        if (c.todayMarkedBy.includes(who)) return c; // evitar doble
        return {
          ...c,
          doneDays: Math.min(c.goalDays, c.doneDays + 1),
          todayMarkedBy: [...c.todayMarkedBy, who],
        };
      })
    );
    // Sube racha del amigo que marcó
    setFriends(prev => prev.map(f => f.id === who ? { ...f, streak: f.streak + 1 } : f));
  };

  const progressPct = (c: CollabChallenge) =>
    Math.round((c.doneDays / c.goalDays) * 100);

  const shareInvite = async () => {
    const text = "¡Únete a mis retos de hábitos en ISORA! 💪✨";
    const url = typeof window !== "undefined" ? window.location.origin + "/habitos" : "";
    try {
      if (navigator.share) {
        await navigator.share({ title: "ISORA Hábitos", text, url });
      } else {
        await navigator.clipboard.writeText(`${text} ${url}`);
        alert("Enlace copiado al portapapeles ✅");
      }
    } catch {}
  };

  return (
    <main className="min-h-svh w-full bg-white pb-2">
      {/* Encabezado */}
      <header className="px-6 pt-8 pb-4">
        <h1 className="text-2xl font-semibold text-gray-900">
          Hábitos de <GradText>{name}</GradText>
        </h1>
        <p className="text-sm text-gray-500 mt-1">Organiza, mide y mejora tus rutinas.</p>
      </header>

      <section className="px-6 space-y-6 pb-28">
        {/* ----- Insights / AI ---- */}
        <article className="rounded-2xl p-5 shadow-sm border bg-gradient-to-br from-blue-50 to-green-50">
          <div className="flex items-start gap-3">
            <div className="h-8 w-8 rounded-lg flex items-center justify-center bg-white shadow-sm">🧠</div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Insight</p>
              <p className="text-sm text-gray-700 mt-1">
                ¡Vas excelente! Llevas <GradText>7 días</GradText> seguidos con meditación.
              </p>
            </div>
            <button className="rounded-full px-3 py-1 text-xs text-white bg-gradient-to-r from-blue-600 to-green-400">
              Ver más
            </button>
          </div>
        </article>

        {/* ----- NUEVO: Retos y rachas colaborativas ----- */}
        <article className="rounded-2xl p-5 shadow-sm border bg-white">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Retos y rachas colaborativas</h2>
            <button
              onClick={shareInvite}
              className="rounded-full px-3 py-1 text-xs text-white bg-gradient-to-r from-blue-600 to-green-400 active:scale-95"
              title="Invitar amigos/familia"
            >
              Invitar
            </button>
          </div>

          {/* Ranking simple */}
          <div className="mt-4 rounded-xl border p-4">
            <p className="text-sm font-medium text-gray-900 mb-3">Ranking semanal</p>
            <ul className="space-y-3">
              {friends
                .slice()
                .sort((a, b) => b.streak - a.streak)
                .map((f, idx) => (
                  <li key={f.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className={`h-9 w-9 rounded-full ${f.color} flex items-center justify-center text-[11px] font-semibold text-gray-700`}>
                        {f.initials}
                      </span>
                      <div>
                        <p className="text-sm text-gray-800">{f.name}</p>
                        <p className="text-[11px] text-gray-500">#{idx + 1} del ranking</p>
                      </div>
                    </div>
                    <div className="text-sm text-gray-700">🔥 {f.streak} días</div>
                  </li>
                ))}
            </ul>
          </div>

          {/* Retos en equipo */}
          <div className="mt-4 grid gap-3">
            {collab.map((c) => {
              const pct = progressPct(c);
              return (
                <div key={c.id} className="rounded-xl border p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900">{c.title}</p>
                      <p className="text-xs text-gray-500">
                        Meta: {c.goalDays} días — Progreso: <GradText>{c.doneDays}</GradText>
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        // Simular que el usuario actual (id 'me') marca hoy.
                        // Si tienes un id real, sustitúyelo aquí:
                        const me = "me";
                        // Asegurar esa "persona" en la lista visual (opcional):
                        if (!friends.find(f => f.id === me)) {
                          setFriends(prev => [
                            ...prev,
                            { id: "me", name: name || "Tú", initials: "TÚ", color: "bg-rose-100", streak: 0 }
                          ]);
                        }
                        markToday(c.id, me);
                      }}
                      className="rounded-full px-3 py-1 text-xs text-white bg-gradient-to-r from-blue-600 to-green-400 active:scale-95 disabled:opacity-50"
                      disabled={c.todayMarkedBy.includes("me")}
                      title="Marcar cumplimiento de hoy"
                    >
                      {c.todayMarkedBy.includes("me") ? "¡Marcado!" : "Marcar hoy"}
                    </button>
                  </div>

                  {/* Avatares de miembros */}
                  <div className="mt-3 flex items-center gap-2">
                    {c.members.map((id) => {
                      const f = friends.find(fr => fr.id === id);
                      if (!f) return null;
                      return (
                        <span key={id} className={`h-7 w-7 rounded-full ${f.color} flex items-center justify-center text-[10px] font-semibold text-gray-700`}>
                          {f.initials}
                        </span>
                      );
                    })}
                    {/* añade "tú" si ya marcaste hoy */}
                    {c.todayMarkedBy.includes("me") && (
                      <span className="h-7 w-7 rounded-full bg-rose-100 flex items-center justify-center text-[10px] font-semibold text-gray-700">
                        TÚ
                      </span>
                    )}
                  </div>

                  {/* Progreso con animación */}
                  <div className="mt-3">
                    <ProgressBar value={pct} />
                    <div className="mt-1 text-right text-[11px] text-gray-500">{pct}%</div>
                  </div>
                </div>
              );
            })}
          </div>
        </article>

        {/* ----- Lista de hábitos ----- */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Hábitos de hoy</h2>
          <a href="#crear" className="rounded-full px-3 py-1 text-xs text-white bg-gradient-to-r from-blue-600 to-green-400">
            + Añadir
          </a>
        </div>

        <div className="grid gap-3">
          {habits.map((h) => (
            <article key={h.id} className="rounded-2xl p-4 shadow-sm border bg-white">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-xl bg-gray-100 flex items-center justify-center text-lg">
                  {h.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{h.name}</p>
                      <p className="text-xs text-gray-500">{h.freq}</p>
                    </div>
                    <button
                      onClick={() => tickHabit(h.id)}
                      className="rounded-full px-3 py-1 text-xs text-white bg-gradient-to-r from-blue-600 to-green-400 active:scale-95"
                    >
                      ✔ Hecho
                    </button>
                  </div>
                  <div className="mt-3">
                    <ProgressBar value={h.progress} />
                  </div>
                  <div className="mt-2 flex items-center gap-3 text-xs text-gray-500">
                    <span>🔥 {h.streak} días</span>
                    <span>Progreso: {h.progress}%</span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* ----- Recordatorios de suplementos ----- */}
        <article className="rounded-2xl p-5 shadow-sm border bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gray-100 flex items-center justify-center text-lg">💊</div>
              <div>
                <p className="text-sm font-medium text-gray-900">Recordatorios de suplementos</p>
                <p className="text-xs text-gray-500">Mantén el control de tus tomas diarias.</p>
              </div>
            </div>

            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="peer sr-only"
                checked={suppReminders}
                onChange={(e) => setSuppReminders(e.target.checked)}
              />
              <span className="peer-checked:from-blue-600 peer-checked:to-green-400 relative h-6 w-11 rounded-full bg-gray-300 transition-colors bg-gradient-to-r from-gray-300 to-gray-300 peer-checked:shadow-inner"></span>
            </label>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <button onClick={decSupp} className="h-8 w-8 rounded-full border text-gray-600">−</button>
            <span className="text-sm text-gray-800">Tomas hoy: <GradText>{suppTakenToday}</GradText> / 3</span>
            <button onClick={incSupp} className="h-8 w-8 rounded-full border text-gray-600">+</button>
          </div>
          <p className="mt-1 text-xs text-gray-500">Esto también se refleja en la gráfica semanal.</p>
        </article>

        {/* ----- Gráfica semanal (hábitos + suplementos) ----- */}
        <article className="rounded-2xl p-5 shadow-sm border bg-white">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-base font-semibold text-gray-900">Progreso semanal</h3>
            <div className="text-xs text-gray-600 flex items-center gap-3">
              <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-blue-500" /> Ejercicio</span>
              <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Suplementos</span>
            </div>
          </div>

          <div className="rounded-xl border p-3">
            <svg viewBox="0 0 320 130" className="w-full h-32">
              <line x1="8" y1="114" x2="312" y2="114" stroke="#e5e7eb" strokeWidth="1" />
              <line x1="8" y1="10"  x2="8"   y2="114" stroke="#e5e7eb" strokeWidth="1" />

              {weekly.map((pt, i) => {
                const x = 20 + i * 42;
                // Normalización
                const exH = Math.min(100, pt.exercise * (100/6));    // 0-6 “unidades”
                const suH = Math.min(100, pt.supplements * (100/3)); // 0-3 tomas
                const barW = 10;

                return (
                  <g key={i}>
                    <rect
                      x={x} width={barW} rx="4"
                      y={114 - (animate ? exH : 0)} height={(animate ? exH : 0)}
                      fill="#3b82f6"
                      style={{ transition: "all 600ms ease-out", transitionDelay: `${i*80}ms` }}
                    />
                    <rect
                      x={x + 14} width={barW} rx="4"
                      y={114 - (animate ? suH : 0)} height={(animate ? suH : 0)}
                      fill="#10b981"
                      style={{ transition: "all 700ms ease-out", transitionDelay: `${120 + i*80}ms` }}
                    />
                    <text x={x + 11} y="126" textAnchor="middle" className="fill-gray-400 text-[10px]">
                      {"DLMMJVS"[i]}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </article>

        {/* ----- Crear nuevo hábito ----- */}
        <article id="crear" className="rounded-2xl p-5 shadow-sm border bg-white">
          <h3 className="text-base font-semibold text-gray-900 mb-3">Crear nuevo hábito</h3>
          <form onSubmit={addHabit} className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Nombre</label>
              <input
                className="w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="p. ej., Hidratación"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Ícono</label>
              <input
                className="w-full rounded-xl border px-3 py-2"
                value={newIcon}
                onChange={(e) => setNewIcon(e.target.value || "🌱")}
                placeholder="🌱"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Frecuencia</label>
              <select
                className="w-full rounded-xl border px-3 py-2"
                value={newFreq}
                onChange={(e) => setNewFreq(e.target.value as "Diario" | "Semanal")}
              >
                <option>Diario</option>
                <option>Semanal</option>
              </select>
            </div>
            <div className="sm:col-span-3">
              <button
                type="submit"
                className="w-full rounded-full px-6 py-3 text-white font-semibold shadow
                           bg-gradient-to-r from-blue-600 to-green-400 hover:opacity-90 active:scale-95 transition"
              >
                Añadir hábito
              </button>
            </div>
          </form>
        </article>
      </section>
    </main>
  );
}