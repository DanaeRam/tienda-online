"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const G = "from-blue-600 to-green-400";
const GText = "bg-gradient-to-r from-blue-600 to-green-400 bg-clip-text text-transparent";

type Tab = { href: string; label: string; icon: React.ReactNode };

function GradIcon({ children }: { children: React.ReactNode }) {
  return (
    <span
      className={`inline-flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-r ${G} text-white`}
      aria-hidden
    >
      {children}
    </span>
  );
}

const TABS: Tab[] = [
  { href: "/inicio",      label: "Inicio",      icon: <GradIcon>🏠</GradIcon> },
  { href: "/resultados",  label: "Resultados",  icon: <GradIcon>📊</GradIcon> },
  { href: "/habitos",     label: "Hábitos",     icon: <GradIcon>🌱</GradIcon> },
  { href: "/tienda", label: "Tienda", icon: <GradIcon>💊</GradIcon> },
  { href: "/perfil",      label: "Perfil",      icon: <GradIcon>👤</GradIcon> },
];

export default function NavMain() {
  const pathname = usePathname();

  return (
    <nav
      className={[
        "mx-auto max-w-6xl px-3",
        // Contenedor “pastilla” con blur + sombra
        "pb-[max(env(safe-area-inset-bottom),0px)]",
      ].join(" ")}
    >
      <ul
        className={[
          "flex items-center justify-between gap-1",
          "rounded-2xl border border-white/60 bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60",
          "shadow-[0_8px_24px_rgba(0,0,0,0.08)]",
          "px-2 py-2",
        ].join(" ")}
      >
        {TABS.map((t) => {
          const active =
            pathname === t.href ||
            (t.href !== "/inicio" && pathname?.startsWith(t.href));

          return (
            <li key={t.href} className="flex-1">
              <Link
                href={t.href}
                className={[
                  "group flex flex-col items-center justify-center gap-1 py-1.5 text-[11px] leading-none",
                  "active:scale-95 transition-transform",
                ].join(" ")}
              >
                <span
                  className={[
                    "inline-flex items-center justify-center",
                    active ? "" : "opacity-70 group-hover:opacity-100",
                  ].join(" ")}
                >
                  {t.icon}
                </span>

                <span
                  className={[
                    "whitespace-nowrap",
                    active ? `font-semibold ${GText}` : "text-gray-600",
                  ].join(" ")}
                >
                  {t.label}
                </span>

                {/* Indicador activo (píldora delgada) */}
                <span
                  className={[
                    "mt-1 h-1 w-5 rounded-full",
                    active ? `bg-gradient-to-r ${G}` : "bg-transparent",
                    "transition-all duration-300",
                  ].join(" ")}
                  aria-hidden
                />
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
