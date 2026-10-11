import { supabase } from "@/lib/supabase";
import type { Payment, PaymentMethod } from "@/types/domain";

export interface CreatePaymentInput {
  tenantId: string;
  landlordId: string;
  amountCents: number;
  paidOn: string;
  method: PaymentMethod;
  proof: File | null;
}

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

export async function getPayment(tenantId: string, paymentId: string): Promise<Payment | null> {
  const { data, error } = await supabase
    .from("payments")
    .select("*")
    .eq("tenant_id", tenantId)
    .eq("id", paymentId)
    .maybeSingle();
  if (error) throw error;
  return data as Payment | null;
}

export async function createPayment(input: CreatePaymentInput): Promise<Payment> {
  let proofPath: string | null = null;
  if (input.proof) {
    const { prepareProof } = await import("./proof");
    const prepared = await prepareProof(input.proof);
    proofPath = `${input.landlordId}/${input.tenantId}/${crypto.randomUUID()}.${prepared.extension}`;
    const { error: uploadError } = await supabase.storage
      .from("payment-proofs")
      .upload(proofPath, prepared.blob, {
        contentType: prepared.contentType,
        upsert: false,
      });
    if (uploadError) throw uploadError;
  }

  try {
    const { data, error } = await supabase
      .from("payments")
      .insert({
        tenant_id: input.tenantId,
        amount_cents: input.amountCents,
        paid_on: input.paidOn,
        method: input.method,
        proof_url: proofPath,
        status: "confirmed",
        created_by: "landlord",
      })
      .select()
      .single();
    if (error) throw error;
    return data as Payment;
  } catch (error) {
    if (proofPath) {
      try {
        const { error: removeError } = await supabase.storage
          .from("payment-proofs")
          .remove([proofPath]);
        if (removeError)
          console.error("Could not remove uploaded payment proof after save failure.", removeError);
      } catch (cleanupError) {
        console.error("Could not remove uploaded payment proof after save failure.", cleanupError);
      }
    }
    throw error;
  }
}

export async function createProofSignedUrl(path: string): Promise<string> {
  const { data, error } = await supabase.storage
    .from("payment-proofs")
    .createSignedUrl(path, 60 * 60);
  if (error) throw error;
  return data.signedUrl;
}

export async function voidPayment(paymentId: string, reason: string): Promise<void> {
  const { error } = await supabase.rpc("void_payment", {
    p_payment_id: paymentId,
    p_reason: reason,
  });
  if (error) throw error;
}
