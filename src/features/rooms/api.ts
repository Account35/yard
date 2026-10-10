import { supabase } from "@/lib/supabase";
import type { Room } from "@/types/domain";

/** Active rooms the signed-in landlord owns. RLS limits rows to their own properties. */
export async function listActiveRooms(): Promise<Room[]> {
  const { data, error } = await supabase
    .from("rooms")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: true })
    .order("name", { ascending: true });
  if (error) throw error;
  return data;
}
