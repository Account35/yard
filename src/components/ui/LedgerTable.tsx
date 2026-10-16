import type { ReactNode, TdHTMLAttributes, ThHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export function LedgerTable({ children, caption }: { children: ReactNode; caption?: string }) {
  return (
    <div className="overflow-hidden rounded-md border border-line bg-surface">
      <table className="w-full border-collapse text-body">
        {caption && <caption className="sr-only">{caption}</caption>}
        {children}
      </table>
    </div>
  );
}

export function LedgerTh({ numeric, className, ...rest }: ThHTMLAttributes<HTMLTableCellElement> & { numeric?: boolean }) {
  return (
    <th
      scope="col"
      className={cn(
        "border-b border-line px-4 py-2 text-secondary font-normal text-ink-muted",
        numeric ? "text-right" : "text-left",
        className,
      )}
      {...rest}
    />
  );
}

export function LedgerTd({ numeric, className, ...rest }: TdHTMLAttributes<HTMLTableCellElement> & { numeric?: boolean }) {
  return (
    <td
      className={cn(
        "border-b border-line px-4 py-3 text-ink",
        numeric ? "money text-right whitespace-nowrap" : "text-left",
        className,
      )}
      {...rest}
    />
  );
}
