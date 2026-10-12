import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { formatShortDate } from "@/lib/dates";
import { formatMoney } from "@/lib/money";
import { parseSAPhone } from "@/lib/phone";
import { PAYMENT_METHOD_LABELS, type ReceiptData } from "@/types/domain";

import type { PublicTenantPage, PublicTenantReceipt } from "../api";

interface PublicTenantReceiptsProps {
  tenant: PublicTenantPage;
  receipts: PublicTenantReceipt[];
  isPending: boolean;
  isError: boolean;
}

function issuedOn(timestamp: string): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Africa/Johannesburg",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date(timestamp));
  const part = (type: string) => parts.find((item) => item.type === type)?.value ?? "";
  return `${part("year")}-${part("month")}-${part("day")}`;
}

function receiptData(tenant: PublicTenantPage, receipt: PublicTenantReceipt): ReceiptData {
  const landlordPhone = parseSAPhone(tenant.landlord_phone);
  return {
    receiptNumber: receipt.receipt_number,
    issuedOn: issuedOn(receipt.created_at),
    landlordName: tenant.landlord_name,
    landlordPhone: landlordPhone.ok ? landlordPhone.phone.display : tenant.landlord_phone,
    propertyName: tenant.property_name,
    propertyAddress: tenant.property_address,
    tenantName: tenant.tenant_name,
    roomName: tenant.room_name,
    amountCents: receipt.amount_cents,
    paidOn: receipt.paid_on,
    method: receipt.method,
    balanceAfterCents: receipt.balance_after_cents,
  };
}

export function PublicTenantReceipts({
  tenant,
  receipts,
  isPending,
  isError,
}: PublicTenantReceiptsProps) {
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function download(receipt: PublicTenantReceipt) {
    setDownloadingId(receipt.receipt_number);
    setError("");
    try {
      const { createReceiptPdf, receiptFileName } = await import("@/features/payments/receipt");
      const data = receiptData(tenant, receipt);
      const blob = await createReceiptPdf(data);
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = receiptFileName(data.receiptNumber);
      document.body.append(anchor);
      anchor.click();
      anchor.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch {
      setError("The receipt could not be downloaded. Try again.");
    } finally {
      setDownloadingId(null);
    }
  }

  return (
    <section className="space-y-3">
      <h2 className="text-body font-semibold text-ink">Payment history and receipts</h2>
      {isPending ? (
        <p className="text-secondary text-ink-muted">Loading payment history...</p>
      ) : isError ? (
        <p role="alert" className="text-secondary text-ink">
          Payment history could not be loaded. Refresh the page and try again.
        </p>
      ) : receipts.length === 0 ? (
        <p className="text-secondary text-ink-muted">No confirmed payments yet.</p>
      ) : (
        <ul className="divide-y divide-line border-y border-line">
          {receipts.map((receipt) => (
            <li
              key={receipt.receipt_number}
              className="flex flex-wrap items-center justify-between gap-3 py-3"
            >
              <div>
                <p className="money text-body font-semibold text-ink">
                  {formatMoney(receipt.amount_cents)}
                </p>
                <p className="text-secondary text-ink-muted">
                  {formatShortDate(receipt.paid_on)} · {PAYMENT_METHOD_LABELS[receipt.method]}
                </p>
                <p className="text-secondary text-ink-muted">Receipt {receipt.receipt_number}</p>
              </div>
              <Button
                variant="secondary"
                loading={downloadingId === receipt.receipt_number}
                loadingLabel="Preparing"
                onClick={() => void download(receipt)}
              >
                Download receipt
              </Button>
            </li>
          ))}
        </ul>
      )}
      {error && (
        <p role="alert" className="text-secondary text-ink">
          {error}
        </p>
      )}
    </section>
  );
}
