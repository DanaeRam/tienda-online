import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { storeProducts } from "@/data/tienda";
import ProductDetailClient from "./ProductDetailClient";

export const generateStaticParams = async () =>
  storeProducts.map((p) => ({ slug: p.slug }));

// 👇 params es Promise y hay que await
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const prod = storeProducts.find((p) => p.slug === slug);
  return { title: prod ? prod.name : "Producto" };
}

// 👇 también aquí: await params
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = storeProducts.find((x) => x.slug === slug);
  if (!p) return notFound();

  return (
    <main className="min-h-svh w-full bg-white">
      <header className="px-6 pt-8 pb-4">
        <Link href="/tienda" className="text-sm text-gray-600 hover:underline">
          ← Volver a Tienda
        </Link>
        <h1 className="text-2xl font-semibold text-gray-900 mt-2">{p.name}</h1>
        <p className="text-gray-600 mt-1">${p.price.toFixed(2)} MXN</p>
      </header>

      <section className="px-6 grid gap-6 pb-24">
        <div className="relative w-full h-60 rounded-2xl bg-gray-50 border overflow-hidden">
          <Image src={p.image} alt={p.name} fill className="object-contain" />
        </div>

        <ProductDetailClient
          name={p.name}
          price={p.price}
          category={p.category}
          components={p.components ?? []}
          objective={p.objective ?? ""}
          target={p.target ?? ""}
        />
      </section>
    </main>
  );
}
