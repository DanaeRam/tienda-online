"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { storeProducts } from "@/data/tienda";

const GradText = ({ children }: { children: React.ReactNode }) => (
  <span className="bg-gradient-to-r from-blue-600 to-green-400 bg-clip-text text-transparent">
    {children}
  </span>
);

/* ---------- Estrellas ---------- */
function Stars({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);

  const Star = ({ fill = true }: { fill?: boolean }) => (
    <svg viewBox="0 0 20 20" className="h-4 w-4" aria-hidden>
      <path
        d="M10 15.27l-5.18 2.73 1-5.82L1 7.97l5.9-.86L10 1.5l3.1 5.61 5.9.86-4.82 4.21 1 5.82z"
        fill={fill ? "url(#g)" : "none"}
        stroke="#e5e7eb"
      />
      <defs>
        <linearGradient id="g" x1="0" x2="1">
          <stop offset="0" stopColor="#2563eb" />
          <stop offset="1" stopColor="#22c55e" />
        </linearGradient>
      </defs>
    </svg>
  );

  return (
    <div className="flex items-center gap-0.5 text-xs text-gray-500">
      {Array.from({ length: full }).map((_, i) => <Star key={`f${i}`} />)}
      {half && (
        <div className="relative h-4 w-4">
          <svg viewBox="0 0 20 20" className="absolute inset-0">
            <path
              d="M10 15.27l-5.18 2.73 1-5.82L1 7.97l5.9-.86L10 1.5l3.1 5.61 5.9.86-4.82 4.21 1 5.82z"
              fill="url(#half)"
              stroke="#e5e7eb"
            />
            <defs>
              <linearGradient id="half" x1="0" x2="1">
                <stop offset="50%" stopColor="#2563eb" />
                <stop offset="50%" stopColor="white" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      )}
      {Array.from({ length: empty }).map((_, i) => <Star key={`e${i}`} fill={false} />)}
      <span className="ml-1">{rating.toFixed(1)}</span>
    </div>
  );
}

/* ---------- Gamificación ---------- */
type Challenge = {
  id: string;
  title: string;
  points: number;
  done: boolean;
};
const DEFAULT_CHALLENGES: Challenge[] = [
  { id: "ch1", title: "Completar perfil de salud", points: 50, done: false },
  { id: "ch2", title: "Registrar 3 días de hábitos", points: 80, done: false },
  { id: "ch3", title: "Primera compra de suplemento", points: 50, done: false },
];
const REWARD_STEP = 500;

export default function TiendaClient() {
  const [cartCount, setCartCount] = useState(0);

  // productos actuales (se mantiene tu contenido)
  const test = storeProducts.find((p) => p.slug === "test-epigenetico")!;
  const suplementos = storeProducts.filter((p) => p.category === "Suplemento");

  const add = (name: string) => {
    setCartCount((c) => c + 1);
    if (typeof window !== "undefined") console.log(`Añadido al carrito: ${name}`);
  };

  // ---- estado de gamificación (nuevo, minimalista) ----
  const [points, setPoints] = useState<number>(0);
  const [challenges, setChallenges] = useState<Challenge[]>(DEFAULT_CHALLENGES);

  // cargar/persistir
  useEffect(() => {
    try {
      const p = localStorage.getItem("store_points");
      if (p) setPoints(Math.max(0, Number(p)));
      const c = localStorage.getItem("store_challenges");
      if (c) {
        const parsed = JSON.parse(c) as Challenge[];
        if (Array.isArray(parsed)) setChallenges(parsed);
      }
    } catch {}
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem("store_points", String(points));
      localStorage.setItem("store_challenges", JSON.stringify(challenges));
    } catch {}
  }, [points, challenges]);

  // helpers
  const earnPoints = (amount: number) => setPoints((p) => p + Math.max(0, amount));
  const toggleChallenge = (id: string) => {
    setChallenges((prev) =>
      prev.map((ch) => {
        if (ch.id !== id) return ch;
        if (!ch.done) earnPoints(ch.points);
        return { ...ch, done: !ch.done };
      })
    );
  };
  const progressToNext = useMemo(() => {
    const remainder = points % REWARD_STEP;
    const pct = Math.min(100, Math.round((remainder / REWARD_STEP) * 100));
    const missing = REWARD_STEP - remainder;
    return { pct, missing };
  }, [points]);
  const canRedeem = points >= REWARD_STEP;
  const redeem = () => {
    if (!canRedeem) return;
    setPoints((p) => Math.max(0, p - REWARD_STEP));
    if (typeof window !== "undefined") alert("¡Canje realizado! 🎉 (demo)");
  };

  // acciones demo
  const simulatePurchaseTest = () => earnPoints(300);
  const simulatePurchaseSupplement = () => earnPoints(50);
  const simulateReview = () => earnPoints(30);

  return (
    <main className="min-h-svh w-full bg-white">
      {/* Header / título (SE MANTIENE) */}
      <header className="px-6 pt-8 pb-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">Tienda</h1>
          <div className="text-xs text-gray-600">
            Carrito: <GradText>{cartCount}</GradText>
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          Productos recomendados por <GradText>ISORA</GradText>.
        </p>
      </header>

      <section className="px-6 space-y-6 pb-28">
        {/* HERO: Test epigenético (SIN IMAGEN, SE MANTIENE) */}
        <article className="rounded-3xl p-5 shadow-sm border bg-gradient-to-br from-amber-300 to-amber-200">
          <p className="text-sm text-amber-900/90">Nuevo</p>
          <h3 className="text-lg font-semibold text-amber-950">Test epigenético ISORA</h3>
          <p className="text-sm text-amber-900/90 mt-1">
            Descubre tu <b>edad biológica</b> y recibe recomendaciones personalizadas.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="rounded-full bg-white/70 px-2 py-0.5 text-xs text-amber-900">
              Resultados en 7–10 días
            </span>
            <span className="rounded-full bg-white/70 px-2 py-0.5 text-xs text-amber-900">
              Incluye reporte
            </span>
          </div>
          <div className="mt-4 flex items-center gap-3">
            <Link
              href="/tienda/test-epigenetico"
              className="rounded-full px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-green-400 shadow hover:opacity-90 active:scale-95 transition"
            >
              Saber más
            </Link>
            
          </div>
        </article>

        {/* -------- NUEVO: Recompensas / Gamificación -------- */}
        <article className="rounded-2xl border bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-base font-semibold text-gray-900">
                Recompensas <GradText>ISORA</GradText>
              </h3>
              <p className="text-xs text-gray-500">Gana puntos por compras y hábitos.</p>
            </div>
            <div className="text-right">
              <p className="text-[11px] text-gray-500">Tus puntos</p>
              <p className="text-2xl font-semibold">
                <GradText>{points}</GradText>
              </p>
            </div>
          </div>

          {/* Progreso hacia el canje */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Progreso a canje</span>
              <span>{progressToNext.pct}%</span>
            </div>
            <div className="mt-2 h-2 rounded-full bg-gray-200 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-600 to-green-400 transition-[width] duration-700"
                style={{ width: `${progressToNext.pct}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-gray-600">
              Te faltan <b>{progressToNext.missing}</b> pts para tu próxima recompensa.
            </p>
          </div>

          {/* CTA canje + acciones demo */}
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              onClick={redeem}
              disabled={!canRedeem}
              className="rounded-full px-5 py-2.5 text-white font-medium shadow bg-gradient-to-r from-blue-600 to-green-400 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              title={canRedeem ? "Canjear 500 pts" : "Necesitas 500 pts"}
            >
              Canjear 500 pts
            </button>
            <button
              onClick={simulateReview}
              className="rounded-full px-5 py-2.5 text-sm font-medium border"
              title="Demo: +30 pts por reseña"
            >
              Escribir reseña (+30)
            </button>
            <button
              onClick={simulatePurchaseSupplement}
              className="rounded-full px-5 py-2.5 text-sm font-medium border"
              title="Demo: +50 pts por compra de suplemento"
            >
              Registrar compra suplemento (+50)
            </button>
          </div>
        </article>

        {/* Retos activos */}
        <article className="rounded-2xl border bg-white p-5 shadow-sm">
          <h4 className="text-sm font-semibold text-gray-900">Retos activos</h4>
          <ul className="mt-3 divide-y">
            {challenges.map((ch) => (
              <li key={ch.id} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-green-400 text-white">
                    🎯
                  </span>
                  <div>
                    <p className="text-sm text-gray-800">{ch.title}</p>
                    <p className="text-xs text-gray-500">+{ch.points} pts</p>
                  </div>
                </div>
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={ch.done}
                    onChange={() => toggleChallenge(ch.id)}
                    className="h-4 w-4 accent-green-500"
                    aria-label={`Completar reto: ${ch.title}`}
                  />
                  <span className="text-xs text-gray-600">{ch.done ? "Completado" : "Marcar"}</span>
                </label>
              </li>
            ))}
          </ul>
        </article>

        

        {/* Filtros simples (SE MANTIENEN) */}
        <div className="flex items-center gap-2 overflow-x-auto">
          {["Todos", "Suplementos", "Test"].map((c, i) => (
            <button
              key={c}
              className={`rounded-full px-3 py-1 text-sm border ${
                i === 0 ? "bg-gray-900 text-white" : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Grid suplementos (SE MANTIENE con botón + centrado) */}
        <div className="grid grid-cols-2 gap-4">
          {suplementos.map((p) => (
            <article key={p.slug} className="rounded-2xl p-3 shadow-sm border bg-white flex flex-col">
              <Link href={`/tienda/${p.slug}`} className="block relative rounded-xl bg-gray-50 h-28 overflow-hidden">
                <Image src={p.image} alt={p.name} fill className="object-contain" />
              </Link>

              <div className="mt-3 flex-1">
                <p className="text-[11px] text-gray-500">Suplemento</p>
                <h3 className="text-sm font-medium text-gray-900 line-clamp-2">{p.name}</h3>
                <div className="mt-1 flex items-center">
                  <Stars rating={p.rating} />
                </div>
                <p className="mt-1 text-sm font-semibold">
                  ${p.price.toFixed(2)} <span className="text-xs text-gray-500">MXN</span>
                </p>
              </div>

              <div className="mt-3 flex justify-center">
                <button
                  onClick={() => {
                    add(p.name);
                    simulatePurchaseSupplement(); // demo: +50 pts
                  }}
                  className="h-9 w-9 rounded-full bg-gradient-to-r from-blue-600 to-green-400 text-white flex items-center justify-center text-lg shadow active:scale-95"
                  aria-label={`Agregar ${p.name} al carrito`}
                >
                  ＋
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
