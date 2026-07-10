import type { Metadata } from "next";
import AromaDetail from "@/src/page/IrisFowerNicho";
import { aromasData } from "@/src/Features/landingpages/types/aromasData";

// SSG: pre-render satu halaman statis per slug saat build (SEO + super cepat).
export function generateStaticParams() {
  return aromasData.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const aroma = aromasData.find((a) => a.slug === slug);
  if (!aroma) return { title: "Aroma tidak ditemukan | Saa Fragrance" };
  return {
    title: `${aroma.name} | Saa Fragrance`,
    description: aroma.description,
    openGraph: { title: aroma.name, description: aroma.description, images: [aroma.image] },
  };
}

export default async function IsolateDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <AromaDetail slug={slug} />;
}
