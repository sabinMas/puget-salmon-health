import { PageHeader } from '@/components/ui/PageHeader';
import { TribalPartnerCard } from '@/components/nations/TribalPartnerCard';
import { getTribes } from '@/lib/data/tribes';

export default async function NationsPage() {
  const tribes = await getTribes();

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <PageHeader
          title="The Nations of Puget Sound"
          description="Salmon recovery is guided by the knowledge and leadership of the tribes who have cared for these waters and fish since time immemorial. The content in this section is authored and governed by each tribal partner."
        />

        {/* Partnership Statement */}
        <div className="bg-surface border-l-4 border-secondary p-8 rounded-r-lg mb-12">
          <h2 className="text-xl font-bold mb-4 text-primary">Our Partnership Model</h2>
          <div className="space-y-3 text-gray-700 leading-relaxed">
            <p>
              This dashboard is built in partnership with the Native Nations of Puget Sound, who
              are the original stewards of these waters and salmon populations.
            </p>
            <p>
              <strong>Content governance:</strong> Each tribal nation controls the content on
              their page. They decide what to share, how to share it, and can modify or remove
              content at any time.
            </p>
            <p>
              <strong>Data sovereignty:</strong> Tribal nations retain ownership of their
              traditional knowledge and data. Not all knowledge is meant to be public, and we
              respect that.
            </p>
            <p>
              <strong>Co-management:</strong> Tribal nations and state agencies co-manage salmon
              populations under treaty rights affirmed by the Boldt Decision (1974).
            </p>
          </div>
        </div>

        {/* Nations Grid */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-primary">Partner Nations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tribes.map((tribe) => (
              <TribalPartnerCard key={tribe.id} tribe={tribe} />
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-primary to-accent text-white rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">Interested in Partnering?</h3>
          <p className="mb-6 text-lg">
            If your tribal nation would like to be featured on this dashboard, we&apos;d be honored to
            work with you.
          </p>
          <a
            href="mailto:partnerships@pugetsalmonhealth.org"
            className="inline-block bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Contact Us
          </a>
        </div>
      </div>
    </div>
  );
}
