import type { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";

export const metadata: Metadata = { title: "Nations" };

export default function NationsPage() {
  return (
    <>
      <PageHeader
        title="The Nations of Puget Sound"
        subtitle={
          "Salmon recovery is guided by the knowledge and leadership of the tribes who have " +
          "cared for these waters and fish since time immemorial. Coming in M2."
        }
      />
      <div className="mx-auto max-w-7xl px-4 py-12 text-muted">
        Partner nation cards and governance statement will live here.
      </div>
    </>
  );
}
