import type { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";

export const metadata: Metadata = { title: "Stewardship" };

export default function StewardshipPage() {
  return (
    <>
      <PageHeader
        title="Stewardship & Projects"
        subtitle={
          "Tribal nations are leading salmon recovery through habitat restoration, " +
          "monitoring, climate adaptation, and youth education. Coming in M4."
        }
      />
      <div className="mx-auto max-w-7xl px-4 py-12 text-muted">
        Project cards and filter bar will live here.
      </div>
    </>
  );
}
