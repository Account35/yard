import { useParams } from "@tanstack/react-router";
import type { ReactNode } from "react";

import { PageHeader } from "@/components/layout/PageHeader";
import { usePublicTenantPage } from "@/features/tenants/hooks";
import { formatShortDate } from "@/lib/dates";
import { formatMoney } from "@/lib/money";

export default function TenantPage() {
  const { token = "" } = useParams({ strict: false });
  const tenantQuery = usePublicTenantPage(token);
  const tenant = tenantQuery.data;

  return (
    <>
      <PageHeader title="Your rent" />
      {tenantQuery.isPending ? (
        <p className="py-6 text-body text-ink-muted">Loading your details...</p>
      ) : tenantQuery.isError ? (
        <p role="alert" className="py-6 text-body text-ink">
          Your details could not be loaded. Check your connection and try again.
        </p>
      ) : !tenant ? (
        <p className="py-6 text-body text-ink">
          This tenant link is no longer valid. Ask your landlord for a new one.
        </p>
      ) : (
        <div className="space-y-4">
          <p className="text-body text-ink">Hello, {tenant.tenant_name}.</p>
          <section className="space-y-3 rounded-md border border-line bg-surface p-4">
            <DetailLine label="Property">{tenant.property_name}</DetailLine>
            <DetailLine label="Room">{tenant.room_name}</DetailLine>
            <DetailLine label="Monthly rent">{formatMoney(tenant.monthly_rent_cents)}</DetailLine>
            <DetailLine label="Rent due day">{tenant.due_day} of each month</DetailLine>
            <DetailLine label="Move-in date">{formatShortDate(tenant.move_in_date)}</DetailLine>
            {tenant.move_out_date && (
              <DetailLine label="Moved out">{formatShortDate(tenant.move_out_date)}</DetailLine>
            )}
          </section>
          <p className="text-secondary text-ink-muted">
            For questions about your rent, contact your landlord.
          </p>
        </div>
      )}
    </>
  );
}

function DetailLine({ label, children }: { label: string; children: ReactNode }) {
  return (
    <p className="flex items-baseline justify-between gap-4 text-body text-ink">
      <span className="text-ink-muted">{label}</span>
      <span className="text-right font-semibold">{children}</span>
    </p>
  );
}
