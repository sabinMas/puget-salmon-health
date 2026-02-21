import type { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";

export const metadata: Metadata = { title: "About" };

const dataSources = [
  { name: "WDFW SPI Metrics",       route: "/api/wdfw",     origin: "data.wa.gov Socrata"             },
  { name: "USGS Stream Temperature", route: "/api/usgs",     origin: "waterservices.usgs.gov NWIS"     },
  { name: "WSDOT Fish Barriers",     route: "/api/barriers", origin: "data.wsdot.wa.gov ArcGIS"        },
  { name: "Aggregated Scrape",       route: "/api/scrape",   origin: "WDFW + NOAA + Puget Sound Partnership" },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        title="About This Project"
        subtitle="Puget Sound Salmon Health is a community learning tool connecting data and Indigenous knowledge."
      />

      <div className="mx-auto max-w-4xl space-y-10 px-4 py-12">
        {/* Tribal partnerships */}
        <section>
          <h2 className="text-xl font-bold text-primary">Tribal Partnerships</h2>
          <p className="mt-3 text-muted">
            Content on tribal Nation pages is authored and governed by each partner
            nation. Tribes retain the right to modify or remove their content at any
            time. This site follows tribal data sovereignty principles — no tribal
            knowledge is published without explicit partner approval.
          </p>
        </section>

        {/* Data sources */}
        <section>
          <h2 className="text-xl font-bold text-primary">Data Sources</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-surface text-left">
                <tr>
                  <th className="px-3 py-2 font-semibold">Dataset</th>
                  <th className="px-3 py-2 font-semibold">API Route</th>
                  <th className="px-3 py-2 font-semibold">Origin</th>
                </tr>
              </thead>
              <tbody>
                {dataSources.map(({ name, route, origin }) => (
                  <tr key={route} className="border-t border-surface">
                    <td className="px-3 py-2">{name}</td>
                    <td className="px-3 py-2 font-mono text-xs">{route}</td>
                    <td className="px-3 py-2 text-muted">{origin}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-sm text-muted">
            All external API calls are proxied server-side through Next.js API routes
            with a 15-minute ISR cache. Raw external URLs are never exposed to clients.
          </p>
        </section>

        {/* Accessibility */}
        <section>
          <h2 className="text-xl font-bold text-primary">Accessibility</h2>
          <p className="mt-3 text-muted">
            This site targets WCAG 2.1 AA. All status indicators pair color with text
            labels. Charts include text-based data summaries. To report an accessibility
            issue, please open a GitHub issue.
          </p>
        </section>
      </div>
    </>
  );
}
