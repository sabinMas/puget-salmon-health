import type { PopulationStatus } from "@/types";

const config: Record<
  PopulationStatus,
  { label: string; bg: string; text: string; symbol: string }
> = {
  critical:   { label: "Critical",   bg: "bg-danger",   text: "text-white", symbol: "●" },
  endangered: { label: "Endangered", bg: "bg-warning",  text: "text-white", symbol: "●" },
  threatened: { label: "Threatened", bg: "bg-yellow-500", text: "text-white", symbol: "●" },
  stable:     { label: "Stable",     bg: "bg-success",  text: "text-white", symbol: "●" },
};

interface StatusBadgeProps {
  status: PopulationStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const { label, bg, text, symbol } = config[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${bg} ${text}`}
      role="img"
      aria-label={`Population status: ${label}`}
    >
      <span aria-hidden="true">{symbol}</span>
      {label}
    </span>
  );
}
