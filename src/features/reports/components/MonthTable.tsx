import { Link } from "@tanstack/react-router";

import { formatMoney } from "@/lib/money";
import { formatMonthLabel } from "@/lib/dates";
import { paths } from "@/router/paths";
import type { MonthlyIncomeRow } from "@/types/domain";

export function MonthTable({ rows }: { rows: MonthlyIncomeRow[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-y border-line text-left text-body">
        <thead>
          <tr className="border-b border-line text-secondary text-ink-muted">
            <th scope="col" className="py-2 pr-2 font-medium">
              Month
            </th>
            <th scope="col" className="px-2 py-2 text-right font-medium">
              Charged
            </th>
            <th scope="col" className="py-2 pl-2 text-right font-medium">
              Received
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.month} className="border-b border-line last:border-b-0">
              <th scope="row" className="py-1 pr-2 font-normal">
                <Link
                  className="inline-flex min-h-11 items-center text-ink underline"
                  to={paths.incomeMonth.replace("$month", row.month)}
                >
                  {formatMonthLabel(row.month)}
                </Link>
              </th>
              <td className="px-2 py-1 text-right money text-ink">
                {formatMoney(row.chargedCents)}
              </td>
              <td className="py-1 pl-2 text-right money text-ink">
                {formatMoney(row.receivedCents)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
