import type { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";

interface Props {
  params: Promise<{ project: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { project: slug } = await params;
  const title = slug
    .split("-")
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");
  return { title };
}

export default async function ProjectPage({ params }: Props) {
  const { project: slug } = await params;
  const title = slug
    .split("-")
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");

  return (
    <>
      <PageHeader title={title} subtitle="Stewardship project — coming in M4." />
      <div className="mx-auto max-w-4xl px-4 py-12 text-muted">
        Project story, media, and impact data will live here.
      </div>
    </>
  );
}
