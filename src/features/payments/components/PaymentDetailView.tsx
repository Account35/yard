import { useState } from "react";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/Button";
import { MessageSheet } from "@/features/messaging/components/MessageSheet";
import { ProofViewer } from "@/features/payments/components/ProofViewer";
import { ReceiptActions, type ReceiptContext } from "@/features/payments/components/ReceiptActions";
import { VoidSheet } from "@/features/payments/components/VoidSheet";
import { PAYMENT_METHOD_LABELS, type Payment, type StatementLine } from "@/types/domain";
import { formatShortDate } from "@/lib/dates";
import { formatMoney } from "@/lib/money";

interface PaymentDetailViewProps {
  payment: Payment;
  receiptContext: ReceiptContext | null;
  statement: StatementLine[];
  recorded: boolean;
  voidSheetOpen: boolean;
  voiding: boolean;
  onVoidSheetOpenChange: (open: boolean) => void;
  onVoid: (reason: string) => Promise<void>;
}

function localDate(timestamp: string): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Africa/Johannesburg",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date(timestamp));
  const value = (type: string) => parts.find((part) => part.type === type)?.value ?? "";
  return `${value("year")}-${value("month")}-${value("day")}`;
}

export function PaymentDetailView({
  payment,
  receiptContext,
  statement,
  recorded,
  voidSheetOpen,
  voiding,
  onVoidSheetOpenChange,
  onVoid,
}: PaymentDetailViewProps) {
  const [receiptMessageOpen, setReceiptMessageOpen] = useState(false);
  const line = statement.find((item) => item.kind === "payment" && item.id === payment.id);
  const isVoided = payment.status === "declined" && payment.voided_at !== null;
  const canManage = payment.status === "confirmed";
  return (
    <div className="space-y-6">
      {recorded && (
        <p role="status" className="text-body text-ink">
          Payment recorded.
        </p>
      )}
      <section className="space-y-3 rounded-md border border-line bg-surface p-4">
        <Detail label="Amount">{formatMoney(payment.amount_cents)}</Detail>
        <Detail label="Date paid">{formatShortDate(payment.paid_on)}</Detail>
        <Detail label="Method">{PAYMENT_METHOD_LABELS[payment.method]}</Detail>
        <Detail label="Receipt">{payment.receipt_number ?? "Not available"}</Detail>
        <Detail label="Recorded">{formatShortDate(localDate(payment.created_at))}</Detail>
        <Detail label="Balance after this payment">
          {line ? formatMoney(line.runningBalanceCents) : "Not available"}
        </Detail>
        {isVoided && payment.voided_at && (
          <div className="border-t border-line pt-3">
            <p className="text-body font-semibold text-ink">
              Voided on {formatShortDate(localDate(payment.voided_at))}
            </p>
            {payment.void_reason && (
              <p className="mt-1 text-secondary text-ink">{payment.void_reason}</p>
            )}
          </div>
        )}
      </section>
      {payment.proof_url && (
        <section className="space-y-2">
          <h2 className="text-body font-semibold text-ink">Proof</h2>
          <ProofViewer path={payment.proof_url} />
        </section>
      )}
      {canManage && (
        <>
          {receiptContext && (
            <>
              <div className="flex flex-wrap items-center gap-2">
                <ReceiptActions context={receiptContext} />
                <Button variant="secondary" onClick={() => setReceiptMessageOpen(true)}>
                  Send receipt on WhatsApp
                </Button>
              </div>
              <MessageSheet
                open={receiptMessageOpen}
                onOpenChange={setReceiptMessageOpen}
                mode={{
                  kind: "receipt",
                  tenant: receiptContext.tenant,
                  room: receiptContext.room,
                  payment: receiptContext.payment,
                }}
                landlord={receiptContext.landlord}
                accessToken={receiptContext.tenant.access_token}
              />
            </>
          )}
          <button
            type="button"
            className="inline-flex min-h-11 items-center rounded-sm border border-line-strong bg-ground px-4 text-body font-semibold text-ink active:bg-line"
            onClick={() => onVoidSheetOpenChange(true)}
          >
            Void payment
          </button>
        </>
      )}
      <VoidSheet
        open={voidSheetOpen}
        saving={voiding}
        onOpenChange={onVoidSheetOpenChange}
        onVoid={onVoid}
      />
    </div>
  );
}

function Detail({ label, children }: { label: string; children: ReactNode }) {
  return (
    <p className="flex items-baseline justify-between gap-4 text-body text-ink">
      <span className="text-ink-muted">{label}</span>
      <span className="text-right font-semibold">{children}</span>
    </p>
  );
}
