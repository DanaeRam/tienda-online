"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import NavHamburger from "@/components/NavHamburger";
import NavMain from "@/components/NavMain";
import Image from "next/image";

const HIDE_ON = ["/bienvenido", "/auth", "/personaje"]; // rutas sin menús

export default function AppFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // 1) Evita decidir nada en SSR para que coincida HTML inicial
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // 2) Solo calculamos shouldHide cuando ya montó (cliente)
  const shouldHide = mounted
    ? HIDE_ON.some((p) => pathname === p || pathname?.startsWith(p + "/"))
    : true; // durante SSR / primer render: oculto (coincide en ambos)

  const mainClass = [
    "flex-1",
    "w-full",
    "px-4",
    "py-6",
    !shouldHide && "pb-24", // padding extra cuando hay footer fijo
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="flex flex-col min-h-screen w-full bg-white" suppressHydrationWarning>
      {/* Header */}
{mounted && !shouldHide && (
  <header className="sticky top-0 z-40 bg-white/90 backdrop-blur">
    <div className="px-4 h-16 flex items-center justify-between w-full">
      <NavHamburger />
      <img
        src="/slides/logo2_app.png"
        alt="ISORA Logo"
        className="h-12 w-auto"  // -> más grande (puedes usar h-14 si quieres)
      />
      <div className="w-6" />
    </div>
  </header>
)}


      {/* Contenido */}
      <main className={mainClass} suppressHydrationWarning>
        {children}
      </main>

      {/* Footer fijo inferior */}
      {mounted && !shouldHide && (
        <footer className="fixed bottom-0 inset-x-0 z-40 bg-white/90">
          <NavMain />
        </footer>
      )}
    </div>
  );
}
