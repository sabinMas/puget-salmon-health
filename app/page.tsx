import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Puget Sound Salmon Health",
};

const pillars = [
  {
    heading: "The Data",
    body: "Live population metrics, stream temperatures, and fish passage barriers across 8 Puget Sound watersheds — sourced from WDFW, USGS, and WSDOT.",
    cta: "Explore the Dashboard",
    href: "/dashboard",
  },
  {
    heading: "The Knowledge Holders",
    body: "The Native Nations of Puget Sound have stewarded these waters and salmon since time immemorial. Their leadership guides recovery today.",
    cta: "Meet the Nations",
    href: "/nations",
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-primary px-4 py-20 text-center text-white">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          How Are the Salmon?
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-white/80">
          Tracking Chinook salmon health across Puget Sound — informed by science
          and guided by the knowledge of the Native Nations who have stewarded
          these waters since time immemorial.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            href="/dashboard"
            className="rounded bg-secondary px-6 py-3 font-semibold text-white hover:opacity-90"
          >
            Explore the Dashboard
          </Link>
          <Link
            href="/nations"
            className="rounded border border-white px-6 py-3 font-semibold text-white hover:bg-white/10"
          >
            Meet the Nations
          </Link>
        </div>
      </section>

      {/* At-a-glance stats strip */}
      <section className="border-y border-primary/20 bg-primary/5 px-4 py-5">
        <dl className="mx-auto flex max-w-3xl flex-wrap justify-center gap-x-12 gap-y-4 text-center">
          {[
            { value: "8",  label: "watersheds monitored"     },
            { value: "9",  label: "tribal partner nations"   },
            { value: "5",  label: "active restoration projects" },
          ].map(({ value, label }) => (
            <div key={label}>
              <dt className="text-3xl font-bold text-primary">{value}</dt>
              <dd className="mt-0.5 text-sm text-muted">{label}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Two-pillar introduction */}
      <section className="mx-auto grid max-w-5xl gap-8 px-4 py-16 sm:grid-cols-2">
        {pillars.map(({ heading, body, cta, href }) => (
          <div
            key={href}
            className="rounded-lg border border-surface bg-surface p-6 shadow-sm"
          >
            <h2 className="text-xl font-bold text-primary">{heading}</h2>
            <p className="mt-3 text-muted">{body}</p>
            <Link
              href={href}
              className="mt-4 inline-block text-sm font-semibold text-secondary hover:underline"
            >
              {cta} →
            </Link>
          </div>
        ))}
      </section>

      {/* How to use */}
      <section className="bg-surface px-4 py-12 text-center">
        <h2 className="text-lg font-semibold text-primary">How to use this site</h2>
        <div className="mx-auto mt-6 grid max-w-3xl gap-6 sm:grid-cols-3">
          {[
            { label: "Check the Data", href: "/dashboard" },
            { label: "Learn the Story",  href: "/learn"     },
            { label: "Hear from Nations", href: "/nations"   },
          ].map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className="rounded bg-white px-4 py-4 text-sm font-medium text-primary shadow-sm hover:shadow-md"
            >
              {label}
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
