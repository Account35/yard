import { Link } from "@tanstack/react-router";

import { formatMoney } from "@/lib/money";
import { paths } from "@/router/paths";
import type { OutstandingRow } from "@/types/domain";

export function OutstandingList({ rows }: { rows: OutstandingRow[] }) {
  if (rows.length === 0) {
    return <p className="text-secondary text-ink-muted">No tenants have a positive balance.</p>;
  }
  return (
    <ul className="divide-y divide-line border-y border-line">
      {rows.map((row) => (
        <li key={row.tenantId}>
          <Link
            to={paths.tenantDetail.replace("$tenantId", row.tenantId)}
            className="flex min-h-14 items-center justify-between gap-3 py-2 text-ink underline"
          >
            <span className="min-w-0">
              <span className="block truncate">
                {row.tenantName} · {row.roomName}
              </span>
              <span className="block text-secondary text-ink-muted">
                {!row.isCurrent
                  ? "Moved out"
                  : row.daysLate !== null
                    ? `${row.daysLate} days late`
                    : ""}
              </span>
            </span>
            <span className="shrink-0 text-right money">{formatMoney(row.balanceCents)}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
