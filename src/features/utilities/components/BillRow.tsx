import { Link } from "@tanstack/react-router";

import { formatMonthLabel, formatShortDate } from "@/lib/dates";
import { formatMoney } from "@/lib/money";
import { paths } from "@/router/paths";
import { SPLIT_METHOD_LABELS, UTILITY_LABELS, type UtilityBill } from "@/types/domain";

function splitLabel(bill: UtilityBill): string {
  if (bill.split_method !== "equal") return SPLIT_METHOD_LABELS[bill.split_method];
  const roomCount = bill.shares.length;
  return `Split equally between ${roomCount} ${roomCount === 1 ? "room" : "rooms"}${
    bill.includes_main_house ? " and the main house" : ""
  }`;
}

export function BillRow({ bill }: { bill: UtilityBill }) {
  return (
    <li>
      <Link
        to={paths.utilityDetail.replace("$billId", bill.id)}
        className="block min-h-12 space-y-1 py-3 text-body text-ink"
      >
        <span className="flex items-start justify-between gap-3">
          <span className="font-semibold underline">
            {UTILITY_LABELS[bill.type]}, {formatMonthLabel(bill.period)}
          </span>
          <span className="shrink-0 money">{formatMoney(bill.total_cents)}</span>
        </span>
        <span className="flex justify-between gap-3 text-secondary text-ink-muted">
          <span>{splitLabel(bill)}</span>
          {bill.voided_at && <span>Undone</span>}
          {!bill.voided_at && <span>Added {formatShortDate(bill.created_at.slice(0, 10))}</span>}
        </span>
      </Link>
    </li>
  );
}
