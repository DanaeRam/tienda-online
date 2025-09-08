// src/components/Portal.tsx
"use client";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export default function Portal({ children }: { children: React.ReactNode }) {
  const ref = useRef<Element | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const el = document.createElement("div");
    el.setAttribute("id", "portal-root");
    document.body.appendChild(el);
    ref.current = el;
    setMounted(true);
    return () => {
      if (ref.current) document.body.removeChild(ref.current);
    };
  }, []);

  return mounted && ref.current ? createPortal(children, ref.current) : null;
}
