"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function BienvenidoClient() {
  const [transitioning, setTransitioning] = useState(false);
  const router = useRouter();

  const handleClick = () => {
    setTransitioning(true);
    // Espera a que termine la animación (~1s) antes de navegar
    setTimeout(() => {
      router.push("/auth");
    }, 1000);
  };

  return (
    <main className="relative flex h-svh w-full items-center justify-center bg-white px-6 text-center overflow-hidden">
      {/* Contenido principal */}
      <div className="flex flex-col items-center z-10">
        <div className="mx-auto mb-6 h-16 w-16">
          <Image src="/logo.svg" alt="Logo de la app" width={64} height={64} priority />
        </div>

        <h1 className="text-3xl font-semibold text-gray-900">¡Bienvenid@!</h1>
        <p className="mt-2 text-gray-600 max-w-xs">
          Estamos listos para acompañarte en tu camino de salud y bienestar.
        </p>

        <button
          onClick={handleClick}
          className="mt-8 inline-block rounded-full px-8 py-3 text-white font-semibold 
                     bg-gradient-to-r from-blue-600 to-green-400 shadow-md 
                     hover:opacity-90 active:scale-95 transition-transform duration-150"
        >
          Activa tu bienestar
        </button>
      </div>

      {/* Overlay de transición tipo "ola" */}
      <div
        className={`absolute inset-x-[-10%] bottom-[-40%] h-[160%] pointer-events-none z-20
                    bg-gradient-to-r from-blue-300 to-green-300
                    rounded-t-[50%] 
                    transition-transform duration-1000 ease-in-out
                    ${transitioning ? "translate-y-[-60%]" : "translate-y-[0%]"}
        `}
        aria-hidden
      />

      {/* Variante con clip-path más “orgánica” (opcional):
          Sustituye el div anterior por este y añade 'will-change: clip-path' para suavidad.
          <div className={`absolute inset-0 z-20 pointer-events-none transition-[clip-path] duration-1000 ease-in-out
                           ${transitioning ? 'clip-path-[circle(150%_at_50%_100%)]' : 'clip-path-[circle(0%_at_50%_100%)]'}
                           bg-gradient-to-r from-blue-300 to-green-300`} />
      */}
    </main>
  );
}

