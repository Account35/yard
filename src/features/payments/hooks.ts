import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/lib/queryKeys";

import { listTenantPayments } from "./api";

export function useTenantPayments(tenantId: string) {
  return useQuery({
    queryKey: queryKeys.payments.tenant(tenantId),
    queryFn: () => listTenantPayments(tenantId),
    enabled: tenantId.length > 0,
  });
}
