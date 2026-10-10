import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/lib/queryKeys";

import { fetchLandlord } from "./api";
import { useAuth } from "./useAuth";

/** The signed-in user's landlord row, or null if onboarding has not created one yet. */
export function useLandlord() {
  const { user } = useAuth();
  const userId = user?.id ?? "";
  return useQuery({
    queryKey: queryKeys.landlord.me(userId),
    queryFn: () => fetchLandlord(userId),
    enabled: userId !== "",
  });
}
