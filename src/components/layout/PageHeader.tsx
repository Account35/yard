import { useNavigate } from "@tanstack/react-router";
import type { ReactNode } from "react";

export interface PageHeaderProps {
  title: string;
  action?: ReactNode;
  backTo?: string;
  backLabel?: string;
}

export function PageHeader({ title, action, backTo, backLabel = "Back" }: PageHeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="flex min-h-14 items-center justify-between gap-4 pt-4 pb-2">
      <div className="flex min-w-0 items-center gap-3">
        {backTo && (
          <button
            type="button"
            className="inline-flex min-h-11 items-center justify-center rounded-sm border border-line bg-ground px-3 text-secondary font-semibold text-ink active:bg-line"
            onClick={() => void navigate({ to: backTo })}
          >
            {backLabel}
          </button>
        )}
        <h1 className="truncate text-title font-semibold text-ink">{title}</h1>
      </div>
      {action}
    </header>
  );
}
