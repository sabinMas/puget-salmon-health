import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard',
  description:
    'Interactive Puget Sound salmon health dashboard — real-time stream temperatures, annual return counts, and watershed trends from WDFW and USGS.',
  openGraph: {
    title: 'Dashboard | Puget Sound Salmon Health',
    description:
      'Explore salmon populations, stream temperatures, and watershed health across Puget Sound using real data from WDFW and USGS.',
    url: '/dashboard',
  },
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
