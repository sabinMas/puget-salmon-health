import type { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";
import { getWatershedBySlug } from "@/lib/data/watersheds";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ basin: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { basin } = await params;
  const watershed = getWatershedBySlug(basin);
  return { title: watershed ? `${watershed.name} Watershed` : "Watershed" };
}

export default async function BasinPage({ params }: Props) {
  const { basin } = await params;
  const watershed = getWatershedBySlug(basin);
  if (!watershed) notFound();

  return (
    <>
      <PageHeader
        title={`${watershed.name} Watershed`}
        subtitle={`${watershed.region} — detailed salmon health data coming in M1.`}
      />
      <div className="mx-auto max-w-7xl px-4 py-12 text-muted">
        Basin-specific charts and tribal links will live here.
      </div>
    </>
  );
}
