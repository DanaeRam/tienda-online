'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState, useCallback } from 'react';

type Slide = {
  src: string;
  title: string;
  subtitle?: string;
};

const slides: Slide[] = [
  { src: '/slides/img_inicio1.jpg', title: 'Mejora tu bienestar', subtitle: 'Rutinas simples, resultados reales' },
  { src: '/slides/img_inicio2.jpg', title: 'Hábitos saludables', subtitle: 'Nutrición, sueño y actividad' },
  { src: '/slides/img_inicio3.jpg', title: 'Seguimiento diario', subtitle: 'Objetivos claros y recordatorios' },
  { src: '/slides/img_inicio4.jpg', title: 'Tu progreso, tu camino', subtitle: 'Listo para empezar' },
];

export default function HomePage() {
  const [index, setIndex] = useState(0);
  const router = useRouter();

  const advance = useCallback(() => {
    if (index < slides.length - 1) {
      setIndex((i) => i + 1);
    } else {
      router.push('/bienvenido');
    }
  }, [index, router]);

  return (
    <div
      className="relative h-svh w-full overflow-hidden select-none"
      onClick={advance}
      role="button"
      aria-label="Avanzar carrusel"
      tabIndex={0}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && advance()}
    >
      {/* Carrusel */}
      <div
        className="flex h-full w-[400vw] transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${index * 100}vw)` }}
      >
        {slides.map((s, i) => (
          <div key={i} className="relative h-svh w-screen shrink-0">
            <Image
              src={s.src}
              alt={s.title}
              fill
              priority={i === 0}
              sizes="100vw"
              className="object-cover"
            />

            {/* Degradado para legibilidad */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />

            {/* Texto sobre la imagen */}
            <div className="absolute inset-x-0 bottom-24 px-6 text-center text-white">
              <h1 className="text-2xl font-semibold leading-tight md:text-3xl">{s.title}</h1>
              {s.subtitle && (
                <p className="mt-2 text-sm opacity-90 md:text-base">{s.subtitle}</p>
              )}
              <p className="mt-6 text-xs opacity-80">Toca para continuar</p>
            </div>
          </div>
        ))}
      </div>

      {/* Indicadores (puntos) */}
      <div className="pointer-events-none absolute inset-x-0 bottom-6 flex items-center justify-center gap-2">
        {slides.map((_, i) => (
          <span
            key={i}
            className={[
              'h-2 w-2 rounded-full border border-white/70',
              i === index ? 'bg-white' : 'bg-white/30',
            ].join(' ')}
            aria-label={`Slide ${i + 1} ${i === index ? 'actual' : ''}`}
          />
        ))}
      </div>
    </div>
  );
}
