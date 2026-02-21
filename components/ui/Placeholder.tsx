interface PlaceholderProps {
  owner: string;
  section: string;
}

export function Placeholder({ owner, section }: PlaceholderProps) {
  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 bg-gray-50 text-center">
      <p className="text-gray-600 mb-2">
        <strong>Content Pending:</strong> This section will be populated by {owner}.
      </p>
      <p className="text-sm text-gray-500">Section: {section}</p>
    </div>
  );
}
