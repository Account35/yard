import { Button } from "@/components/ui/Button";
import { ListRow } from "@/components/ui/ListRow";
import { ordinal } from "@/lib/dates";
import { formatMoney } from "@/lib/money";

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
  if (rooms.data.length === 0) {
    return <p className="py-8 text-body text-ink">No rooms yet. Add your first room.</p>;
  }
  return (
    <ul className="divide-y divide-line border-y border-line">
      {rooms.data.map((room) => (
        <ListRow
          key={room.id}
          primary={room.name}
          secondary={`Due on the ${ordinal(room.due_day)}`}
          trailing={<span className="money text-ink">{formatMoney(room.monthly_rent_cents)}</span>}
        />
      ))}
    </ul>
  );
}
