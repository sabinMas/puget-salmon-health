"use client";

import { useState, useEffect, useRef } from "react";

interface InfoTooltipProps {
  content: string;
  label?: string;
}

export default function InfoTooltip({
  content,
  label = "More information",
}: InfoTooltipProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const id = `tooltip-${label.toLowerCase().replace(/\s+/g, "-")}`;

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    function onMouseDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <div ref={ref} className="relative inline-block">
      <button
        type="button"
        aria-label={label}
        aria-describedby={open ? id : undefined}
        onClick={() => setOpen((o) => !o)}
        className="flex h-4 w-4 items-center justify-center rounded-full bg-muted text-[10px] font-bold leading-none text-white hover:bg-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        ?
      </button>

      {open && (
        <div
          id={id}
          role="tooltip"
          className="absolute bottom-full left-1/2 z-50 mb-2 w-56 -translate-x-1/2 rounded bg-text px-3 py-2 text-xs leading-snug text-white shadow-lg"
        >
          {content}
          {/* Downward arrow */}
          <span
            aria-hidden="true"
            className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-text"
          />
        </div>
      )}
    </div>
  );
}
