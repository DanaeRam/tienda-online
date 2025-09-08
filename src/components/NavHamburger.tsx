"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Portal from "./Portal";

/* Utilidades */
const G = "from-blue-600 to-green-400";
const GText = "bg-gradient-to-r from-blue-600 to-green-400 bg-clip-text text-transparent";

function IconMenu() {
  return (
    <svg viewBox="0 0 24 24" className={`h-6 w-6 bg-gradient-to-r ${G} text-white rounded-md p-[3px]`}>
      <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/* Íconos de trazo minimalistas */
const I = {
  dashboard: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" stroke="currentColor" fill="none" strokeWidth="1.8">
      <path d="M3 3h8v8H3zM13 3h8v5h-8zM13 10h8v11h-8zM3 13h8v8H3z" />
    </svg>
  ),
  activity: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" stroke="currentColor" fill="none" strokeWidth="1.8">
      <path d="M3 12h3l3 7 4-14 3 7h5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  appointments: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" stroke="currentColor" fill="none" strokeWidth="1.8">
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M8 3v4M16 3v4M3 9h18M8 13h4" />
    </svg>
  ),
  analytics: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" stroke="currentColor" fill="none" strokeWidth="1.8">
      <path d="M4 20V9M10 20V4M16 20v-8M22 21H2" strokeLinecap="round" />
    </svg>
  ),
  help: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" stroke="currentColor" fill="none" strokeWidth="1.8">
      <path d="M12 18h.01M9 9a3 3 0 1 1 5.2 2.1c-.7.7-1.2 1.2-1.2 2.4M12 22a10 10 0 1 1 0-20 10 10 0 0 1 0 20z" strokeLinecap="round" />
    </svg>
  ),
  settings: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" stroke="currentColor" fill="none" strokeWidth="1.8">
      <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
      <path d="M19.4 15a1 1 0 0 0 .2 1.1l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1 1 0 0 0-1.1-.2 1 1 0 0 0-.6.8v.2a2 2 0 1 1-4 0v-.2a1 1 0 0 0-.6-.8 1 1 0 0 0-1.1.2l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1 1 0 0 0 .2-1.1 1 1 0 0 0-.8-.6H4a2 2 0 1 1 0-4h.2a1 1 0 0 0 .8-.6 1 1 0 0 0-.2-1.1l-.1-.1A2 2 0 1 1 7.5 4l.1.1a1 1 0 0 0 1.1.2 1 1 0 0 0 .6-.8V3.3a2 2 0 1 1 4 0v.2a1 1 0 0 0 .6.8 1 1 0 0 0 1.1-.2l.1-.1A2 2 0 1 1 20 7.5l-.1.1a1 1 0 0 0-.2 1.1 1 1 0 0 0 .8.6H21a2 2 0 1 1 0 4h-.2a1 1 0 0 0-.8.6z" />
    </svg>
  ),
  testimonials: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" stroke="currentColor" fill="none" strokeWidth="1.8">
      <path d="M7 11h6M7 7h10M5 21l3-3h11a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14l2 2z" strokeLinecap="round" />
    </svg>
  ),
  about: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" stroke="currentColor" fill="none" strokeWidth="1.8">
      <path d="M12 12v6M12 8h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" strokeLinecap="round" />
    </svg>
  ),
};

type Item = { href: string; label: string; icon: React.ReactNode; desc?: string };

/* Listas (en español) */
const GENERAL: Item[] = [
  { href: "/inicio",      label: "Panel",        icon: I.dashboard,     desc: "Vista general" },
  { href: "/habitos",     label: "Actividad",    icon: I.activity,      desc: "Hábitos y rachas" },
  { href: "/agenda",      label: "Citas",        icon: I.appointments,  desc: "Programadas e historial" },
  { href: "/resultados",  label: "Analítica",    icon: I.analytics,     desc: "Resultados y gráficas" },
];

const SISTEMA: Item[] = [
  { href: "/soporte",        label: "Centro de ayuda", icon: I.help,      desc: "FAQ y soporte técnico" },
  { href: "/configuracion",  label: "Ajustes",         icon: I.settings,  desc: "Preferencias y privacidad" },
];

const ACERCA: Item[] = [
  { href: "/testimonios", label: "Testimonios", icon: I.testimonials, desc: "Historias reales" },
  { href: "/sobre",       label: "Sobre ISORA", icon: I.about,        desc: "Misión y respaldo" },
];

export default function NavHamburger() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const panelRef = useRef<HTMLDivElement>(null);

  /* Cierra al navegar */
  useEffect(() => { setOpen(false); }, [pathname]);

  /* Escape para cerrar */
  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") setOpen(false); }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  /* Bloquear scroll del body al abrir */
  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = prev; };
    }
  }, [open]);

  /* Item */
  const NavItem = ({ item }: { item: Item }) => {
    const active = pathname === item.href || pathname?.startsWith(item.href + "/");
    return (
      <li>
        <Link
          href={item.href}
          className="group relative flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-gray-50 transition-colors"
        >
          {/* indicador activo */}
          <span
            className={[
              "absolute left-0 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full",
              active ? `bg-gradient-to-r ${G}` : "bg-transparent",
            ].join(" ")}
            aria-hidden
          />
          {/* icono */}
          <span className={active ? `text-transparent ${GText}` : "text-gray-600"}>{item.icon}</span>
          {/* texto */}
          <div className="flex-1">
            <p className={["text-sm", active ? GText : "text-gray-800"].join(" ")}>{item.label}</p>
            {item.desc && <p className="text-xs text-gray-500">{item.desc}</p>}
          </div>
        </Link>
      </li>
    );
  };

  return (
    <>
            <button
        aria-label="Abrir menú"
        onClick={() => setOpen(true)}
        className="rounded-md p-1 active:scale-95 transition"
      >
        <IconMenu />
      </button>

      <Portal>
        {/* Overlay blanco opaco, cubre TODO */}
        {open && (
          <div
            className="fixed inset-0 z-[9996] bg-white"
            onClick={() => setOpen(false)}
          />
        )}

        {/* Panel lateral por encima del overlay */}
        <div
          ref={panelRef}
          className={[
            "fixed left-0 top-0 z-[9997] h-full w-[86%] max-w-sm",
            "bg-white shadow-xl border-r",
            "transition-transform duration-300 ease-out",
            open ? "translate-x-0" : "-translate-x-full",
          ].join(" ")}
          role="dialog"
          aria-modal="true"
          aria-label="Menú principal"
        >
          {/* Header del panel */}
          <div className="h-14 flex items-center justify-between px-4 border-b">
            <span className="text-sm font-semibold tracking-wide">Menú</span>
            <button onClick={() => setOpen(false)} aria-label="Cerrar" className="rounded p-2 hover:bg-gray-50">✕</button>
          </div>

          {/* Contenido */}
          <nav className="px-3 py-4">
            <p className="px-3 text-[11px] font-medium text-gray-400">GENERAL</p>
            <ul className="mt-2 space-y-1">
              {GENERAL.map((item) => <NavItem key={item.href} item={item} />)}
            </ul>

            <p className="mt-5 px-3 text-[11px] font-medium text-gray-400">SISTEMA</p>
            <ul className="mt-2 space-y-1">
              {SISTEMA.map((item) => <NavItem key={item.href} item={item} />)}
            </ul>

            <p className="mt-5 px-3 text-[11px] font-medium text-gray-400">ACERCA DE</p>
            <ul className="mt-2 space-y-1 pb-6">
              {ACERCA.map((item) => <NavItem key={item.href} item={item} />)}
            </ul>
          </nav>
        </div>
      </Portal>
    </>
  );
}
