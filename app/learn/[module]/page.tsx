// Next.js 15 dynamic route: params is a Promise and must be awaited inside the component.
// Only `params` and `searchParams` are valid props for a page — no extra fields.
import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";

interface Props {
  params: Promise<{ module: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { module: slug } = await params;
  const title = slug
    .split("-")
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");
  return {
    title: `${title} | Learn | Puget Sound Salmon Health`,
    description: `Learn about ${title.toLowerCase()} and its connection to Puget Sound Chinook salmon recovery.`,
  };
}

export default async function LearnModulePage({ params }: Props) {
  const { module: slug } = await params;
  const title = slug
    .split("-")
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");

  return (
    <>
      <PageHeader title={title} description="Learning module — coming in M3." />
      <div className="mx-auto max-w-3xl px-4 py-12 text-muted">
        MDX content will render here.
      </div>
    </>
  );
}
