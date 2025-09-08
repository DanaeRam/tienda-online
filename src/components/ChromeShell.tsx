"use client";

import { usePathname } from "next/navigation";
import NavMain from "@/components/NavMain";
import NavHamburger from "@/components/NavHamburger";
import { PropsWithChildren } from "react";

/**
 * Rutas donde NO queremos menús:
 *  - "/" (carrusel)
 *  - "/bienvenido"
 *  - "/auth"
 */
const HIDDEN_PATHS = ["/", "/bienvenido", "/auth"];

export default function ChromeShell({ children }: PropsWithChildren) {
  const pathname = usePathname();

  const hideChrome = HIDDEN_PATHS.some(
    (p) => pathname === p || pathname?.startsWith(`${p}/`)
  );

  if (hideChrome) {
    // Sin menús (pantallas “full”)
    return <>{children}</>;
  }

  // Con menús (header + bottom nav)
  return (
    <div className="min-h-dvh flex flex-col bg-white text-gray-900">
      {/* Header superior con menú hamburguesa */}
      <header className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
          <NavHamburger />
          <div className="text-sm font-semibold tracking-wide">ISORA</div>
          <div className="w-6" />
        </div>
      </header>

      {/* Contenido con espacio inferior para la barra */}
      <main className="flex-1 mx-auto w-full max-w-6xl px-4 py-6 pb-24">
        {children}
      </main>

      {/* Menú inferior tipo iOS */}
      <footer className="fixed bottom-0 inset-x-0 z-40 bg-transparent">
        <NavMain />
      </footer>
    </div>
  );
}
