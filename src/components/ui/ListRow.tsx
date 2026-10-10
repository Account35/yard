import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export interface ListRowProps {
  primary: ReactNode;
  secondary?: ReactNode;
  trailing?: ReactNode;
  chevron?: boolean;
  onClick?: () => void;
}

/** Place ListRows inside a <ul className="divide-y divide-line">. */
export function ListRow({ primary, secondary, trailing, chevron = false, onClick }: ListRowProps) {
  const content = (
    <>
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-body text-ink">{primary}</span>
        {secondary !== undefined && (
          <span className="truncate text-secondary text-ink-muted">{secondary}</span>
        )}
      </span>
      {trailing !== undefined && <span className="shrink-0 text-body">{trailing}</span>}
      {chevron && (
        <ChevronRight aria-hidden="true" className="size-5 shrink-0 text-ink-muted" strokeWidth={1.5} />
      )}
    </>
  );
  const base = "flex min-h-14 w-full items-center gap-3 py-2 text-left";

  return (
    <li className="list-none">
      {onClick ? (
        <button type="button" onClick={onClick} className={cn(base, "active:bg-line")}>
          {content}
        </button>
      ) : (
        <div className={base}>{content}</div>
      )}
    </li>
  );
}
