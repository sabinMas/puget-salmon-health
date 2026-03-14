import type { Metadata } from 'next';
import { PageHeader } from '@/components/ui/PageHeader';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Reading the Dashboard | Learn | Puget Sound Salmon Health',
  description:
    'Learn how to interpret salmon population charts, understand recovery targets, and read environmental indicators on the Puget Sound Salmon Health Dashboard.',
};

export default function ReadingTheDashboardPage() {
  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Breadcrumb */}
        <nav className="mb-6 text-sm flex items-center gap-2" aria-label="Breadcrumb">
          <Link href="/learn" className="text-primary hover:underline">Learn</Link>
          <span className="text-gray-400">›</span>
          <span className="text-gray-700">Reading the Dashboard</span>
        </nav>

        {/* Module Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-sm bg-gray-200 px-3 py-1 rounded">10 minutes</span>
            <span className="text-sm bg-primary text-white px-3 py-1 rounded">All ages</span>
          </div>
          <PageHeader
            title="Reading the Dashboard"
            description="A plain-language guide to interpreting salmon population data, understanding what the numbers mean, and knowing when to be cautious about what the data can and cannot tell you."
          />
        </div>

        {/* Content */}
        <div className="prose max-w-none mb-12 space-y-10">

          {/* Section 1 */}
          <section>
            <h2 className="text-2xl font-bold text-primary mb-4">Where the Data Comes From</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              The Salmon Health Dashboard uses data from two main sources:
            </p>
            <div className="space-y-3 mb-4">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h3 className="font-bold text-gray-800 mb-1">Salmon Return Data — WDFW SPI Database</h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  The Washington Department of Fish and Wildlife maintains the{' '}
                  <strong>Salmonid Population Indicators (SPI) database</strong>, which tracks escapement
                  and abundance estimates for salmon populations across Washington state. &quot;Escapement&quot;
                  means the number of adult fish that escape the fishery and make it back to spawn.
                  Data is collected annually by WDFW biologists and tribal monitors using a combination
                  of snorkel surveys, weir counts, carcass surveys, and mark-recapture methods.
                </p>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h3 className="font-bold text-gray-800 mb-1">Stream Temperature — USGS NWIS</h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  The U.S. Geological Survey operates hundreds of stream gauges across Puget Sound
                  that record water temperature (and streamflow) every 15 minutes. The dashboard
                  pulls the most recent temperature reading from nearby stations for each watershed.
                  These are real-time measurements, not estimates.
                </p>
              </div>
            </div>
            <div className="bg-blue-50 border-l-4 border-primary p-4 rounded-r-lg">
              <p className="text-sm text-gray-800">
                <strong>How fresh is the data?</strong> Salmon return estimates are updated annually —
                typically after WDFW processes the previous year&apos;s survey data. Stream temperatures
                are refreshed every 15 minutes from live USGS gauges. The dashboard shows timestamps
                so you always know when data was last updated.
              </p>
            </div>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-2xl font-bold text-primary mb-4">Understanding Population Charts</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              The main chart on the dashboard shows <strong>annual salmon returns over time</strong> for
              a selected watershed and species. Here is how to read it:
            </p>
            <div className="space-y-4">
              {[
                {
                  term: 'Y-axis: Number of fish',
                  detail: 'The vertical axis shows the estimated number of adult fish returning to spawn in a given year. Higher is better. Note that the scale varies by watershed — a "good" year in a small watershed might be a fraction of a typical year in a large one like the Skagit.',
                },
                {
                  term: 'X-axis: Year',
                  detail: 'Each data point represents one complete return year. Salmon have multi-year ocean cycles, so natural variation between years is normal. A single bad year is not necessarily a crisis; a long downward trend is.',
                },
                {
                  term: 'Trend line',
                  detail: 'The shaded area or smoothed line shows the overall direction of the population. An upward trend over 10+ years is a positive signal. A downward trend of similar length is concerning even if individual years spike upward.',
                },
                {
                  term: 'Recovery target line (where shown)',
                  detail: 'Some charts include a horizontal line showing the recovery target established in the Puget Sound Chinook Salmon Recovery Plan. Current populations are typically well below this target — reaching it is the long-term goal of coordinated recovery efforts.',
                },
              ].map(({ term, detail }) => (
                <div key={term} className="flex gap-4 bg-white border border-gray-200 rounded-lg p-4">
                  <span className="shrink-0 text-2xl text-primary font-bold mt-0.5">›</span>
                  <div>
                    <p className="font-bold text-gray-800 mb-1">{term}</p>
                    <p className="text-sm text-gray-700 leading-relaxed">{detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-2xl font-bold text-primary mb-4">What the Status Colors Mean</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              The map and watershed selector use color-coded status indicators. These are based on
              population levels relative to long-term baselines — not a single year&apos;s data:
            </p>
            <div className="space-y-3">
              {[
                { color: 'bg-green-500', label: 'Healthy', desc: 'Population is at or near historical baseline and recovery targets. This is rare for Puget Sound Chinook.' },
                { color: 'bg-yellow-500', label: 'Caution', desc: 'Population is below historical baseline or showing a declining trend, but not in immediate crisis. Continued monitoring and habitat work is important.' },
                { color: 'bg-red-500', label: 'Concern', desc: 'Population is significantly below recovery targets or showing a steep multi-year decline. Urgent habitat and management action is needed.' },
              ].map(({ color, label, desc }) => (
                <div key={label} className="flex gap-4 items-start bg-gray-50 rounded-lg p-4">
                  <span className={`shrink-0 w-4 h-4 rounded-full ${color} mt-1`} aria-hidden="true" />
                  <div>
                    <p className="font-bold text-gray-800 mb-0.5">{label}</p>
                    <p className="text-sm text-gray-700">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-gray-700 leading-relaxed mt-4 text-sm">
              Status colors are always paired with text labels — they are never the only indicator.
              If you are using a screen reader or viewing the site in grayscale, every status is
              still clearly labeled.
            </p>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-2xl font-bold text-primary mb-4">Reading Environmental Indicators</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              The basin detail pages include environmental indicator charts alongside the salmon
              population data. These provide context for why salmon populations change:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                {
                  indicator: 'Water Temperature',
                  unit: '°C or °F',
                  good: 'Below 16°C (60°F)',
                  bad: 'Above 20°C (68°F)',
                  why: 'Salmon are cold-water fish. High temperatures reduce dissolved oxygen, increase disease susceptibility, and can be directly lethal to eggs and juveniles.',
                },
                {
                  indicator: 'Streamflow',
                  unit: 'cubic feet per second (cfs)',
                  good: 'Near or above historical median',
                  bad: 'Well below historical median, especially in summer',
                  why: 'Low flow concentrates fish in smaller areas, raises temperature, and can strand salmon on gravel bars. It also reduces the connectivity between spawning areas.',
                },
              ].map(({ indicator, unit, good, bad, why }) => (
                <div key={indicator} className="bg-white border border-gray-200 rounded-lg p-5">
                  <h3 className="font-bold text-primary mb-3">{indicator}</h3>
                  <p className="text-xs text-gray-500 mb-2">Unit: {unit}</p>
                  <div className="space-y-2 mb-3">
                    <p className="text-sm"><span className="text-green-700 font-medium">Good range:</span> {good}</p>
                    <p className="text-sm"><span className="text-red-700 font-medium">Concerning:</span> {bad}</p>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">{why}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
              <p className="text-sm text-gray-800">
                <strong>Data sources:</strong> Environmental indicator trend charts (annual temperature
                and stream discharge) use real data from the USGS NWIS Statistics Service — annual
                median values across active Puget Sound monitoring stations. Current temperature
                readings (shown as metric cards) are live real-time readings from the same USGS gauge network.
              </p>
            </div>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-2xl font-bold text-primary mb-4">What the Data Cannot Tell You</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Understanding data limitations is as important as understanding what the data shows.
              Be cautious about the following:
            </p>
            <ul className="space-y-3">
              {[
                {
                  caution: 'One year does not make a trend',
                  detail: 'A single year with unusually high returns (often driven by favorable ocean conditions) does not mean a population has recovered. Look at 10+ year patterns.',
                },
                {
                  caution: 'Survey methods vary by watershed',
                  detail: 'Some populations are counted with high precision (weirs, PIT tags). Others rely on visual surveys with higher uncertainty. Confidence intervals are noted in the WDFW source data but not always visible on dashboard charts.',
                },
                {
                  caution: 'Watersheds are not independent',
                  detail: 'Ocean conditions, climate patterns, and policy decisions affect multiple watersheds simultaneously. A bad year for one watershed often correlates with bad years for others.',
                },
                {
                  caution: 'The dashboard shows escapement, not total run size',
                  detail: 'Escapement (fish that return to spawn after the fishery) is what is measured. Total run size — including fish caught — is larger. Neither number fully captures juvenile survival or ocean survival, which are key to understanding long-term trends.',
                },
              ].map(({ caution, detail }) => (
                <li key={caution} className="flex gap-3 list-none bg-red-50 border border-red-100 rounded-lg p-4">
                  <span className="shrink-0 text-red-500 font-bold mt-0.5">!</span>
                  <div>
                    <p className="font-bold text-gray-800 text-sm mb-1">{caution}</p>
                    <p className="text-sm text-gray-700">{detail}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="text-2xl font-bold text-primary mb-4">How to Use the Dashboard Effectively</h2>
            <ol className="list-decimal pl-6 space-y-3 text-gray-700">
              <li>
                <strong>Start with the map.</strong> Select a watershed you care about — either by clicking
                the map polygon or using the dropdown selector.
              </li>
              <li>
                <strong>Look at the trend, not just the latest year.</strong> The 10–20 year trend line
                tells you far more than a single data point.
              </li>
              <li>
                <strong>Compare watersheds.</strong> Switch between basins to see which systems are
                healthier and why — look for patterns in geography, land use, and stewardship activity.
              </li>
              <li>
                <strong>Check the data sources.</strong> Every chart on the dashboard shows its source
                and data vintage. The expandable &quot;Data Sources&quot; section at the bottom of the
                dashboard page lists all sources and caveats.
              </li>
              <li>
                <strong>Connect data to action.</strong> For each watershed, the basin detail page links
                to stewardship projects operating in that basin. Numbers only make sense in the context
                of what is being done about them.
              </li>
            </ol>
          </section>
        </div>

        {/* Key Takeaways */}
        <div className="bg-primary text-white rounded-lg p-8 mb-8">
          <h2 className="text-xl font-bold mb-4">Key Takeaways</h2>
          <ul className="space-y-3">
            {[
              'Salmon return data comes from WDFW\'s annual escapement surveys; stream temperatures come from live USGS gauges.',
              'Look at multi-year trends, not single years — natural variation is high.',
              'Status colors (green/yellow/red) are always paired with text labels and reflect long-term population trends.',
              'Environmental indicators like water temperature and streamflow provide context for why populations change.',
              'The dashboard shows escapement (spawning adults), which is one important metric — not a complete picture of population health.',
              'Good data use means knowing the limitations, not just reading the numbers.',
            ].map((point) => (
              <li key={point} className="flex gap-3">
                <span className="shrink-0 text-white/60 mt-1">›</span>
                <span className="text-sm leading-relaxed">{point}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* For Educators */}
        <details className="mb-8 border border-gray-200 rounded-lg">
          <summary className="px-6 py-4 font-bold text-primary cursor-pointer hover:bg-gray-50 rounded-lg">
            For Educators — Discussion Questions & Activities
          </summary>
          <div className="px-6 pb-6 space-y-6">
            <div>
              <h3 className="font-bold text-gray-800 mb-3">Discussion Questions</h3>
              <ol className="list-decimal pl-6 space-y-2 text-sm text-gray-700">
                <li>Why is it misleading to judge a salmon population based on a single year&apos;s data? What would you need to see to conclude a population is recovering?</li>
                <li>Why do different watersheds have different data quality? What would affect how precisely we can count salmon in a given stream?</li>
                <li>If you were a salmon recovery manager, which environmental indicator would you prioritize — water temperature or streamflow? Why?</li>
                <li>The dashboard shows escapement (adult spawners), not total population size. What other measurements would give a more complete picture?</li>
              </ol>
            </div>
            <div>
              <h3 className="font-bold text-gray-800 mb-3">Activities</h3>
              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex gap-2">
                  <span className="shrink-0 text-primary">›</span>
                  <span>
                    <strong>Trend analysis:</strong> Have students open the{' '}
                    <Link href="/dashboard" className="text-primary underline">dashboard</Link>,
                    select three different watersheds, and write a 2–3 sentence interpretation of
                    each population trend. Then compare: which watershed looks healthiest? What questions
                    does the data raise?
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="shrink-0 text-primary">›</span>
                  <span>
                    <strong>Data source investigation:</strong> Visit the WDFW SPI database
                    or USGS NWIS directly. How does the raw data compare to what is shown on the
                    dashboard? What choices were made in transforming the raw data into the visualizations?
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="shrink-0 text-primary">›</span>
                  <span>
                    <strong>Uncertainty exercise:</strong> If a salmon count has a ±20% uncertainty,
                    draw the range of possible values for a given year on the chart. How does this
                    affect your interpretation of the trend?
                  </span>
                </li>
              </ul>
            </div>
            <div>
              <p className="text-xs text-gray-500">
                <strong>Standards alignment:</strong> NGSS Science and Engineering Practices (analyzing
                and interpreting data, using mathematics and computational thinking). CCSS Math MP.3
                (construct viable arguments). WA Data Literacy Standards.
              </p>
            </div>
          </div>
        </details>

        {/* Connections */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <Link href="/dashboard" className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all">
            <p className="font-bold text-primary mb-1 text-sm">Open the Dashboard →</p>
            <p className="text-xs text-gray-600">Try reading the data yourself using what you learned here</p>
          </Link>
          <Link href="/learn/salmon-life-cycle" className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all">
            <p className="font-bold text-primary mb-1 text-sm">Learn: Salmon Life Cycle →</p>
            <p className="text-xs text-gray-600">Understand what the fish go through before they become data points</p>
          </Link>
          <Link href="/about" className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all">
            <p className="font-bold text-primary mb-1 text-sm">About the Data →</p>
            <p className="text-xs text-gray-600">Full documentation of sources, methods, and known limitations</p>
          </Link>
        </div>

        {/* Footer nav */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <Link href="/learn" className="text-primary hover:underline text-sm">← Back to Learn</Link>
          <Link href="/dashboard" className="text-primary hover:underline text-sm">Open the Dashboard →</Link>
        </div>

      </div>
    </div>
  );
}
