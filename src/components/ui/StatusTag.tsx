import { cn } from "@/lib/utils";
import type { PaymentStatus } from "@/types/domain";

const config: Record<PaymentStatus, { label: string; className: string }> = {
  paid: { label: "Paid", className: "border-status-paid text-status-paid" },
  part_paid: { label: "Part paid", className: "border-status-part text-status-part-ink" },
  late: { label: "Late", className: "border-status-late text-status-late" },
  not_due: { label: "Not due", className: "border-status-neutral text-status-neutral" },
};

/** Payment status. The word is always shown; colour is never the only signal. */
export function StatusTag({ status }: { status: PaymentStatus }) {
  const { label, className } = config[status];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm border bg-ground px-2 py-0.5 text-secondary font-semibold",
        className,
      )}
    >
      {label}
    </span>
  );
}
