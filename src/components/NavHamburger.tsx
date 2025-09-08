"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const G = "from-blue-600 to-green-400";

function IconMenu() {
  return (
    <svg viewBox="0 0 24 24" className={`h-6 w-6 bg-gradient-to-r ${G} fill-white rounded-md p-[3px]`} aria-hidden>
      <path d="M3 6h18v2H3zm0 5h18v2H3zm0 5h18v2H3z" />
    </svg>
  );
}

const LINKS = [
  { href: "/configuracion", label: "Configuración", desc: "Idioma, notificaciones, privacidad, sincronización" },
  { href: "/soporte", label: "Contacto y soporte", desc: "Chat con expertos, FAQs, ayuda técnica" },
  { href: "/agenda", label: "Agenda", desc: "Citas, historial y nuevas sesiones" },
  { href: "/testimonios", label: "Testimonios", desc: "Historias reales y comunidad" },
  { href: "/sobre", label: "Sobre ISORA", desc: "Institución, respaldo científico, misión y visión" },
];

export default function NavHamburger() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // cierra el panel al navegar
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <button
        aria-label="Abrir menú"
        onClick={() => setOpen(true)}
        className="rounded-md p-1 active:scale-95 transition"
      >
        <IconMenu />
      </button>

      {/* Overlay */}
      <div
        className={[
          "fixed inset-0 z-50 bg-black/30 transition-opacity",
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
        ].join(" ")}
        onClick={() => setOpen(false)}
      />

      {/* Panel lateral */}
      <div
        ref={panelRef}
        className={[
          "fixed left-0 top-0 z-50 h-full w-[84%] max-w-sm bg-white shadow-2xl",
          "transition-transform duration-300 ease-out",
          open ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
      >
        <div className="flex items-center justify-between px-4 h-14 border-b">
          <span className="text-sm font-semibold">Menú</span>
          <button onClick={() => setOpen(false)} aria-label="Cerrar" className="rounded p-2 hover:bg-gray-50">
            ✕
          </button>
        </div>

        <nav className="px-2 py-3">
          <ul className="space-y-1">
            {LINKS.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="block rounded-lg px-3 py-3 hover:bg-gray-50"
                  title={l.desc}
                >
                  <p className="text-sm font-medium">{l.label}</p>
                  <p className="text-xs text-gray-500">{l.desc}</p>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
}
