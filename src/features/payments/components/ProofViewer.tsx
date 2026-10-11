import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { Sheet } from "@/components/ui/Sheet";
import { usePaymentProofUrl } from "@/features/payments/hooks";

export function ProofViewer({ path }: { path: string | null }) {
  const [open, setOpen] = useState(false);
  const proof = usePaymentProofUrl(path);
  if (!path) return null;
  if (proof.isPending) return <p className="text-secondary text-ink-muted">Loading proof...</p>;
  if (proof.isError) {
    return (
      <p role="alert" className="text-secondary text-ink">
        Payment proof could not be loaded.
      </p>
    );
  }
  const isPdf = path.toLowerCase().endsWith(".pdf");
  if (isPdf) {
    return (
      <a
        className="inline-flex min-h-11 items-center text-body font-semibold text-ink underline"
        href={proof.data}
        target="_blank"
        rel="noreferrer"
      >
        View PDF
      </a>
    );
  }
  return (
    <>
      <Button
        variant="quiet"
        className="p-0"
        onClick={() => setOpen(true)}
        aria-label="Open payment proof"
      >
        <img
          src={proof.data}
          alt="Payment proof"
          className="max-h-48 max-w-full rounded-sm border border-line object-contain"
        />
      </Button>
      <Sheet open={open} onOpenChange={setOpen} title="Payment proof">
        <img
          src={proof.data}
          alt="Payment proof, enlarged"
          className="max-h-[70dvh] w-full object-contain"
        />
      </Sheet>
    </>
  );
}
