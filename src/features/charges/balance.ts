import { formatMonthLabel } from "@/lib/dates";
import type { Charge, Payment, RentStatus, StatementLine, TenantBalance } from "@/types/domain";

export interface TenantStatusItem {
  tenantId: string;
  name: string;
  roomName: string;
  balanceCents: number;
  paidCents: number;
  overdueCents: number;
  paidThisMonthCents: number;
  oldestUnpaidDueDate: string | null;
  status: RentStatus;
  daysLate: number;
}

export interface TenantStatusGroup {
  status: RentStatus;
  tenants: TenantStatusItem[];
}

export function deriveStatus(
  balance: Pick<TenantBalance, "balanceCents" | "overdueCents" | "paidThisMonthCents">,
): RentStatus {
  if (balance.balanceCents <= 0) return "paid";
  if (balance.overdueCents > 0) return "late";
  if (balance.paidThisMonthCents > 0) return "part_paid";
  return "not_due";
}

export function daysLate(oldestUnpaidDueDate: string | null, today: string): number {
  if (!oldestUnpaidDueDate || oldestUnpaidDueDate >= today) return 0;
  const due = Date.parse(`${oldestUnpaidDueDate}T00:00:00Z`);
  const now = Date.parse(`${today}T00:00:00Z`);
  if (!Number.isFinite(due) || !Number.isFinite(now)) return 0;
  return Math.floor((now - due) / 86_400_000);
}

export function buildStatement(charges: Charge[], payments: Payment[]): StatementLine[] {
  const entries: Array<
    | { kind: "charge"; date: string; charge: Charge }
    | { kind: "payment"; date: string; payment: Payment }
  > = [
    ...charges.map((charge) => ({ kind: "charge" as const, date: charge.due_date, charge })),
    ...payments
      .filter((payment) => payment.status !== "declined")
      .map((payment) => ({ kind: "payment" as const, date: payment.paid_on, payment })),
  ];
  entries.sort((left, right) => {
    const dateOrder = left.date.localeCompare(right.date);
    if (dateOrder !== 0) return dateOrder;
    if (left.kind !== right.kind) return left.kind === "charge" ? -1 : 1;
    const leftId = left.kind === "charge" ? left.charge.id : left.payment.id;
    const rightId = right.kind === "charge" ? right.charge.id : right.payment.id;
    return leftId.localeCompare(rightId);
  });

  let runningBalanceCents = 0;
  const lines: StatementLine[] = entries.map((entry) => {
    if (entry.kind === "charge") {
      runningBalanceCents += entry.charge.amount_cents;
      return {
        id: entry.charge.id,
        kind: "charge",
        date: entry.charge.due_date,
        description:
          entry.charge.type === "rent"
            ? `Rent, ${formatMonthLabel(entry.charge.period)}`
            : `${entry.charge.type[0]?.toUpperCase() ?? ""}${entry.charge.type.slice(1)}, ${formatMonthLabel(entry.charge.period)}`,
        note: entry.charge.note,
        amountCents: entry.charge.amount_cents,
        runningBalanceCents,
        isPending: false,
      };
    }

    const isPending = entry.payment.status === "pending_confirmation";
    if (!isPending) runningBalanceCents -= entry.payment.amount_cents;
    return {
      id: entry.payment.id,
      kind: "payment",
      date: entry.payment.paid_on,
      description: `Payment, ${entry.payment.method}`,
      note: null,
      amountCents: -entry.payment.amount_cents,
      runningBalanceCents,
      isPending,
    };
  });

  return lines.reverse();
}

export interface MonthSummary {
  collectedCents: number;
  expectedCents: number;
  outstandingCents: number;
}

export function summariseMonth(
  period: string,
  charges: Charge[],
  payments: Payment[],
  currentTenantBalances: TenantBalance[],
): MonthSummary {
  const prefix = `${period}-`;
  return {
    collectedCents: payments
      .filter((payment) => payment.status === "confirmed" && payment.paid_on.startsWith(prefix))
      .reduce((total, payment) => total + payment.amount_cents, 0),
    expectedCents: charges
      .filter((charge) => charge.period === period)
      .reduce((total, charge) => total + charge.amount_cents, 0),
    outstandingCents: currentTenantBalances.reduce(
      (total, balance) => total + Math.max(0, balance.balanceCents),
      0,
    ),
  };
}

export function groupTenantsByStatus(tenants: TenantStatusItem[]): TenantStatusGroup[] {
  const order: RentStatus[] = ["late", "part_paid", "not_due", "paid"];
  return order.flatMap((status) => {
    const items = tenants.filter((tenant) => tenant.status === status);
    if (items.length === 0) return [];
    items.sort((left, right) =>
      status === "late"
        ? right.daysLate - left.daysLate || left.name.localeCompare(right.name)
        : left.name.localeCompare(right.name),
    );
    return [{ status, tenants: items }];
  });
}
