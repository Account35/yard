import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/lib/queryKeys";

import { listActiveRooms } from "./api";

export function useActiveRooms() {
  return useQuery({ queryKey: queryKeys.rooms.active, queryFn: listActiveRooms });
}
