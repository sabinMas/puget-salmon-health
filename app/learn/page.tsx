import type { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";

export const metadata: Metadata = { title: "Learn" };

export default function LearnPage() {
  return (
    <>
      <PageHeader
        title="Learn"
        subtitle={
          "Understand the story of salmon — from their life cycle and ecological role " +
          "to the treaty rights and stewardship that protect them. Coming in M3."
        }
      />
      <div className="mx-auto max-w-7xl px-4 py-12 text-muted">
        Learning module cards and educator resources will live here.
      </div>
    </>
  );
}
