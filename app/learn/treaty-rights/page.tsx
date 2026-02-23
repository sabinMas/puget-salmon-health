import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHeader } from '@/components/ui/PageHeader';

export const metadata: Metadata = {
  title: 'Treaty Rights & Co-Management | Learn | Puget Sound Salmon Health',
  description:
    'The history of tribal salmon fishing rights — from the 1855 treaties to the Boldt Decision and co-management today.',
};

export default function TreatyRightsPage() {
  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Breadcrumb */}
        <nav className="mb-6 text-sm flex items-center gap-2" aria-label="Breadcrumb">
          <Link href="/learn" className="text-primary hover:underline">Learn</Link>
          <span className="text-gray-400">›</span>
          <span className="text-gray-700">Treaty Rights &amp; Co-Management</span>
        </nav>

        {/* Module Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-sm bg-gray-200 px-3 py-1 rounded">25 minutes</span>
            <span className="text-sm bg-primary text-white px-3 py-1 rounded">
              Grades 9–12 / Adult
            </span>
            <span className="text-sm bg-accent text-white px-3 py-1 rounded">
              Social Studies &amp; Civics
            </span>
          </div>
          <PageHeader
            title="Treaty Rights &amp; Co-Management"
            description="How the 1855 treaties, a landmark 1974 court decision, and tribal-state co-management shape salmon recovery in Puget Sound today."
          />
        </div>

        {/* Content */}
        <div className="space-y-10 mb-12">

          {/* Section 1 */}
          <section>
            <h2 className="text-2xl font-bold text-primary mb-4">The 1855 Treaties</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              In the mid-1850s, the United States government negotiated a series of treaties with
              the Native Nations of the Pacific Northwest. At councils in Medicine Creek (1854),
              Point Elliott, Point No Point, and Neah Bay (all 1855), tribal leaders ceded millions
              of acres of land to the United States. In return, they reserved specific rights —
              including the right to fish at their <strong>usual and accustomed grounds and
              stations</strong>.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              For the tribes, these were not concessions — they were explicit protections for a way
              of life built around salmon over thousands of years. The treaty language, negotiated
              partly in Chinook Jargon with U.S. government interpreters, stated that tribes would
              have the right to fish &quot;in common with all citizens of the Territory.&quot; Tribal leaders
              understood this to guarantee their fishing rights in perpetuity.
            </p>
            <div className="bg-blue-50 border-l-4 border-primary p-4 rounded-r-lg">
              <p className="text-sm text-gray-800">
                <strong>Key fact:</strong> The Medicine Creek Treaty of 1854 was signed by
                Governor Isaac Stevens on behalf of the U.S. and leaders of the Nisqually,
                Puyallup, Squaxin Island, and other tribes. Similar treaties followed across
                what is now Washington State.
              </p>
            </div>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-2xl font-bold text-primary mb-4">
              A Century of Broken Promises
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Despite the treaty guarantees, the state of Washington spent much of the late 19th
              and early 20th centuries restricting and criminalizing tribal fishing. State fish and
              wildlife officers arrested tribal fishers for practicing rights their ancestors had
              explicitly reserved. Courts sometimes sided with tribes, sometimes with the state —
              with no consistent interpretation of what &quot;in common with&quot; actually meant.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              By the 1960s, tribal frustration had reached a breaking point. Inspired by the civil
              rights movement, tribes on the Nisqually, Puyallup, and other rivers began staging
              <strong> fish-ins</strong> — deliberately fishing in defiance of state regulations to
              assert their treaty rights. Leaders like <strong>Billy Frank Jr.</strong> of the
              Nisqually Tribe were repeatedly arrested. Their arrests drew national attention and
              eventually forced the issue into federal court.
            </p>
            <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg">
              <p className="text-sm text-gray-800">
                <strong>Billy Frank Jr. (1931–2014):</strong> Arrested more than 50 times for
                fishing on the Nisqually River, Billy Frank Jr. became one of the most important
                environmental and Indigenous rights advocates in U.S. history. He later served
                as chairman of the Northwest Indian Fisheries Commission and received the
                Presidential Medal of Freedom in 2015, posthumously.
              </p>
            </div>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-2xl font-bold text-primary mb-4">
              United States v. Washington (1974) — The Boldt Decision
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              In 1970, the United States government — acting on behalf of the tribes — filed suit
              against the State of Washington in federal district court. Four years of proceedings
              followed. On February 12, 1974, Judge George Boldt issued his ruling in{' '}
              <em>United States v. Washington</em>.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              Judge Boldt&apos;s decision was sweeping. He ruled that the treaties did guarantee
              tribes the right to fish at their usual and accustomed grounds, and that &quot;in common
              with&quot; meant a <strong>50/50 split</strong> of the harvestable salmon between tribal
              and non-tribal fishers. He also ruled that tribes had the right to participate in
              managing the fisheries that the treaties protected — establishing tribes as
              <strong> co-managers</strong>, not just users.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              The State of Washington appealed immediately and vigorously. State fish and wildlife
              officers openly defied the ruling. The conflict went to the Ninth Circuit Court of
              Appeals and ultimately to the U.S. Supreme Court, which upheld Judge Boldt&apos;s
              decision in 1979.
            </p>
            <div className="bg-green-50 border-l-4 border-success p-4 rounded-r-lg">
              <p className="text-sm text-gray-800">
                <strong>Why it matters for salmon:</strong> By establishing tribes as co-managers,
                the Boldt Decision gave tribal nations legal standing to advocate not just for
                harvest rights, but for the habitat salmon need to survive. If the salmon runs
                collapse, the treaty rights mean nothing. Tribes thus have both the motive and
                the legal authority to push for habitat protection, dam removal, and climate
                adaptation — making them essential partners in recovery.
              </p>
            </div>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-2xl font-bold text-primary mb-4">Co-Management in Practice</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Today, tribal fisheries managers and the Washington Department of Fish and Wildlife
              (WDFW) engage in an ongoing co-management process that governs how Puget Sound salmon
              are harvested and protected. This process includes:
            </p>
            <ul className="list-none space-y-3 mb-4">
              {[
                {
                  label: 'Annual pre-season negotiations',
                  detail:
                    'Each spring, tribal and state biologists meet to review spawner survey data, set escapement goals (how many salmon must return to spawn), and agree on harvest limits for the coming season.',
                },
                {
                  label: 'Hatchery co-management',
                  detail:
                    'Many tribes operate their own hatcheries and contribute to jointly-managed hatchery programs. Tribes like Tulalip, Muckleshoot, and Nisqually run hatcheries on their watersheds, integrating traditional ecological knowledge with modern fisheries science.',
                },
                {
                  label: 'Spawner surveys',
                  detail:
                    'Tribal biologists conduct spawner surveys alongside state staff — wading streams to count returning salmon. This data feeds directly into harvest decisions and habitat prioritization.',
                },
                {
                  label: 'Habitat advocacy',
                  detail:
                    'Tribal nations use their co-manager status to formally comment on land-use decisions, water rights, and infrastructure projects that affect salmon habitat — from logging permits to highway culverts.',
                },
              ].map(({ label, detail }) => (
                <li key={label} className="flex gap-3">
                  <span className="shrink-0 mt-1 w-2 h-2 rounded-full bg-primary" />
                  <span className="text-gray-700 text-sm leading-relaxed">
                    <strong>{label}:</strong> {detail}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-2xl font-bold text-primary mb-4">
              The Living Agreement: Treaty Rights Today
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Treaty rights are not museum pieces. They are active, living legal protections that
              continue to shape policy today. In 2018, the U.S. Supreme Court upheld — in an
              equally divided decision — a Ninth Circuit ruling that the State of Washington must
              repair thousands of culverts under state roads that block salmon migration. The{' '}
              <em>Washington v. United States</em> (Culverts Case) decision is a direct extension
              of the treaty right to fish: if the state&apos;s own infrastructure blocks the salmon
              from reaching their spawning grounds, the treaty right is violated.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              The case has resulted in a multi-billion-dollar commitment to replace fish-blocking
              culverts across Washington State — one of the largest salmon habitat restoration
              efforts in the region&apos;s history, driven entirely by treaty law.
            </p>
            <p className="text-gray-700 leading-relaxed">
              The data you see on this dashboard — salmon return numbers, stream temperatures,
              habitat quality — exists partly because tribal co-managers pushed for the monitoring
              infrastructure to track it. The legal framework and the ecological science are
              inseparable.
            </p>
          </section>

        </div>

        {/* Key Takeaways */}
        <div className="bg-accent text-white rounded-lg p-8 mb-8">
          <h3 className="text-2xl font-bold mb-4">Key Takeaways</h3>
          <ul className="space-y-3 list-disc list-inside text-sm leading-relaxed">
            <li>
              Pacific Northwest tribes signed treaties in the 1850s preserving the right to fish
              at their usual and accustomed grounds — in exchange for ceding millions of acres
            </li>
            <li>
              For over a century, Washington State ignored and actively violated these treaty
              rights; tribes resisted through fish-ins and the courts
            </li>
            <li>
              The 1974 Boldt Decision affirmed tribal treaty fishing rights and established tribes
              as co-managers of salmon populations — entitled to 50% of harvestable fish
            </li>
            <li>
              Today, tribal nations and WDFW jointly set harvest limits, manage hatcheries,
              conduct spawner surveys, and advocate for habitat protection
            </li>
            <li>
              The 2018 Culverts Case shows treaty rights are still shaping policy — and still
              delivering real habitat benefits for salmon
            </li>
            <li>
              Tribal co-management is a model for how Indigenous legal rights and modern
              conservation science can reinforce each other
            </li>
          </ul>
        </div>

        {/* For Educators */}
        <details className="bg-surface border border-gray-200 rounded-lg p-6 mb-8">
          <summary className="cursor-pointer font-semibold text-lg text-primary hover:underline">
            For Educators: Discussion Questions &amp; Activities
          </summary>
          <div className="mt-4 space-y-6">
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Discussion Questions</h4>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 text-sm">
                <li>
                  What does it mean for a treaty to be a &quot;living document&quot;? How does the Boldt
                  Decision demonstrate this?
                </li>
                <li>
                  Why might the state of Washington have resisted the Boldt Decision for so long?
                  Whose interests were at stake?
                </li>
                <li>
                  How does the concept of co-management differ from one party simply being granted
                  permission by another? Why does the distinction matter?
                </li>
                <li>
                  The Culverts Case required the state to spend billions of dollars fixing road
                  infrastructure. Do you think this is a fair outcome? Who bears the cost, and
                  who benefits?
                </li>
                <li>
                  How do you think salmon recovery outcomes might differ if tribal nations were not
                  co-managers?
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Activity Ideas</h4>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 text-sm">
                <li>
                  <strong>Treaty Text Analysis:</strong> Read excerpts from the Medicine Creek or
                  Point Elliott treaties. What does &quot;usual and accustomed grounds&quot; mean? How
                  might tribal leaders and U.S. negotiators have understood these words differently?
                </li>
                <li>
                  <strong>Timeline:</strong> Create a timeline from 1854 to 2018 marking key events
                  — treaty signings, fish-ins, the Boldt Decision, the Culverts Case. What patterns
                  do you notice?
                </li>
                <li>
                  <strong>Stakeholder Simulation:</strong> Assign students roles as tribal fishers,
                  state fish and wildlife officers, commercial fishers, and a federal judge. Hold a
                  mock pre-season negotiation to set harvest limits for the coming year.
                </li>
                <li>
                  <strong>Data Connection:</strong> Use the{' '}
                  <Link href="/dashboard" className="text-primary underline">
                    Salmon Health Dashboard
                  </Link>{' '}
                  to examine returns in a watershed managed under co-management. How have populations
                  trended? What does the data suggest about the effectiveness of the co-management model?
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Standards Alignment</h4>
              <p className="text-gray-700 text-sm">
                <strong>CCSS Social Studies / History:</strong> WHST.9-10.2 (informational writing),
                RH.9-10.6 (point of view and purpose in historical texts)
                <br />
                <strong>C3 Framework:</strong> D2.His.5.9-12 (explain how and why perspectives
                of people have changed over time), D2.Civ.1.9-12 (civic processes)
                <br />
                <strong>Washington State EALRs:</strong> Social Studies 4.1 (understands and
                applies knowledge of the rule of law), 4.3 (understands civic participation)
              </p>
            </div>
          </div>
        </details>

        {/* Continue Learning */}
        <div className="bg-primary text-white rounded-lg p-6">
          <h3 className="text-xl font-bold mb-4">Continue Learning</h3>
          <div className="space-y-4">
            <div>
              <Link href="/stewardship" className="underline hover:text-gray-200 font-semibold">
                Stewardship Projects →
              </Link>
              <p className="text-sm mt-1 text-gray-200">
                See habitat restoration, monitoring, and hatchery projects active across Puget Sound
              </p>
            </div>
            <div>
              <Link href="/dashboard" className="underline hover:text-gray-200 font-semibold">
                Explore the Dashboard →
              </Link>
              <p className="text-sm mt-1 text-gray-200">
                See population data shaped by decades of co-management decisions
              </p>
            </div>
            <div>
              <Link href="/learn/salmon-life-cycle" className="underline hover:text-gray-200 font-semibold">
                Salmon Life Cycle →
              </Link>
              <p className="text-sm mt-1 text-gray-200">
                Understand the biology behind why habitat and harvest management matter so much
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
