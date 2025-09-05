import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Bienvenido",
};

export default function BienvenidoPage() {
  return (
    <main className="flex h-svh w-full items-center justify-center bg-white px-6 text-center">
      <div className="flex flex-col items-center">
        {/* Logo */}
        <div className="mx-auto mb-6 h-16 w-16">
          <Image src="/logo.svg" alt="Logo de la app" width={64} height={64} priority />
        </div>

        {/* Texto */}
        <h1 className="text-3xl font-semibold text-gray-900">¡Bienvenido!</h1>
        <p className="mt-2 text-gray-600 max-w-xs">
          Estamos listos para acompañarte en tu camino de salud y bienestar.
        </p>

        {/* Botón con efecto presionado */}
        <Link
          href="/auth"
          className="mt-8 inline-block rounded-full px-8 py-3 text-white font-semibold 
                     bg-gradient-to-r from-blue-600 to-green-400 shadow-md 
                     hover:opacity-90 active:scale-95 transition-transform duration-100"
        >
          Activa tu bienestar
        </Link>
      </div>
    </main>
  );
}
