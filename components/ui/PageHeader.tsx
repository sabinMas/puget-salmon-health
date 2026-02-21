interface PageHeaderProps {
  title: string;
  subtitle?: string;
}

export default function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <div className="border-b border-surface bg-surface px-4 py-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-3xl font-bold text-primary">{title}</h1>
        {subtitle && (
          <p className="mt-2 text-base text-muted">{subtitle}</p>
        )}
      </div>
    </div>
  );
}
