import { Link } from "@tanstack/react-router";

import { formatShortDate } from "@/lib/dates";
import { formatMoney } from "@/lib/money";
import {
  PAYMENT_METHOD_LABELS,
  type PendingPaymentRow as PendingPaymentRowData,
} from "@/types/domain";
import { paths } from "@/router/paths";

export function PendingRow({ row }: { row: PendingPaymentRowData }) {
  return (
    <li>
      <Link
        to={paths.paymentDetail
          .replace("$tenantId", row.tenantId)
          .replace("$paymentId", row.paymentId)}
        className="block min-h-12 space-y-1 py-3 text-body text-ink underline"
      >
        <span className="block font-semibold">
          {row.tenantName} · {row.roomName}
        </span>
        <span className="block">
          {formatMoney(row.amountCents)} · paid {formatShortDate(row.paidOn)} ·{" "}
          {PAYMENT_METHOD_LABELS[row.method]}
        </span>
        {row.hasProof && <span className="block text-secondary">Proof attached</span>}
      </Link>
    </li>
  );
}
