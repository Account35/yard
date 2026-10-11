import { useState } from "react";
import { Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/Button";
import { ListRow } from "@/components/ui/ListRow";
import { StatusTag } from "@/components/ui/StatusTag";
import { deriveStatus } from "@/features/charges/balance";
import { useTenantBalances } from "@/features/charges/hooks";
import { RoomFormSheet } from "@/features/rooms/components/RoomFormSheet";
import { useCreateRoom, useInactiveRooms, useProperty } from "@/features/rooms/hooks";
import { useCurrentTenants } from "@/features/tenants/hooks";
import { ordinal } from "@/lib/dates";
import { formatMoney } from "@/lib/money";
import { naturalRoomSort } from "@/features/rooms/schema";
import { paths } from "@/router/paths";
import type { Room } from "@/types/domain";

import { useActiveRooms } from "../hooks";

export function RoomsList() {
  const [addOpen, setAddOpen] = useState(false);
  const rooms = useActiveRooms();
  const inactiveRooms = useInactiveRooms();
  const tenants = useCurrentTenants();
  const balances = useTenantBalances();
  const property = useProperty();
  const createRoom = useCreateRoom();

  if (rooms.isPending) return <p className="text-body text-ink-muted">Loading</p>;
  if (rooms.isError) {
    return (
      <div className="flex flex-col items-start gap-4">
        <p className="text-body text-ink">Your rooms did not load. Check your connection.</p>
        <Button variant="secondary" onClick={() => void rooms.refetch()}>
          Try again
        </Button>
      </div>
    );
  }

  const ordered = naturalRoomSort(rooms.data ?? []);
  const inactiveOrdered = naturalRoomSort(inactiveRooms.data ?? []);
  const allRooms: Room[] = [...ordered, ...inactiveOrdered];
  const tenantByRoom = new Map((tenants.data ?? []).map((tenant) => [tenant.room_id, tenant]));
  const balanceByTenant = new Map(
    (balances.data ?? []).map((balance) => [balance.tenantId, balance]),
  );

  async function saveRoom(values: { name: string; monthly_rent_cents: number; due_day: number }) {
    if (property.isError) throw property.error;
    if (!property.data) throw new Error("Property details are not available. Try again.");
    await createRoom.mutateAsync({ property_id: property.data.id, ...values });
  }

  return (
    <>
      <div className="mb-4 flex justify-end">
        <Button onClick={() => setAddOpen(true)}>Add room</Button>
      </div>
      {tenants.isError && (
        <p role="alert" className="mb-4 text-secondary font-semibold text-ink">
          Current tenants did not load. Refresh and try again.
        </p>
      )}
      {balances.isError && (
        <p role="alert" className="mb-4 text-secondary font-semibold text-ink">
          Tenant payment statuses did not load. Refresh and try again.
        </p>
      )}
      {ordered.length === 0 ? (
        <p className="py-8 text-body text-ink">No active rooms yet. Add your first room.</p>
      ) : (
        <ul className="divide-y divide-line border-y border-line">
          {ordered.map((room) => {
            const tenant = tenantByRoom.get(room.id);
            const tenantBalance = tenant ? balanceByTenant.get(tenant.id) : undefined;
            return (
              <li key={room.id}>
                <Link to={paths.roomDetail.replace("$roomId", room.id)} className="block">
                  <ListRow
                    primary={room.name}
                    secondary={`Due on the ${ordinal(room.due_day)}`}
                    trailing={
                      <div className="flex items-center gap-2">
                        <span className="money text-ink">
                          {formatMoney(room.monthly_rent_cents)}
                        </span>
                        {tenant ? (
                          <>
                            <span className="max-w-28 truncate text-secondary text-ink">
                              {tenant.name}
                            </span>
                            {balances.isPending ? (
                              <span className="text-secondary text-ink-muted">Checking</span>
                            ) : balances.isError ? (
                              <span className="text-secondary text-ink-muted">Unavailable</span>
                            ) : tenantBalance ? (
                              <StatusTag status={deriveStatus(tenantBalance)} />
                            ) : (
                              <span className="text-secondary text-ink-muted">Unavailable</span>
                            )}
                          </>
                        ) : tenants.isPending || tenants.isError ? (
                          <span className="text-secondary text-ink-muted">
                            {tenants.isPending ? "Checking" : "Unavailable"}
                          </span>
                        ) : (
                          <StatusTag variant="vacant" />
                        )}
                      </div>
                    }
                    chevron
                  />
                </Link>
              </li>
            );
          })}
        </ul>
      )}
      {inactiveRooms.isError && (
        <p role="alert" className="mt-4 text-secondary font-semibold text-ink">
          Inactive rooms did not load. Refresh and try again.
        </p>
      )}
      {inactiveOrdered.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-2 text-body font-semibold text-ink">Inactive rooms</h2>
          <ul className="divide-y divide-line border-y border-line">
            {inactiveOrdered.map((room) => (
              <li key={room.id}>
                <Link to={paths.roomDetail.replace("$roomId", room.id)} className="block">
                  <ListRow
                    primary={room.name}
                    secondary={`Due on the ${ordinal(room.due_day)}`}
                    trailing={<StatusTag variant="inactive" />}
                    chevron
                  />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
      <RoomFormSheet
        open={addOpen}
        onOpenChange={setAddOpen}
        allRooms={allRooms}
        onSave={saveRoom}
      />
    </>
  );
}
