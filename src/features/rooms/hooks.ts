import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/lib/queryKeys";

import {
  createRoom,
  getProperty,
  listActiveRooms,
  listInactiveRooms,
  setRoomActive,
  updateRoom,
} from "./api";

export function useActiveRooms() {
  return useQuery({ queryKey: queryKeys.rooms.active, queryFn: listActiveRooms });
}

export function useInactiveRooms() {
  return useQuery({ queryKey: ["rooms", "inactive"], queryFn: listInactiveRooms });
}

export function useProperty() {
  return useQuery({ queryKey: queryKeys.rooms.property, queryFn: getProperty });
}

export function useCreateRoom() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createRoom,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.rooms.all });
    },
  });
}

export function useUpdateRoom() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      roomId,
      input,
    }: {
      roomId: string;
      input: Partial<Parameters<typeof updateRoom>[1]>;
    }) => updateRoom(roomId, input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.rooms.all });
    },
  });
}

export function useSetRoomActive() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ roomId, isActive }: { roomId: string; isActive: boolean }) =>
      setRoomActive(roomId, isActive),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.rooms.all });
    },
  });
}
