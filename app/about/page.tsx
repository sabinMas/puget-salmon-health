import type { Metadata } from 'next';
import { PageHeader } from '@/components/ui/PageHeader';
import { ContactForm } from '@/components/ui/ContactForm';

export const metadata: Metadata = {
  title: 'About',
  description:
    'About the Puget Sound Salmon Health Dashboard — our mission, data sources, methodology, and accessibility commitment.',
  openGraph: {
    title: 'About | Puget Sound Salmon Health',
    description:
      'Learn about our mission, data sources (WDFW, USGS), and commitment to accessible salmon population data for Puget Sound.',
    url: '/about',
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <PageHeader
          title="About This Project"
          description="Understanding our mission, data sources, and commitment to accessibility."
        />

        {/* About Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-primary mb-4">Our Mission</h2>
          <div className="prose max-w-none text-gray-700 leading-relaxed space-y-4">
            <p>
              The Puget Sound Salmon Health Dashboard was created to make salmon population and
              watershed health data accessible to everyone — from curious neighbors to educators,
              scientists, and resource managers.
            </p>
            <p>
              Salmon recovery in Puget Sound is shaped by scientific monitoring data, the stewardship
              of the Native Nations who have managed these fisheries for thousands of years, and the
              coordinated work of government agencies, conservation organizations, and communities.
              This dashboard draws on the public data record and aims to present it clearly and in
              context.
            </p>
            <p>
              <strong>Our goals:</strong>
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide clear, visual answers to &quot;How are the salmon doing?&quot;</li>
              <li>Make complex environmental data understandable to all audiences</li>
              <li>Support educators teaching about salmon ecology and treaty rights</li>
              <li>Connect data to stewardship actions and recovery projects</li>
            </ul>
          </div>
        </section>

        {/* Data Sources & Methods */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-primary mb-4">Data Sources & Methods</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-3 py-2 sm:px-6 sm:py-3 text-left text-sm font-semibold text-gray-700">
                    Data Type
                  </th>
                  <th scope="col" className="px-3 py-2 sm:px-6 sm:py-3 text-left text-sm font-semibold text-gray-700">
                    Source
                  </th>
                  <th scope="col" className="px-3 py-2 sm:px-6 sm:py-3 text-left text-sm font-semibold text-gray-700">
                    Update Frequency
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-3 py-3 sm:px-6 sm:py-4 text-sm text-gray-700">Salmon Returns</td>
                  <td className="px-3 py-3 sm:px-6 sm:py-4 text-sm text-gray-700">
                    WDFW Salmonid Population Indicators (SPI) — data.wa.gov
                  </td>
                  <td className="px-3 py-3 sm:px-6 sm:py-4 text-sm text-gray-700">Annual (refresh with <code className="text-xs bg-gray-100 px-1 rounded">npm run data:refresh</code>)</td>
                </tr>
                <tr>
                  <td className="px-3 py-3 sm:px-6 sm:py-4 text-sm text-gray-700">Water Temperature</td>
                  <td className="px-3 py-3 sm:px-6 sm:py-4 text-sm text-gray-700">
                    USGS National Water Information System
                  </td>
                  <td className="px-3 py-3 sm:px-6 sm:py-4 text-sm text-gray-700">Real-time (15 min cache)</td>
                </tr>
                <tr>
                  <td className="px-3 py-3 sm:px-6 sm:py-4 text-sm text-gray-700">Streamflow</td>
                  <td className="px-3 py-3 sm:px-6 sm:py-4 text-sm text-gray-700">USGS NWIS (integration pending)</td>
                  <td className="px-3 py-3 sm:px-6 sm:py-4 text-sm text-gray-700">Synthetic historical series</td>
                </tr>
                <tr>
                  <td className="px-3 py-3 sm:px-6 sm:py-4 text-sm text-gray-700">Fish Passage Barriers</td>
                  <td className="px-3 py-3 sm:px-6 sm:py-4 text-sm text-gray-700">WSDOT Fish Passage API</td>
                  <td className="px-3 py-3 sm:px-6 sm:py-4 text-sm text-gray-700">Quarterly (15 min cache)</td>
                </tr>
                <tr>
                  <td className="px-3 py-3 sm:px-6 sm:py-4 text-sm text-gray-700">Watershed Boundaries</td>
                  <td className="px-3 py-3 sm:px-6 sm:py-4 text-sm text-gray-700">USGS Watershed Boundary Dataset</td>
                  <td className="px-3 py-3 sm:px-6 sm:py-4 text-sm text-gray-700">Static (1-year cache)</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-gray-800">
              <strong>Live data:</strong> Salmon return data (WDFW SPI) and current stream
              temperatures (USGS NWIS) are sourced from real APIs. Watershed health status
              indicators are derived from actual Chinook return trends in the WDFW dataset.
              Historical temperature and streamflow trend charts currently use synthetic placeholder
              series pending integration of USGS NWIS annual summary data.
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
              <li>Screen reader-friendly chart descriptions and accessible data tables behind every chart</li>
              <li>Color contrast ratios meeting AA standards</li>
              <li>Status indicators that don&apos;t rely solely on color (paired with text/icons)</li>
              <li>Skip-to-content links on every page</li>
            </ul>
            <p>
              <strong>Report an accessibility issue:</strong> Use the contact form below and mention
              &quot;accessibility&quot; in your subject line.
            </p>
          </div>
        </section>

        {/* Contact */}
        <section id="contact">
          <h2 className="text-2xl font-bold text-primary mb-2">Contact & Get Involved</h2>
          <p className="text-gray-600 text-sm mb-6">
            Questions about the data, feedback on the site, or ideas for new features? We&apos;d love
            to hear from you.
          </p>
          <div className="bg-white border border-gray-200 rounded-lg p-6 sm:p-8">
            <ContactForm />
          </div>
        </section>

      </div>
    </div>
  );
}
