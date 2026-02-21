import { PageHeader } from '@/components/ui/PageHeader';
import Link from 'next/link';

export default function SalmonLifeCyclePage() {
  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Module Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-sm bg-gray-200 px-3 py-1 rounded">15 minutes</span>
            <span className="text-sm bg-primary text-white px-3 py-1 rounded">
              Grades 5-8
            </span>
          </div>
          <PageHeader
            title="Salmon Life Cycle"
            description="Follow a salmon's incredible journey from a tiny egg in a stream to the vast ocean and back home to spawn."
          />
        </div>

        {/* Content Body */}
        <div className="prose max-w-none mb-12">
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-primary mb-4">The Journey Begins: Eggs in Gravel</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              A salmon's life starts in the cold, clean gravel of a stream. Female salmon dig nests
              called <strong>redds</strong> in the streambed using their tails. They lay thousands of
              tiny orange eggs, which the male fertilizes. The parents then cover the eggs with
              gravel to protect them from predators and strong currents.
            </p>
            <div className="bg-blue-50 border-l-4 border-primary p-4 rounded-r-lg">
              <p className="text-sm text-gray-800">
                <strong>💡 Did you know?</strong> A single female Chinook salmon can lay 3,000-14,000
                eggs, but only about 1-2% will survive to return as adults.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-primary mb-4">Alevin: Living Off the Yolk Sac</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              After 6-20 weeks (depending on water temperature), the eggs hatch into{' '}
              <strong>alevin</strong> — tiny fish with a large yolk sac attached to their belly. The
              alevin stay hidden in the gravel, living off the nutrients in their yolk sac. They
              don't need to find food yet; everything they need is attached to them!
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-primary mb-4">Fry: First Swim</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Once the yolk sac is absorbed, the young salmon emerge from the gravel as{' '}
              <strong>fry</strong>. Now they must find their own food — mostly tiny insects and
              plankton. This is a dangerous time: predators like birds, larger fish, and even other
              salmon are hunting for an easy meal.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Fry need cold, clean water with plenty of places to hide (like overhanging plants,
              logs, and rocks). This is why protecting <strong>riparian habitat</strong> — the
              vegetation along streams — is so important for salmon.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-primary mb-4">
              Parr and Smolt: Preparing for the Ocean
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              As fry grow, they develop dark vertical bars on their sides and are called{' '}
              <strong>parr</strong>. These camouflage markings help them blend into the stream bottom.
              Parr spend anywhere from a few months to over a year in freshwater, depending on the
              species.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              When it's time to migrate to the ocean, amazing changes happen. The parr transform into
              <strong> smolt</strong> — their bodies become silvery, their scales toughen, and their
              internal chemistry changes to prepare for saltwater. This process is called{' '}
              <strong>smoltification</strong>.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-primary mb-4">Ocean Years: Growing Strong</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Smolt swim downstream to estuaries (where rivers meet the ocean) and then out to sea.
              In the vast Pacific Ocean, salmon spend 1-5 years feeding and growing. They eat krill,
              small fish, and squid, traveling thousands of miles.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Ocean conditions are critical. Warm water years, changes in food availability, and
              predators all affect how many salmon survive to return home.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-primary mb-4">
              The Journey Home: Spawning Run
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              When adult salmon are ready to spawn, they navigate back to the exact stream where they
              were born — sometimes traveling hundreds of miles upstream! Scientists believe salmon use
              a combination of the sun, Earth's magnetic field, and their sense of smell to find their
              way home.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              The journey upstream is exhausting. Salmon stop eating once they enter freshwater and
              live off stored body fat. They swim against strong currents, leap over waterfalls, and
              navigate around obstacles (or get blocked by dams and culverts that humans have built).
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-primary mb-4">Spawning and the End of Life</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              When salmon reach their home stream, they spawn — laying and fertilizing eggs just as
              their parents did. Most Pacific salmon (including all five species in Puget Sound) die
              shortly after spawning. Their bodies become food for other animals and fertilizer for the
              stream and forest.
            </p>
            <div className="bg-green-50 border-l-4 border-success p-4 rounded-r-lg">
              <p className="text-sm text-gray-800">
                <strong>🌲 Ecosystem connection:</strong> Scientists have found that trees growing near
                salmon streams get 20-25% of their nitrogen from decomposing salmon! Salmon literally
                feed the forest.
              </p>
            </div>
          </section>
        </div>

        {/* Key Takeaways */}
        <div className="bg-accent text-white rounded-lg p-8 mb-8">
          <h3 className="text-2xl font-bold mb-4">Key Takeaways</h3>
          <ul className="space-y-2 list-disc list-inside">
            <li>Salmon go through six distinct life stages: egg, alevin, fry, parr, smolt, and adult</li>
            <li>
              They are <strong>anadromous</strong> — born in freshwater, live in the ocean, return to
              freshwater to spawn
            </li>
            <li>
              Only 1-2% of salmon eggs survive to return as adults due to predators, habitat loss,
              climate change, and other challenges
            </li>
            <li>
              Salmon need cold, clean water at every life stage — from streams to estuaries to the
              ocean
            </li>
            <li>
              Salmon bring ocean nutrients back to streams and forests, supporting entire ecosystems
            </li>
          </ul>
        </div>

        {/* For Educators */}
        <details className="bg-surface border border-gray-200 rounded-lg p-6 mb-8">
          <summary className="cursor-pointer font-semibold text-lg text-primary hover:underline">
            For Educators: Discussion Questions & Activities
          </summary>
          <div className="mt-4 space-y-6">
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Discussion Questions</h4>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 text-sm">
                <li>Why do you think salmon need to return to the exact stream where they were born?</li>
                <li>
                  At which life stage do you think salmon are most vulnerable? What threatens them at
                  that stage?
                </li>
                <li>
                  How does the salmon life cycle connect streams, rivers, estuaries, the ocean, and
                  forests?
                </li>
                <li>
                  If only 1-2% of salmon survive, why is it important to protect every habitat along
                  their journey?
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Activity Ideas</h4>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 text-sm">
                <li>
                  <strong>Life Cycle Diagram:</strong> Have students draw and label the six salmon life
                  stages, including where each stage occurs (stream, estuary, ocean)
                </li>
                <li>
                  <strong>Obstacle Course:</strong> Create a physical obstacle course representing a
                  salmon's journey upstream. Discuss what real-world obstacles salmon face (dams,
                  culverts, warm water, predators)
                </li>
                <li>
                  <strong>Data Connection:</strong> Use the{' '}
                  <Link href="/dashboard" className="text-primary underline">
                    Dashboard
                  </Link>{' '}
                  to see actual salmon return numbers for a local watershed. How have populations changed
                  over time?
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Standards Alignment</h4>
              <p className="text-gray-700 text-sm">
                <strong>NGSS:</strong> MS-LS1-4 (reproduction and life cycles), MS-LS2-4 (ecosystem
                dynamics)
                <br />
                <strong>CCSS ELA:</strong> RST.6-8.4 (domain-specific vocabulary)
              </p>
            </div>
          </div>
        </details>

        {/* Connections */}
        <div className="bg-primary text-white rounded-lg p-6">
          <h3 className="text-xl font-bold mb-4">Continue Learning</h3>
          <div className="space-y-3">
            <div>
              <Link href="/dashboard" className="underline hover:text-gray-200">
                📈 Explore the Dashboard
              </Link>
              <p className="text-sm mt-1">
                See real population data for salmon in Puget Sound watersheds
              </p>
            </div>
            <div>
              <Link href="/learn/why-salmon-matter" className="underline hover:text-gray-200">
                🌊 Why Salmon Matter
              </Link>
              <p className="text-sm mt-1">
                Learn about salmon's ecological, cultural, and economic importance
              </p>
            </div>
            <div>
              <Link href="/nations" className="underline hover:text-gray-200">
                🤝 Meet the Nations
              </Link>
              <p className="text-sm mt-1">
                Hear from tribal nations about their relationship with salmon
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
