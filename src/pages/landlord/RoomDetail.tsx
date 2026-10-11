import { useNavigate, useParams } from "@tanstack/react-router";

import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/layout/PageHeader";
import { useActiveRooms } from "@/features/rooms/hooks";
import { paths } from "@/router/paths";

export default function RoomDetail() {
  const { roomId } = useParams({ strict: false });
  const navigate = useNavigate();
  const { data: rooms = [], isPending } = useActiveRooms();
  const room = rooms.find((item) => item.id === roomId) ?? null;

  return (
    <>
      <PageHeader title={room?.name ?? "Room details"} backTo={paths.rooms} />
      <div className="space-y-4">
        <div className="rounded-md border border-line bg-surface p-4">
          <p className="text-secondary text-ink-muted">Room</p>
          <p className="text-title text-ink">{room?.name ?? roomId ?? "Unknown room"}</p>
          {isPending ? (
            <p className="mt-2 text-body text-ink-muted">Loading details...</p>
          ) : room ? (
            <div className="mt-3 space-y-1 text-body text-ink">
              <p>
                Rent:{" "}
                {room.monthly_rent_cents
                  ? `R${(room.monthly_rent_cents / 100).toFixed(2)}`
                  : "R0.00"}
              </p>
              <p>Due day: {room.due_day}</p>
              <p>Status: {room.is_active ? "Active" : "Inactive"}</p>
            </div>
          ) : (
            <p className="mt-2 text-body text-ink">No room details found.</p>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => navigate({ to: paths.rooms })}>
            Back to rooms
          </Button>
          <Button onClick={() => navigate({ to: paths.tenantNew })}>Add tenant</Button>
        </div>
      </div>
    </>
  );
}
