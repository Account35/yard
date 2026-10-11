import { Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/Button";
import { ListRow } from "@/components/ui/ListRow";
import { StatusTag } from "@/components/ui/StatusTag";
import { ordinal } from "@/lib/dates";
import { formatMoney } from "@/lib/money";
import { naturalRoomSort } from "@/features/rooms/schema";
import { paths } from "@/router/paths";

import { useActiveRooms } from "../hooks";

export function RoomsList() {
  const rooms = useActiveRooms();
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
  if (ordered.length === 0) {
    return (
      <div className="space-y-4">
        <p className="py-8 text-body text-ink">No rooms yet. Add your first room.</p>
        <Button variant="primary" type="button">
          Add room
        </Button>
      </div>
    );
  }

  return (
    <ul className="divide-y divide-line border-y border-line">
      {ordered.map((room) => (
        <Link key={room.id} to={paths.roomDetail.replace("$roomId", room.id)} className="block">
          <ListRow
            primary={room.name}
            secondary={`R${formatMoney(room.monthly_rent_cents).replace("R", "")} due on the ${ordinal(room.due_day)}`}
            trailing={
              <div className="flex items-center gap-2">
                <span className="money text-ink">{formatMoney(room.monthly_rent_cents)}</span>
                <StatusTag variant="vacant" />
              </div>
            }
            chevron
          />
        </Link>
      ))}
    </ul>
  );
}
