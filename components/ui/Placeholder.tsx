interface PlaceholderProps {
  /** The tribe, organization, or stakeholder responsible for this content */
  owner: string;
  /** What kind of content belongs here */
  section: string;
}

export default function Placeholder({ owner, section }: PlaceholderProps) {
  return (
    <div
      className="rounded border border-dashed border-warning bg-surface px-4 py-3 text-sm italic text-muted"
      aria-label={`Placeholder: awaiting content from ${owner}`}
    >
      [Awaiting content from{" "}
      <strong className="font-semibold not-italic">{owner}</strong>: {section}]
    </div>
  );
}
