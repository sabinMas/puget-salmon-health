'use client';

import Link from 'next/link';
import { InfoTooltip } from "@/components/ui/InfoTooltip";

interface SalmonMetricCardProps {
  label: string;
  value: string | number;
  unit?: string;
  trend?: 'up' | 'down' | 'stable';
  tooltipText?: string;
  href?: string;
}


export function SalmonMetricCard({
  label,
  value,
  unit,
  trend,
  tooltipText,
  href,
}: SalmonMetricCardProps) {
  const trendIcon = {
    up: '↑',
    down: '↓',
    stable: '→',
  }[trend || 'stable'];

  const trendColor = {
    up: 'text-success',
    down: 'text-danger',
    stable: 'text-muted',
  }[trend || 'stable'];

  const content = (
    <div className="bg-surface border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
    <div className="flex justify-between items-start mb-2">
      <h3 className="text-sm font-medium text-muted">{label}</h3>
        {tooltipText && <InfoTooltip content={tooltipText} />}
    </div>



      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-bold text-primary">{value}</span>
        {unit && <span className="text-lg text-muted">{unit}</span>}
      </div>
      {trend && (
        <div className={`flex items-center gap-1 mt-2 ${trendColor}`}>
          <span className="text-xl" aria-label={`Trend: ${trend}`}>
            {trendIcon}
          </span>
          <span className="text-sm capitalize">{trend}</span>
        </div>
      )}
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}