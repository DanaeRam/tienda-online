"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthClient() {
  const [name, setName] = useState("");
  const [saved, setSaved] = useState(false);
  const router = useRouter();

  useEffect(() => {
    try {
      const existing = localStorage.getItem("userName");
      if (existing) setName(existing);
    } catch {}
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;

    try {
      localStorage.setItem("userName", trimmed);
      setSaved(true);
      router.push("/inicio"); // ⬅️ ir a la pantalla de inicio
    } catch {
      alert("No se pudo guardar localmente. Intenta de nuevo.");
    }
  };

  return (
    <main className="flex h-svh items-center justify-center bg-gray-50 px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold text-gray-900">
            Inicia sesión / Regístrate
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Ingresa tu nombre para personalizar tu experiencia.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="text-left">
            <label htmlFor="name" className="mb-2 block text-sm font-medium text-gray-700">
              Nombre
            </label>
            <input
              id="name"
              name="name"
              value={name}
              onChange={(e) => { setName(e.target.value); setSaved(false); }}
              placeholder="Tu nombre"
              autoComplete="name"
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-transparent focus:ring-2 focus:ring-blue-400"
            />
            <p className="mt-1 text-xs text-gray-500">
              Lo usaremos para darte la bienvenida y personalizar la app.
            </p>
          </div>

          <button
            type="submit"
            className="w-full rounded-full px-8 py-3 text-white font-semibold 
                       bg-gradient-to-r from-blue-600 to-green-400 shadow-md 
                       hover:opacity-90 active:scale-95 transition-transform duration-150"
            disabled={!name.trim()}
          >
            Continuar
          </button>

          {saved && (
            <p role="status" className="text-center text-sm text-green-700">
              ¡Guardado! Hola, <span className="font-medium">{name}</span>.
            </p>
          )}
        </form>
      </div>
    </main>
  );
}
