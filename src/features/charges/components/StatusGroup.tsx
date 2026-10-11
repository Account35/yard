import { Link } from "@tanstack/react-router";

import { ListRow } from "@/components/ui/ListRow";
import { StatusTag } from "@/components/ui/StatusTag";
import type { TenantStatusGroup } from "@/features/charges/balance";
import { formatShortDate } from "@/lib/dates";
import { formatMoney } from "@/lib/money";
import { paths } from "@/router/paths";

interface StatusGroupProps {
  group: TenantStatusGroup;
  currentPeriodCharges: Map<string, number>;
}

function summary(
  status: TenantStatusGroup["status"],
  tenant: TenantStatusGroup["tenants"][number],
  periodChargeCents: number,
): string {
  if (status === "late") {
    const amount =
      tenant.paidThisMonthCents > 0
        ? `Paid ${formatMoney(tenant.paidThisMonthCents)} of ${formatMoney(periodChargeCents)}, `
        : `Owes ${formatMoney(tenant.overdueCents)}, `;
    return `${amount}${tenant.daysLate} days late`;
  }
  if (status === "part_paid") {
    return `Paid ${formatMoney(tenant.paidThisMonthCents)} of ${formatMoney(periodChargeCents)}`;
  }
  if (status === "not_due") {
    const due = tenant.oldestUnpaidDueDate ? formatShortDate(tenant.oldestUnpaidDueDate) : "later";
    return `Owes ${formatMoney(tenant.balanceCents)}, due ${due}`;
  }
  return tenant.balanceCents < 0 ? `Credit ${formatMoney(Math.abs(tenant.balanceCents))}` : "Paid";
}

function title(status: TenantStatusGroup["status"]): string {
  switch (status) {
    case "late":
      return "Late";
    case "part_paid":
      return "Part paid";
    case "not_due":
      return "Not due";
    case "paid":
      return "Paid";
  }
}

export function StatusGroup({ group, currentPeriodCharges }: StatusGroupProps) {
  return (
    <section className="mb-5">
      <h2 className="mb-1 text-body font-semibold text-ink">
        {title(group.status)} ({group.tenants.length})
      </h2>
      <ul className="divide-y divide-line border-y border-line">
        {group.tenants.map((tenant) => (
          <li key={tenant.tenantId}>
            <Link to={paths.tenantDetail.replace("$tenantId", tenant.tenantId)} className="block">
              <ListRow
                primary={`${tenant.name} · ${tenant.roomName}`}
                secondary={summary(
                  group.status,
                  tenant,
                  currentPeriodCharges.get(tenant.tenantId) ??
                    tenant.balanceCents + tenant.paidThisMonthCents,
                )}
                trailing={<StatusTag variant={group.status} status={group.status} />}
                chevron
              />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
