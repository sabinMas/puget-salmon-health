import type { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";

interface Props {
  params: Promise<{ module: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { module: slug } = await params;
  const title = slug
    .split("-")
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");
  return { title };
}

export default async function LearnModulePage({ params }: Props) {
  const { module: slug } = await params;
  const title = slug
    .split("-")
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");

  return (
    <>
      <PageHeader title={title} subtitle="Learning module — coming in M3." />
      <div className="mx-auto max-w-3xl px-4 py-12 text-muted">
        MDX content will render here.
      </div>
    </>
  );
}
