"use client";

import { useEffect, useState } from "react";

const G = "bg-gradient-to-r from-blue-600 to-green-400";
const GradText = ({ children }: { children: React.ReactNode }) => (
  <span className="bg-gradient-to-r from-blue-600 to-green-400 bg-clip-text text-transparent">
    {children}
  </span>
);

type Preferences = {
  language: "es" | "en";
  notifications: boolean;
  shareAnonymized: boolean;
};

export default function PerfilClient() {
  // ----- Datos personales -----
  const [name, setName] = useState("");
  const [age, setAge] = useState<number | "">("");
  const [email, setEmail] = useState("");

  // ----- Metas -----
  const [goalSteps, setGoalSteps] = useState<number | "">(8000);
  const [goalSleep, setGoalSleep] = useState<number | "">(7.5);

  // ----- Preferencias -----
  const [prefs, setPrefs] = useState<Preferences>({
    language: "es",
    notifications: true,
    shareAnonymized: true,
  });

  // Cargar de localStorage
  useEffect(() => {
    try {
      const n = localStorage.getItem("userName");
      if (n) setName(n);

      const p = localStorage.getItem("profile");
      if (p) {
        const obj = JSON.parse(p) as {
          name?: string; age?: number; email?: string;
          goalSteps?: number; goalSleep?: number;
          prefs?: Preferences;
        };
        if (obj.name) setName(obj.name);
        if (typeof obj.age === "number") setAge(obj.age);
        if (obj.email) setEmail(obj.email);
        if (typeof obj.goalSteps === "number") setGoalSteps(obj.goalSteps);
        if (typeof obj.goalSleep === "number") setGoalSleep(obj.goalSleep);
        if (obj.prefs) setPrefs(obj.prefs);
      }
    } catch {}
  }, []);

  // Guardar en localStorage
  const persist = () => {
    try {
      localStorage.setItem("userName", name);
      localStorage.setItem(
        "profile",
        JSON.stringify({
          name,
          age: typeof age === "number" ? age : undefined,
          email,
          goalSteps: typeof goalSteps === "number" ? goalSteps : undefined,
          goalSleep: typeof goalSleep === "number" ? goalSleep : undefined,
          prefs,
        })
      );
      // feedback suave
      if (typeof window !== "undefined") {
        // eslint-disable-next-line no-console
        console.log("Perfil guardado");
      }
    } catch {
      alert("No se pudo guardar localmente.");
    }
  };

  // Historial (mock)
  const history = [
    { label: "Test epigenético", value: "Completado hace 12 días" },
    { label: "Ritmo cardiaco", value: "Prom. 79 bpm (esta semana)" },
    { label: "Actividad", value: "4/7 días con objetivo cumplido" },
  ];

  return (
    <main className="min-h-svh w-full bg-white">
      {/* Header */}
      <header className="px-6 pt-8 pb-4">
        <h1 className="text-2xl font-semibold text-gray-900">
          Tu <GradText>Perfil</GradText>
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Gestiona tus datos, metas y preferencias.
        </p>
      </header>

      <section className="px-6 space-y-6 pb-28">
        {/* --------- Datos personales --------- */}
        <article className="rounded-2xl border bg-white p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-xl bg-gray-100 flex items-center justify-center text-lg">👤</div>
            <div className="flex-1">
              <h2 className="text-base font-semibold text-gray-900">Datos personales</h2>
              <p className="text-xs text-gray-500 mb-3">Actualiza tu información básica.</p>

              <div className="grid gap-3 sm:grid-cols-3">
                <div>
                  <label htmlFor="name" className="block text-xs text-gray-500 mb-1">Nombre</label>
                  <input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Tu nombre"
                    className="w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div>
                  <label htmlFor="age" className="block text-xs text-gray-500 mb-1">Edad</label>
                  <input
                    id="age"
                    type="number"
                    min={1}
                    max={120}
                    value={age}
                    onChange={(e) => {
                      const v = e.target.value;
                      setAge(v === "" ? "" : Math.max(1, Math.min(120, Number(v))));
                    }}
                    placeholder="Ej. 29"
                    className="w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-xs text-gray-500 mb-1">Cuenta (email)</label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tucorreo@ejemplo.com"
                    className="w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
              </div>

              <div className="mt-4">
                <button
                  onClick={persist}
                  className={`rounded-full px-5 py-2.5 text-white font-medium shadow ${G} hover:opacity-90 active:scale-95 transition`}
                >
                  Guardar cambios
                </button>
              </div>
            </div>
          </div>
        </article>

        {/* --------- Metas --------- */}
        <article className="rounded-2xl border bg-white p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-xl bg-gray-100 flex items-center justify-center text-lg">🎯</div>
            <div className="flex-1">
              <h2 className="text-base font-semibold text-gray-900">Metas</h2>
              <p className="text-xs text-gray-500 mb-3">Define objetivos claros para medir tu progreso.</p>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label htmlFor="steps" className="block text-xs text-gray-500 mb-1">Pasos diarios</label>
                  <div className="flex items-center gap-2">
                    <input
                      id="steps"
                      type="number"
                      min={1000}
                      step={500}
                      value={goalSteps}
                      onChange={(e) => {
                        const v = e.target.value;
                        setGoalSteps(v === "" ? "" : Math.max(1000, Number(v)));
                      }}
                      className="w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <span className="text-xs text-gray-500">pasos</span>
                  </div>
                </div>
                <div>
                  <label htmlFor="sleep" className="block text-xs text-gray-500 mb-1">Sueño</label>
                  <div className="flex items-center gap-2">
                    <input
                      id="sleep"
                      type="number"
                      min={4}
                      max={12}
                      step={0.5}
                      value={goalSleep}
                      onChange={(e) => {
                        const v = e.target.value;
                        setGoalSleep(v === "" ? "" : Math.max(4, Math.min(12, Number(v))));
                      }}
                      className="w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <span className="text-xs text-gray-500">horas</span>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <button
                  onClick={persist}
                  className={`rounded-full px-5 py-2.5 text-white font-medium shadow ${G} hover:opacity-90 active:scale-95 transition`}
                >
                  Guardar metas
                </button>
              </div>
            </div>
          </div>
        </article>

        {/* --------- Historial de salud --------- */}
        <article className="rounded-2xl border bg-white p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-xl bg-gray-100 flex items-center justify-center text-lg">📈</div>
            <div className="flex-1">
              <h2 className="text-base font-semibold text-gray-900">Historial de salud</h2>
              <ul className="mt-3 divide-y text-sm">
                {history.map((h) => (
                  <li key={h.label} className="flex items-center justify-between py-2">
                    <span className="text-gray-700">{h.label}</span>
                    <span className="text-gray-500">{h.value}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-3">
                <button className="rounded-full px-4 py-2 text-sm font-medium text-white shadow bg-gradient-to-r from-blue-600 to-green-400 hover:opacity-90 active:scale-95 transition">
                  Ver detalle
                </button>
              </div>
            </div>
          </div>
        </article>

        {/* --------- Preferencias --------- */}
        <article className="rounded-2xl border bg-white p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-xl bg-gray-100 flex items-center justify-center text-lg">⚙️</div>
            <div className="flex-1">
              <h2 className="text-base font-semibold text-gray-900">Preferencias</h2>

              <div className="grid gap-4 sm:grid-cols-3 mt-3">
                {/* Idioma */}
                <div>
                  <label htmlFor="lang" className="block text-xs text-gray-500 mb-1">Idioma</label>
                  <select
                    id="lang"
                    value={prefs.language}
                    onChange={(e) =>
                      setPrefs((p) => ({ ...p, language: (e.target.value as "es" | "en") }))
                    }
                    className="w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="es">Español</option>
                    <option value="en">English</option>
                  </select>
                </div>

                {/* Notificaciones */}
                <div className="flex items-center justify-between rounded-xl border px-3 py-2">
                  <div>
                    <p className="text-sm text-gray-800">Notificaciones</p>
                    <p className="text-xs text-gray-500">Recordatorios y actualizaciones</p>
                  </div>
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="peer sr-only"
                      checked={prefs.notifications}
                      onChange={(e) => setPrefs((p) => ({ ...p, notifications: e.target.checked }))}
                    />
                    <span className="peer-checked:from-blue-600 peer-checked:to-green-400 relative h-6 w-11 rounded-full bg-gray-300 transition-colors bg-gradient-to-r from-gray-300 to-gray-300 peer-checked:shadow-inner"></span>
                  </label>
                </div>

                {/* Privacidad */}
                <div className="flex items-center justify-between rounded-xl border px-3 py-2">
                  <div>
                    <p className="text-sm text-gray-800">Compartir anónimo</p>
                    <p className="text-xs text-gray-500">Para mejorar recomendaciones</p>
                  </div>
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="peer sr-only"
                      checked={prefs.shareAnonymized}
                      onChange={(e) => setPrefs((p) => ({ ...p, shareAnonymized: e.target.checked }))}
                    />
                    <span className="peer-checked:from-blue-600 peer-checked:to-green-400 relative h-6 w-11 rounded-full bg-gray-300 transition-colors bg-gradient-to-r from-gray-300 to-gray-300 peer-checked:shadow-inner"></span>
                  </label>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  onClick={persist}
                  className={`rounded-full px-5 py-2.5 text-white font-medium shadow ${G} hover:opacity-90 active:scale-95 transition`}
                >
                  Guardar preferencias
                </button>
                <button
                  className="rounded-full px-5 py-2.5 text-sm font-medium border"
                  onClick={() => alert("Exportación de datos (próximamente)")}
                >
                  Exportar datos
                </button>
                <button
                  className="rounded-full px-5 py-2.5 text-sm font-medium border"
                  onClick={() => alert("Asesoría personalizada (próximamente)")}
                >
                  Solicitar asesoría
                </button>
              </div>
            </div>
          </div>
        </article>

        {/* --------- Otras opciones --------- */}
        <article className="rounded-2xl border bg-white p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-xl bg-gray-100 flex items-center justify-center text-lg">🔐</div>
            <div className="flex-1">
              <h2 className="text-base font-semibold text-gray-900">Seguridad</h2>
              <p className="text-sm text-gray-700 mt-1">Protege tu cuenta con buenas prácticas.</p>
              <ul className="mt-3 list-disc pl-5 text-sm text-gray-600 space-y-1">
                <li>Usa una contraseña robusta y única.</li>
                <li>Activa verificación en dos pasos cuando esté disponible.</li>
                <li>Revisa inicios de sesión inusuales periódicamente.</li>
              </ul>
              <div className="mt-4 flex gap-3">
                <button className={`rounded-full px-4 py-2 text-white text-sm ${G}`}>Cambiar contraseña</button>
                <button className="rounded-full px-4 py-2 text-sm border">Cerrar sesión</button>
              </div>
            </div>
          </div>
        </article>
      </section>
    </main>
  );
}
