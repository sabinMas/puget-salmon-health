import type { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";

export const metadata: Metadata = { title: "Dashboard" };

export default function DashboardPage() {
  return (
    <>
      <PageHeader
        title="Salmon Health Dashboard"
        subtitle="Current conditions and trends across Puget Sound watersheds. Coming in M1."
      />
      <div className="mx-auto max-w-7xl px-4 py-12 text-muted">
        Watershed selector, metric cards, and charts will live here.
      </div>
    </>
  );
}
