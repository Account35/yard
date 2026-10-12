import { useState, type ReactNode } from "react";
import { Link, useNavigate, useParams } from "@tanstack/react-router";

import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { BalanceBlock } from "@/features/charges/components/BalanceBlock";
import { Statement } from "@/features/charges/components/Statement";
import { daysLate, deriveStatus } from "@/features/charges/balance";
import { useTenantBalances, useTenantCharges } from "@/features/charges/hooks";
import { useTenantPayments } from "@/features/payments/hooks";
import { useRoom } from "@/features/rooms/hooks";
import { MoveOutSheet } from "@/features/tenants/components/MoveOutSheet";
import { useMoveOutTenant, useRegenerateTenantToken, useTenant } from "@/features/tenants/hooks";
import { formatShortDate, todayInSA } from "@/lib/dates";
import { tenantLink } from "@/lib/links";
import { formatMoney } from "@/lib/money";
import { parseSAPhone } from "@/lib/phone";
import { paths } from "@/router/paths";
import { LANGUAGE_LABELS } from "@/types/domain";

export default function TenantDetail() {
  const { tenantId = "" } = useParams({ strict: false });
  const navigate = useNavigate();
  const tenantQuery = useTenant(tenantId);
  const tenant = tenantQuery.data ?? null;
  const roomQuery = useRoom(tenant?.room_id ?? "");
  const balancesQuery = useTenantBalances();
  const chargesQuery = useTenantCharges(tenantId);
  const paymentsQuery = useTenantPayments(tenantId);
  const moveOut = useMoveOutTenant();
  const regenerate = useRegenerateTenantToken();
  const [moveOutOpen, setMoveOutOpen] = useState(false);
  const [copyMessage, setCopyMessage] = useState("");
  const [actionError, setActionError] = useState("");
  const [tokenOverride, setTokenOverride] = useState<string | null>(null);
  const phone = tenant ? parseSAPhone(tenant.phone) : null;
  const phoneHref = tenant
    ? `tel:${phone?.ok ? phone.phone.e164 : tenant.phone.replace(/[^\d+]/g, "")}`
    : undefined;
  const balance = (balancesQuery.data ?? []).find((item) => item.tenantId === tenant?.id);
  const status = balance ? deriveStatus(balance) : "not_due";
  const daysOverdue =
    status === "late" && balance ? daysLate(balance.oldestUnpaidDueDate, todayInSA()) : 0;

  async function copyLink() {
    if (!tenant) return;
    setCopyMessage("");
    setActionError("");
    try {
      await navigator.clipboard.writeText(tenantLink(tokenOverride ?? tenant.access_token));
      setCopyMessage("Link copied");
    } catch {
      setActionError("The link could not be copied. Check your browser clipboard permissions.");
    }
  }

  async function regenerateLink() {
    if (!tenant || !window.confirm("Regenerate this tenant link? The old link will stop working."))
      return;
    setActionError("");
    setCopyMessage("");
    try {
      const newToken = await regenerate.mutateAsync(tenant.id);
      setTokenOverride(newToken);
      await navigator.clipboard.writeText(tenantLink(newToken));
      setCopyMessage("Link regenerated and copied");
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "The link could not be regenerated.");
    }
  }

  async function moveOutTenant(moveOutDate: string) {
    if (!tenant) return;
    setActionError("");
    await moveOut.mutateAsync({ tenantId: tenant.id, moveOutDate });
    await navigate({ to: paths.rooms });
  }

  return (
    <>
      <PageHeader title={tenant?.name ?? "Tenant"} backTo={paths.rooms} />
      {tenantQuery.isPending ? (
        <p className="py-6 text-body text-ink-muted">Loading tenant details...</p>
      ) : tenantQuery.isError ? (
        <p role="alert" className="py-6 text-body text-ink">
          Tenant details did not load. Check your connection and try again.
        </p>
      ) : !tenant ? (
        <p className="py-6 text-body text-ink">This tenant could not be found.</p>
      ) : (
        <div className="space-y-6">
          <section className="space-y-3 rounded-md border border-line bg-surface p-4">
            <DetailLine label="Room">
              {roomQuery.data ? (
                <Link
                  to={paths.roomDetail.replace("$roomId", roomQuery.data.id)}
                  className="underline"
                >
                  {roomQuery.data.name}
                </Link>
              ) : roomQuery.isPending ? (
                "Loading"
              ) : (
                "Room unavailable"
              )}
            </DetailLine>
            <DetailLine label="WhatsApp number">
              {phone?.ok ? phone.phone.display : tenant.phone}
            </DetailLine>
            <DetailLine label="Move-in date">{formatShortDate(tenant.move_in_date)}</DetailLine>
            <DetailLine label="Deposit">{formatMoney(tenant.deposit_cents)}</DetailLine>
            <DetailLine label="Message language">{LANGUAGE_LABELS[tenant.language]}</DetailLine>
            {roomQuery.data && (
              <>
                <DetailLine label="Monthly rent">
                  {formatMoney(roomQuery.data.monthly_rent_cents)}
                </DetailLine>
                <DetailLine label="Rent due day">{roomQuery.data.due_day}</DetailLine>
              </>
            )}
            {tenant.move_out_date && (
              <p className="border-t border-line pt-3 text-body font-semibold text-ink">
                Moved out on {formatShortDate(tenant.move_out_date)}
              </p>
            )}
          </section>

          {actionError && (
            <p role="alert" className="text-secondary font-semibold text-ink">
              {actionError}
            </p>
          )}
          {copyMessage && (
            <p role="status" className="text-secondary font-semibold text-ink">
              {copyMessage}
            </p>
          )}
          <div className="flex flex-wrap gap-2">
            {phoneHref && (
              <a
                className="inline-flex min-h-12 items-center justify-center rounded-sm border border-line-strong bg-ground px-4 text-body font-semibold text-ink"
                href={phoneHref}
              >
                Call
              </a>
            )}
            {!tenant.move_out_date && (
              <>
                <Button
                  onClick={() =>
                    void navigate({
                      to: paths.recordPayment.replace("$tenantId", tenant.id),
                    })
                  }
                >
                  Record payment
                </Button>
                <Button variant="secondary" onClick={() => void copyLink()}>
                  Copy tenant link
                </Button>
                <Button
                  variant="secondary"
                  loading={regenerate.isPending}
                  onClick={() => void regenerateLink()}
                >
                  Regenerate link
                </Button>
                <Button
                  variant="secondary"
                  onClick={() =>
                    void navigate({
                      to: paths.tenantEdit.replace("$tenantId", tenant.id),
                    })
                  }
                >
                  Edit
                </Button>
                <Button variant="secondary" onClick={() => setMoveOutOpen(true)}>
                  Move out
                </Button>
              </>
            )}
          </div>
          {!tenant.move_out_date && (
            <MoveOutSheet
              open={moveOutOpen}
              onOpenChange={setMoveOutOpen}
              tenantName={tenant.name}
              moveInDate={tenant.move_in_date}
              balanceCents={balance?.balanceCents ?? 0}
              onConfirm={moveOutTenant}
            />
          )}

          {balancesQuery.isPending || chargesQuery.isPending || paymentsQuery.isPending ? (
            <p className="py-4 text-body text-ink-muted">Loading statement...</p>
          ) : balancesQuery.isError || chargesQuery.isError || paymentsQuery.isError ? (
            <p role="alert" className="py-4 text-body text-ink">
              The tenant statement did not load. Check your connection and try again.
            </p>
          ) : (
            <>
              {balance && (
                <BalanceBlock
                  balanceCents={balance.balanceCents}
                  status={status}
                  daysLate={daysOverdue}
                />
              )}
              <section className="space-y-3">
                <h2 className="text-body font-semibold text-ink">Statement</h2>
                <Statement
                  charges={chargesQuery.data ?? []}
                  payments={paymentsQuery.data ?? []}
                  readOnly={tenant.move_out_date !== null}
                />
              </section>
            </>
          )}
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
