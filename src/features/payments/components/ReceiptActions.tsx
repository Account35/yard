import { useState } from "react";

import { Button } from "@/components/ui/Button";
import type { Landlord, Payment, Property, Room, StatementLine, Tenant } from "@/types/domain";

export interface ReceiptContext {
  payment: Payment;
  tenant: Tenant;
  room: Room;
  property: Property;
  landlord: Landlord;
  statement: StatementLine[];
}

export function ReceiptActions({ context }: { context: ReceiptContext }) {
  const [busy, setBusy] = useState<"download" | "share" | null>(null);
  const [error, setError] = useState("");
  const canShare =
    typeof navigator !== "undefined" &&
    typeof navigator.share === "function" &&
    typeof navigator.canShare === "function" &&
    (() => {
      try {
        const probe = new File([], "receipt.pdf", { type: "application/pdf" });
        return navigator.canShare({ files: [probe] });
      } catch {
        return false;
      }
    })();

  async function makeReceipt(action: "download" | "share") {
    setBusy(action);
    setError("");
    try {
      const { buildReceiptData, createReceiptPdf, receiptFileName } =
        await import("@/features/payments/receipt");
      const data = buildReceiptData(
        context.payment,
        context.tenant,
        context.room,
        context.property,
        context.landlord,
        context.statement,
      );
      const fileName = receiptFileName(data.receiptNumber);
      const blob = await createReceiptPdf(data);
      const file = new File([blob], fileName, { type: "application/pdf" });
      if (action === "share" && canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: "Receipt" });
      } else {
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = fileName;
        document.body.append(anchor);
        anchor.click();
        anchor.remove();
        window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      }
    } catch {
      setError("The receipt could not be created. Try again.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        <Button
          variant="secondary"
          loading={busy === "download"}
          onClick={() => void makeReceipt("download")}
        >
          Download receipt
        </Button>
        {canShare && (
          <Button
            variant="secondary"
            loading={busy === "share"}
            onClick={() => void makeReceipt("share")}
          >
            Share receipt
          </Button>
        )}
      </div>
      {error && (
        <p role="alert" className="text-secondary text-ink">
          {error}
        </p>
      )}
    </div>
  );
}
