import { StatusTag } from "@/components/ui/StatusTag";
import type { RentStatus } from "@/types/domain";
import { formatMoney } from "@/lib/money";

interface BalanceBlockProps {
  balanceCents: number;
  status: RentStatus;
  daysLate: number;
}

export function BalanceBlock({ balanceCents, status, daysLate }: BalanceBlockProps) {
  const amount =
    balanceCents < 0
      ? `Credit ${formatMoney(Math.abs(balanceCents))}`
      : balanceCents === 0
        ? "Paid up"
        : `Owes ${formatMoney(balanceCents)}`;

  return (
    <section className="rounded-md border border-line bg-surface p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-secondary text-ink-muted">Balance</p>
          <p className="mt-1 text-title font-semibold text-ink">{amount}</p>
          {status === "late" && (
            <p className="mt-1 text-secondary text-ink">{daysLate} days late</p>
          )}
        </div>
        <StatusTag status={status} />
      </div>
    </section>
  );
}
