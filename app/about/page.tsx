import { PageHeader } from '@/components/ui/PageHeader';

export default function AboutPage() {
  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <PageHeader
          title="About This Project"
          description="Understanding our mission, partnerships, data sources, and commitment to accessibility."
        />

        {/* About Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-primary mb-4">Our Mission</h2>
          <div className="prose max-w-none text-gray-700 leading-relaxed space-y-4">
            <p>
              The Puget Sound Salmon Health Dashboard was created to make salmon population and
              watershed health data accessible to everyone — from curious neighbors to educators,
              scientists, and tribal program managers.
            </p>
            <p>
              This project recognizes two equal sources of knowledge: scientific data from
              monitoring programs, and the traditional ecological knowledge of the Native Nations
              who have stewarded these waters and salmon since time immemorial.
            </p>
            <p>
              <strong>Our goals:</strong>
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide clear, visual answers to "How are the salmon doing?"</li>
              <li>
                Center the leadership and knowledge of Puget Sound tribal nations in salmon
                recovery
              </li>
              <li>Make complex environmental data understandable to all audiences</li>
              <li>Support educators teaching about salmon ecology and treaty rights</li>
              <li>Connect data to stewardship actions and recovery projects</li>
            </ul>
          </div>
        </section>

        {/* Tribal Partnerships */}
        <section className="mb-12 bg-surface border-l-4 border-secondary p-6 rounded-r-lg">
          <h2 className="text-2xl font-bold text-primary mb-4">Tribal Partnerships</h2>
          <div className="prose max-w-none text-gray-700 leading-relaxed space-y-4">
            <p>
              <strong>Content governance:</strong> Tribal nations control all content on their
              pages. They decide what to share, how to frame it, and can modify or remove content
              at any time. Content is reviewed and approved by tribal leadership before
              publication.
            </p>
            <p>
              <strong>Data sovereignty:</strong> Tribal data belongs to tribal nations. We do not
              display tribal-specific data without explicit permission. Traditional ecological
              knowledge is shared only at the discretion of each nation.
            </p>
            <p>
              <strong>Partnership process:</strong> We work directly with tribal natural resources
              departments to develop content, ensure accuracy, and respect cultural protocols. New
              partnerships are welcome — contact us to learn more.
            </p>
          </div>
        </section>

        {/* Data Sources & Methods */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-primary mb-4">Data Sources & Methods</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Data Type
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Source
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Update Frequency
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 text-sm text-gray-700">Salmon Returns</td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    WDFW Salmonid Population Indicators (SPI) Database
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">Annual</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm text-gray-700">Water Temperature</td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    USGS National Water Information System
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">Real-time (15 min)</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm text-gray-700">Streamflow</td>
                  <td className="px-6 py-4 text-sm text-gray-700">USGS NWIS</td>
                  <td className="px-6 py-4 text-sm text-gray-700">Real-time (15 min)</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm text-gray-700">Fish Passage Barriers</td>
                  <td className="px-6 py-4 text-sm text-gray-700">WSDOT Fish Passage API</td>
                  <td className="px-6 py-4 text-sm text-gray-700">Quarterly</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm text-gray-700">Watershed Boundaries</td>
                  <td className="px-6 py-4 text-sm text-gray-700">USGS Watershed Boundary Dataset</td>
                  <td className="px-6 py-4 text-sm text-gray-700">Static</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-gray-800">
              <strong>Current Status:</strong> This prototype displays mock data for demonstration
              purposes. Live API integration for salmon returns, water quality, and tribal project
              data is planned for Phase 2 (M5 milestone).
            </p>
          </div>

          <div className="mt-6 prose max-w-none text-gray-700 leading-relaxed">
            <p>
              <strong>Known Limitations:</strong>
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Salmon return estimates have varying levels of confidence depending on survey
                method and conditions
              </li>
              <li>Some watersheds have sparse historical data before 2010</li>
              <li>
                Environmental indicators (temperature, flow) are point measurements and may not
                represent entire watershed conditions
              </li>
              <li>Data updates occur on different schedules — check timestamps on each metric</li>
            </ul>
          </div>
        </section>

        {/* Accessibility Statement */}
        <section className="mb-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-primary mb-4">Accessibility Commitment</h2>
          <div className="prose max-w-none text-gray-700 leading-relaxed space-y-4">
            <p>
              We are committed to making this dashboard accessible to all users, including those
              using assistive technologies.
            </p>
            <p>
              <strong>Our standards:</strong> We aim to meet WCAG 2.1 Level AA accessibility
              guidelines.
            </p>
            <p>
              <strong>Accessibility features:</strong>
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Keyboard navigation for all interactive elements</li>
              <li>Screen reader-friendly chart descriptions and data summaries</li>
              <li>Color contrast ratios meeting AA standards</li>
              <li>Status indicators that don't rely solely on color (paired with text/icons)</li>
              <li>Skip-to-content links on every page</li>
            </ul>
            <p>
              <strong>Report an issue:</strong> If you encounter accessibility barriers, please
              contact us at{' '}
              <a href="mailto:accessibility@pugetsalmonhealth.org" className="text-primary underline">
                accessibility@pugetsalmonhealth.org
              </a>
            </p>
          </div>
        </section>

        {/* Contact */}
        <section className="bg-gradient-to-r from-primary to-accent text-white rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-4">Contact & Get Involved</h2>
          <div className="space-y-4">
            <p>
              <strong>For tribal partnerships:</strong>{' '}
              <a
                href="mailto:partnerships@pugetsalmonhealth.org"
                className="underline hover:text-gray-200"
              >
                partnerships@pugetsalmonhealth.org
              </a>
            </p>
            <p>
              <strong>For data questions:</strong>{' '}
              <a
                href="mailto:data@pugetsalmonhealth.org"
                className="underline hover:text-gray-200"
              >
                data@pugetsalmonhealth.org
              </a>
            </p>
            <p>
              <strong>For general inquiries:</strong>{' '}
              <a
                href="mailto:info@pugetsalmonhealth.org"
                className="underline hover:text-gray-200"
              >
                info@pugetsalmonhealth.org
              </a>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
