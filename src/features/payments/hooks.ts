import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/lib/queryKeys";

import {
  createPayment,
  createProofSignedUrl,
  getPayment,
  listTenantPayments,
  voidPayment,
  type CreatePaymentInput,
} from "./api";

async function invalidatePaymentData(
  queryClient: ReturnType<typeof useQueryClient>,
  tenantId: string,
  paymentId?: string,
) {
  await Promise.all([
    queryClient.invalidateQueries({ queryKey: queryKeys.charges.balances }),
    queryClient.invalidateQueries({ queryKey: queryKeys.charges.statement(tenantId) }),
    queryClient.invalidateQueries({ queryKey: queryKeys.charges.tenant(tenantId) }),
    queryClient.invalidateQueries({ queryKey: queryKeys.charges.all }),
    queryClient.invalidateQueries({ queryKey: queryKeys.payments.all }),
    queryClient.invalidateQueries({ queryKey: queryKeys.payments.tenant(tenantId) }),
    ...(paymentId
      ? [queryClient.invalidateQueries({ queryKey: queryKeys.payments.payment(paymentId) })]
      : []),
  ]);
}

export function useTenantPayments(tenantId: string) {
  return useQuery({
    queryKey: queryKeys.payments.tenant(tenantId),
    queryFn: () => listTenantPayments(tenantId),
    enabled: tenantId.length > 0,
  });
}

export function usePayment(tenantId: string, paymentId: string) {
  return useQuery({
    queryKey: queryKeys.payments.payment(paymentId),
    queryFn: () => getPayment(tenantId, paymentId),
    enabled: tenantId.length > 0 && paymentId.length > 0,
  });
}

export function usePaymentProofUrl(path: string | null) {
  return useQuery({
    queryKey: queryKeys.payments.proofUrl(path ?? ""),
    queryFn: () => createProofSignedUrl(path ?? ""),
    enabled: path !== null,
    staleTime: 50 * 60 * 1000,
  });
}

export function useCreatePayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreatePaymentInput) => createPayment(input),
    onSuccess: async (payment) => {
      await invalidatePaymentData(queryClient, payment.tenant_id, payment.id);
    },
  });
}

export function useVoidPayment(tenantId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ paymentId, reason }: { paymentId: string; reason: string }) =>
      voidPayment(paymentId, reason),
    onSuccess: async (_, variables) => {
      await invalidatePaymentData(queryClient, tenantId, variables.paymentId);
    },
  });
}
