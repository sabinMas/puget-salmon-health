import type { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";

export const metadata: Metadata = { title: "For Educators" };

export default function EducatorsPage() {
  return (
    <>
      <PageHeader
        title="Resources for Educators"
        subtitle="Lesson plans, activity ideas, and standards alignment notes. Coming in M3."
      />
      <div className="mx-auto max-w-7xl px-4 py-12 text-muted">
        Downloadable resources will live here.
      </div>
    </>
  );
}
