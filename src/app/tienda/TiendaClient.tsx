"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { storeProducts } from "@/data/tienda";

const GradText = ({ children }: { children: React.ReactNode }) => (
  <span className="bg-gradient-to-r from-blue-600 to-green-400 bg-clip-text text-transparent">{children}</span>
);

function Stars({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  const Star = ({ fill = true }: { fill?: boolean }) => (
    <svg viewBox="0 0 20 20" className="h-4 w-4" aria-hidden>
      <path
        d="M10 15.27l-5.18 2.73 1-5.82L1 7.97l5.9-.86L10 1.5l3.1 5.61 5.9.86-4.82 4.21 1 5.82z"
        fill={fill ? "url(#g)" : "none"} stroke="#e5e7eb"
      />
      <defs>
        <linearGradient id="g" x1="0" x2="1">
          <stop offset="0" stopColor="#2563eb" /><stop offset="1" stopColor="#22c55e" />
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
            <path d="M10 15.27l-5.18 2.73 1-5.82L1 7.97l5.9-.86L10 1.5l3.1 5.61 5.9.86-4.82 4.21 1 5.82z"
              fill="url(#half)" stroke="#e5e7eb"/>
            <defs>
              <linearGradient id="half" x1="0" x2="1">
                <stop offset="50%" stopColor="#2563eb"/><stop offset="50%" stopColor="white"/>
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

export default function TiendaClient() {
  const [cartCount, setCartCount] = useState(0);

  const test = storeProducts.find(p => p.slug === "test-epigenetico")!;
  const suplementos = storeProducts.filter(p => p.category === "Suplemento");

  const add = (name: string) => {
    setCartCount(c => c + 1);
    // aquí luego podrás integrar un store real (Zustand/Server Actions)
    // por ahora, feedback mínimo:
    if (typeof window !== "undefined") {
      // eslint-disable-next-line no-alert
      console.log(`Añadido al carrito: ${name}`);
    }
  };

  return (
    <main className="min-h-svh w-full bg-white">
      {/* Header / título */}
      <header className="px-6 pt-8 pb-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">Tienda</h1>
          <div className="text-xs text-gray-600">Carrito: <GradText>{cartCount}</GradText></div>
        </div>
        <p className="text-sm text-gray-500 mt-1">Productos recomendados por <GradText>ISORA</GradText>.</p>
      </header>

      <section className="px-6 space-y-6 pb-24">
        {/* HERO: Test epigenético (tarjeta amarilla estilo banner) */}
        <article className="rounded-3xl p-5 shadow-sm border bg-gradient-to-br from-amber-300 to-amber-200 relative overflow-hidden">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <p className="text-sm text-amber-900/90">Nuevo</p>
              <h3 className="text-lg font-semibold text-amber-950">Test epigenético ISORA</h3>
              <p className="text-sm text-amber-900/90 mt-1">Descubre tu <b>edad biológica</b> y recibe recomendaciones personalizadas.</p>
              <div className="mt-3 flex items-center gap-2">
                <span className="rounded-full bg-white/70 px-2 py-0.5 text-xs text-amber-900">Resultados en 7–10 días</span>
                <span className="rounded-full bg-white/70 px-2 py-0.5 text-xs text-amber-900">Incluye reporte</span>
              </div>
              <div className="mt-4 flex items-center gap-3">
                <Link
                  href="/tienda/test-epigenetico"
                  className="rounded-full px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-green-400 shadow hover:opacity-90 active:scale-95 transition"
                >
                  Saber más
                </Link>
                <button
                  onClick={() => add(test.name)}
                  className="h-9 w-9 rounded-full bg-white/90 text-amber-900 shadow flex items-center justify-center text-lg"
                  aria-label="Agregar test al carrito"
                >＋</button>
              </div>
            </div>

            {/* Imagen/ilustración (placeholder) */}
            <div className="relative h-28 w-28 shrink-0">
              <Image src={test.image} alt={test.name} fill className="object-contain" />
            </div>
          </div>
        </article>

        {/* Filtros simples (chips) */}
        <div className="flex items-center gap-2 overflow-x-auto">
          {["Todos", "Suplementos", "Test"].map((c, i) => (
            <button key={c} className={`rounded-full px-3 py-1 text-sm border ${i===0 ? "bg-gray-900 text-white" : "bg-white text-gray-700 hover:bg-gray-50"}`}>
              {c}
            </button>
          ))}
        </div>

        {/* Grid de productos (tarjetas blancas) */}
        <div className="grid grid-cols-2 gap-4">
          {suplementos.map((p) => (
            <article key={p.slug} className="rounded-2xl p-3 shadow-sm border bg-white">
              {/* Imagen -> detalle */}
              <Link href={`/tienda/${p.slug}`} className="block relative rounded-xl bg-gray-50 h-28 overflow-hidden">
                <Image src={p.image} alt={p.name} fill className="object-contain" />
              </Link>

              {/* Meta */}
              <div className="mt-3">
                <p className="text-[11px] text-gray-500">Suplemento</p>
                <h3 className="text-sm font-medium text-gray-900 line-clamp-2">{p.name}</h3>
                <div className="mt-1 flex items-center justify-between">
                  <Stars rating={p.rating} />
                  <button
                    onClick={() => add(p.name)}
                    className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-600 to-green-400 text-white flex items-center justify-center text-lg shadow active:scale-95"
                    aria-label={`Agregar ${p.name} al carrito`}
                  >＋</button>
                </div>
                <p className="mt-1 text-sm font-semibold">
                  ${p.price.toFixed(2)} <span className="text-xs text-gray-500">MXN</span>
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
