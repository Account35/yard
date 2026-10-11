import { useNavigate } from "@tanstack/react-router";

import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { MonthSummary } from "@/features/charges/components/MonthSummary";
import { StatusGroup } from "@/features/charges/components/StatusGroup";
import {
  daysLate,
  deriveStatus,
  groupTenantsByStatus,
  summariseMonth,
  type TenantStatusItem,
} from "@/features/charges/balance";
import { useMonthCharges, usePeriodPayments, useTenantBalances } from "@/features/charges/hooks";
import { useActiveRooms } from "@/features/rooms/hooks";
import { useCurrentTenants } from "@/features/tenants/hooks";
import { todayInSA, toPeriod } from "@/lib/dates";
import { paths } from "@/router/paths";

export default function Home() {
  const navigate = useNavigate();
  const period = toPeriod(todayInSA());
  const tenants = useCurrentTenants();
  const rooms = useActiveRooms();
  const balances = useTenantBalances();
  const charges = useMonthCharges(period);
  const payments = usePeriodPayments(period);
  const queries = [tenants, rooms, balances, charges, payments];

  if (queries.some((query) => query.isPending)) {
    return (
      <>
        <PageHeader title="Home" />
        <p className="py-6 text-body text-ink-muted">Loading</p>
      </>
    );
  }

  if (queries.some((query) => query.isError)) {
    return (
      <>
        <PageHeader title="Home" />
        <div className="space-y-4 py-6">
          <p className="text-body text-ink">Could not load your tenants. Check your connection.</p>
          <Button
            variant="secondary"
            onClick={() => void Promise.all(queries.map((query) => query.refetch()))}
          >
            Try again
          </Button>
        </div>
      </>
    );
  }

  const currentTenants = tenants.data ?? [];
  const currentRooms = new Map((rooms.data ?? []).map((room) => [room.id, room]));
  const tenantBalances = new Map(
    (balances.data ?? []).map((balance) => [balance.tenantId, balance]),
  );
  const currentBalanceRows = currentTenants.flatMap((tenant) => {
    const balance = tenantBalances.get(tenant.id);
    return balance ? [balance] : [];
  });
  const monthSummary = summariseMonth(
    period,
    charges.data ?? [],
    payments.data ?? [],
    currentBalanceRows,
  );
  const currentPeriodCharges = new Map<string, number>();
  for (const charge of charges.data ?? []) {
    currentPeriodCharges.set(
      charge.tenant_id,
      (currentPeriodCharges.get(charge.tenant_id) ?? 0) + charge.amount_cents,
    );
  }
  const today = todayInSA();
  const statusItems: TenantStatusItem[] = currentTenants.flatMap((tenant) => {
    const balance = tenantBalances.get(tenant.id);
    if (!balance) return [];
    const room = currentRooms.get(tenant.room_id);
    const status = deriveStatus(balance);
    return [
      {
        tenantId: tenant.id,
        name: tenant.name,
        roomName: room?.name ?? "Room unavailable",
        balanceCents: balance.balanceCents,
        paidCents: balance.paidCents,
        overdueCents: balance.overdueCents,
        paidThisMonthCents: balance.paidThisMonthCents,
        oldestUnpaidDueDate: balance.oldestUnpaidDueDate,
        status,
        daysLate: status === "late" ? daysLate(balance.oldestUnpaidDueDate, today) : 0,
      },
    ];
  });
  const groups = groupTenantsByStatus(statusItems);

  return (
    <>
      <PageHeader title="Home" />
      <MonthSummary
        period={period}
        collectedCents={monthSummary.collectedCents}
        expectedCents={monthSummary.expectedCents}
        outstandingCents={monthSummary.outstandingCents}
      />
      {currentTenants.length === 0 ? (
        <div className="space-y-4 py-6">
          <p className="text-body text-ink">No tenants yet. Add your first tenant.</p>
          <Button variant="secondary" onClick={() => void navigate({ to: paths.rooms })}>
            View rooms
          </Button>
        </div>
      ) : (
        groups.map((group) => (
          <StatusGroup
            key={group.status}
            group={group}
            currentPeriodCharges={currentPeriodCharges}
          />
        ))
      )}
    </>
  );
}
