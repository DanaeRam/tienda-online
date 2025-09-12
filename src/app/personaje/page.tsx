"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Buddy = {
  id: string;
  name: string;
  tagline: string;
  img: string; // ruta en /public
};

const G = "from-blue-600 to-green-400";

const BUDDIES: Buddy[] = [
  { id: "ayo",  name: "Ayo",  tagline: "Energía y constancia",     img: "/slides/ayo.png" },
  { id: "lumi", name: "Lumi", tagline: "Calma y respiración",       img: "/slides/lumi.png" },
  { id: "kira", name: "Kira", tagline: "Movimiento y enfoque",      img: "/slides/kira.png" },
  { id: "nilo", name: "Nilo", tagline: "Sueño y recuperación",      img: "/slides/nilo.png" },
  { id: "sora", name: "Sora", tagline: "Hidratación y equilibrio",  img: "/slides/sora.png" },
];

export default function Page() {
  const router = useRouter();
  const [selected, setSelected] = useState<string>("");

  // Si ya eligió antes, precargar selección
  useEffect(() => {
    try {
      const prev = localStorage.getItem("companionId");
      if (prev) setSelected(prev);
    } catch {}
  }, []);

  const onContinue = () => {
    if (!selected) return;
    try {
      const buddy = BUDDIES.find(b => b.id === selected);
      localStorage.setItem("companionId", selected);
      if (buddy) localStorage.setItem("companionName", buddy.name);
    } catch {}
    router.push("/inicio");
  };

  return (
    <main className="min-h-svh w-full bg-white">
      {/* Header simple */}
      <header className="px-6 pt-8 pb-2">
        <p className="text-sm text-gray-500">Paso 2 de 2</p>
        <h1 className="mt-1 text-2xl font-semibold text-gray-900">
          Elige tu <span className="bg-gradient-to-r from-blue-600 to-green-400 bg-clip-text text-transparent">compañero</span>
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Te acompañará con recordatorios, tips y retos.
        </p>
      </header>

      {/* Grid de personajes */}
      <section className="px-6 mt-4 grid grid-cols-2 gap-4 pb-28">
        {BUDDIES.map((b) => {
          const active = selected === b.id;
          return (
            <button
              key={b.id}
              onClick={() => setSelected(b.id)}
              className={[
                "group relative overflow-hidden rounded-2xl border bg-white p-3 shadow-sm text-left",
                "focus:outline-none focus:ring-2 focus:ring-blue-400",
                active ? "border-transparent" : "border-gray-200",
              ].join(" ")}
              aria-pressed={active}
            >
              {/* anillo degradado al seleccionar */}
              {active && (
                <span className={`pointer-events-none absolute inset-0 rounded-2xl p-[2px] bg-gradient-to-r ${G}`}>
                  <span className="block h-full w-full rounded-[14px] bg-white" />
                </span>
              )}

              <div className="relative z-10">
                <div className="relative mx-auto h-24 w-24">
                  {/* Reemplaza estas imágenes por las tuyas en /public/characters/*.png */}
                  <Image src={b.img} alt={b.name} fill className="object-contain" />
                </div>
                <h3 className="mt-2 text-sm font-semibold text-gray-900">{b.name}</h3>
                <p className="text-xs text-gray-500">{b.tagline}</p>
              </div>

              {/* check animado */}
              <span
                className={[
                  "absolute right-2 top-2 h-6 w-6 rounded-full text-white flex items-center justify-center shadow",
                  active ? `bg-gradient-to-r ${G} scale-100` : "bg-gray-200 scale-0",
                  "transition-transform duration-200",
                ].join(" ")}
                aria-hidden
              >
                ✓
              </span>

              {/* halo suave al hover */}
              <span className="pointer-events-none absolute -inset-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-blue-200/30 to-green-200/30 blur-2xl" />
            </button>
          );
        })}
      </section>

      {/* CTA fijo inferior */}
<div className="fixed bottom-0 inset-x-0 z-40 border-t bg-white/90 backdrop-blur px-6 py-4">
  <div className="flex flex-col items-center">
    <div className="text-sm text-gray-600 mb-2">
      {selected ? (
        <>
          Elegiste:{" "}
          <span className="bg-gradient-to-r from-blue-600 to-green-400 bg-clip-text text-transparent font-semibold">
            {BUDDIES.find(b => b.id === selected)?.name}
          </span>
        </>
      ) : (
        "Selecciona un personaje"
      )}
    </div>
    <button
      onClick={onContinue}
      disabled={!selected}
      className={[
        "rounded-full px-8 py-3 text-white font-semibold shadow active:scale-95 transition",
        `bg-gradient-to-r ${G}`,
        !selected && "opacity-50 cursor-not-allowed",
      ].join(" ")}
    >
      Continuar
    </button>
        </div>
      </div>
    </main>
  );
}
