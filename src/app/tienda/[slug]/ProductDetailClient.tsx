"use client";

type Props = {
  name: string;
  price: number;
  category: "Test" | "Suplemento";
  components: string[];
  objective: string;
  target: string;
};

export default function ProductDetailClient(props: Props) {
  const { name, price, category, components, objective, target } = props;

  const addToCart = () => {
    // aquí puedes integrar tu carro real (Zustand/Server Actions)
    alert(`Añadido al carrito: ${name}`);
  };

  return (
    <>
      <article className="rounded-2xl p-5 shadow-sm border bg-white">
        <h3 className="text-base font-semibold text-gray-900">Descripción</h3>
        {category === "Test" ? (
          <p className="text-sm text-gray-700 mt-2">
            Analiza marcadores epigenéticos para generar recomendaciones personalizadas de salud y bienestar.
          </p>
        ) : (
          <div className="text-sm text-gray-700 mt-2 space-y-2">
            {components.length ? <p><b>Componentes:</b> {components.join(", ")}.</p> : null}
            {objective ? <p><b>Objetivo:</b> {objective}</p> : null}
            {target ? <p><b>Target:</b> {target}</p> : null}
          </div>
        )}
      </article>

      <button
        onClick={addToCart}
        className="w-full rounded-full px-6 py-3 text-white font-semibold
                   bg-gradient-to-r from-blue-600 to-green-400 shadow
                   hover:opacity-90 active:scale-95 transition"
      >
        Agregar al carrito — ${price.toFixed(2)} MXN
      </button>
    </>
  );
}
