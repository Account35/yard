import { supabase } from "@/lib/supabase";
import type { Payment } from "@/types/domain";

export async function listTenantPayments(tenantId: string): Promise<Payment[]> {
  const { data, error } = await supabase
    .from("payments")
    .select("*")
    .eq("tenant_id", tenantId)
    .order("paid_on", { ascending: true })
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []) as Payment[];
}
