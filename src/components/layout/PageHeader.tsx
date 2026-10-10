import type { ReactNode } from "react";

export interface PageHeaderProps {
  title: string;
  action?: ReactNode;
}

export function PageHeader({ title, action }: PageHeaderProps) {
  return (
    <header className="flex min-h-14 items-center justify-between gap-4 pt-4 pb-2">
      <h1 className="text-title font-semibold text-ink">{title}</h1>
      {action}
    </header>
  );
}
