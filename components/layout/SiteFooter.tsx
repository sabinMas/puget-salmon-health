export default function SiteFooter() {
  return (
    <footer className="border-t border-surface bg-surface px-4 py-8 text-center text-sm text-muted">
      <p className="font-medium text-text">Puget Sound Salmon Health</p>
      <p className="mt-1">
        Salmon data sourced from{" "}
        <abbr title="Washington Department of Fish and Wildlife">WDFW</abbr>,{" "}
        <abbr title="United States Geological Survey">USGS</abbr>, and{" "}
        <abbr title="Washington State Department of Transportation">WSDOT</abbr>.
        Tribal content is authored and governed by partner nations.
      </p>
      <p className="mt-3 italic">
        This site acknowledges that Puget Sound is the ancestral homeland of the
        Coast Salish peoples, whose relationship with salmon predates written
        history and continues today.
      </p>
    </footer>
  );
}
