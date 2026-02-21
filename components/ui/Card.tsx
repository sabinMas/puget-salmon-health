import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export default function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`rounded-lg border border-surface bg-surface p-5 shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}
