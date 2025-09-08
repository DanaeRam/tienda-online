export type StoreProduct = {
  slug: string;
  name: string;
  price: number;       // MXN
  rating: number;      // 0..5
  image: string;       // /tienda/xxx.jpg (lo agregarás en /public)
  category: "Test" | "Suplemento";
  badges?: string[];
  components?: string[];
  objective?: string;
  target?: string;
};

export const storeProducts: StoreProduct[] = [
  {
    slug: "test-epigenetico",
    name: "Test epigenético ISORA",
    price: 2499,
    rating: 5,
    image: "/slides/test.png",
    category: "Test",
    badges: ["Recomendado", "Resultados en 7–10 días"],
    objective: "Análisis epigenético para recomendaciones personalizadas.",
    target: "Cualquier persona que busque optimizar su bienestar con datos.",
  },
  {
    slug: "formula-anti-estres",
    name: "Fórmula Anti-Estrés",
    price: 499,
    rating: 4.8,
    image: "/slides/anti-estres.png",
    category: "Suplemento",
    components: ["GABA", "Triptófano"],
    objective: "Reducción del estrés y mejora del estado anímico.",
    target: "Altos niveles de cortisol y estrés crónico.",
  },
  {
    slug: "vitaminas-esenciales",
    name: "Complejo de Vitaminas Esenciales (D3 + K2 + K1)",
    price: 429,
    rating: 4.7,
    image: "/slides/vitaminas.png",
    category: "Suplemento",
    components: ["Vitamina D3", "Vitamina K2", "Vitamina K1"],
    objective: "Optimiza la absorción de calcio y la salud ósea.",
    target: "Deficiencias vitamínicas detectadas en el test.",
  },
  {
    slug: "enzimas-digestivas",
    name: "Enzimas Digestivas",
    price: 389,
    rating: 4.6,
    image: "/slides/enzimas.png",
    category: "Suplemento",
    components: ["Complejo enzimático especializado"],
    objective: "Mejorar digestión y absorción de nutrientes.",
    target: "Problemas digestivos y mala absorción intestinal.",
  },
  {
    slug: "diabetes-support",
    name: "Fórmula Diabetes Support",
    price: 549,
    rating: 4.5,
    image: "/slides/diabetes.png",
    category: "Suplemento",
    components: ["Formulación específica para control glucémico"],
    objective: "Apoyo en el manejo de niveles de glucosa.",
    target: "Personas con diabetes o prediabetes.",
  },
  {
    slug: "triptófano-puro",
    name: "Triptófano Puro",
    price: 299,
    rating: 4.6,
    image: "/slides/triptofano.png",
    category: "Suplemento",
    components: ["L-Triptófano de alta pureza"],
    objective: "Mejorar el sueño y regular el estado de ánimo.",
    target: "Trastornos del sueño y deficiencias de serotonina.",
  },
];
