import type { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";
import Placeholder from "@/components/ui/Placeholder";
import { getTribeBySlug } from "@/lib/data/tribes";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ tribe: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tribe } = await params;
  const t = getTribeBySlug(tribe);
  return { title: t ? t.name : "Nation" };
}

export default async function TribePage({ params }: Props) {
  const { tribe } = await params;
  const t = getTribeBySlug(tribe);
  if (!t) notFound();

  return (
    <>
      <PageHeader title={t.name} subtitle={t.tagline} />
      <div className="mx-auto max-w-4xl space-y-4 px-4 py-12">
        <Placeholder owner={t.name} section="Introduction & salmon relationship" />
        <Placeholder owner={t.name} section="Historical practices" />
        <Placeholder owner={t.name} section="Salmon today" />
      </div>
    </>
  );
}
