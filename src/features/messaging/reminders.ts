import { daysLate as countDaysLate } from "@/features/charges/balance";
import { todayInSA } from "@/lib/dates";
import type { MessageLogEntry, Room, Tenant, TenantBalance } from "@/types/domain";

export interface ReminderCandidate {
  tenant: Tenant;
  room: Room;
  balance: TenantBalance;
  daysLate: number;
  lastReminderAt: string | null;
}

export function latestMessageByTenantKind(
  entries: MessageLogEntry[],
): Map<string, MessageLogEntry> {
  const latest = new Map<string, MessageLogEntry>();
  for (const entry of entries) {
    const key = `${entry.tenant_id}:${entry.kind}`;
    const existing = latest.get(key);
    if (!existing || entry.created_at > existing.created_at) latest.set(key, entry);
  }
  return latest;
}

export function buildReminderCandidates(
  tenants: Tenant[],
  rooms: Room[],
  balances: TenantBalance[],
  entries: MessageLogEntry[],
  today: string,
): ReminderCandidate[] {
  const roomById = new Map(rooms.map((room) => [room.id, room]));
  const balanceByTenant = new Map(balances.map((balance) => [balance.tenantId, balance]));
  const latestReminders = latestMessageByTenantKind(entries);
  return tenants.flatMap((tenant) => {
    if (tenant.move_out_date) return [];
    const balance = balanceByTenant.get(tenant.id);
    const room = roomById.get(tenant.room_id);
    if (!balance || !room || balance.overdueCents <= 0) return [];
    const latest = latestReminders.get(`${tenant.id}:reminder`);
    return [
      {
        tenant,
        room,
        balance,
        daysLate: countDaysLate(balance.oldestUnpaidDueDate, today),
        lastReminderAt: latest?.created_at ?? null,
      },
    ];
  });
}

export function wasRemindedWithinDays(lastReminderAt: string | null, now: Date, days = 3): boolean {
  if (!lastReminderAt) return false;
  const last = Date.parse(lastReminderAt);
  if (!Number.isFinite(last)) return false;
  const age = now.getTime() - last;
  return age >= 0 && age < days * 24 * 60 * 60 * 1000;
}

function dateInSA(timestamp: string): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Africa/Johannesburg",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date(timestamp));
  const value = (type: string) => parts.find((part) => part.type === type)?.value ?? "";
  return `${value("year")}-${value("month")}-${value("day")}`;
}

export function sortReminderCandidates(
  candidates: ReminderCandidate[],
  today = todayInSA(),
): ReminderCandidate[] {
  return [...candidates].sort((left, right) => {
    const leftOpenedToday = left.lastReminderAt ? dateInSA(left.lastReminderAt) === today : false;
    const rightOpenedToday = right.lastReminderAt
      ? dateInSA(right.lastReminderAt) === today
      : false;
    return (
      Number(leftOpenedToday) - Number(rightOpenedToday) ||
      right.daysLate - left.daysLate ||
      left.tenant.name.localeCompare(right.tenant.name)
    );
  });
}

export function selectNextReminder(
  candidates: ReminderCandidate[],
  now: Date,
): ReminderCandidate | null {
  const eligible = candidates.filter(
    (candidate) => !wasRemindedWithinDays(candidate.lastReminderAt, now),
  );
  return sortReminderCandidates(eligible, todayInSA(now))[0] ?? null;
}
