import { cn } from "@/lib/utils";
import type { PaymentStatus } from "@/types/domain";

type StatusVariant = PaymentStatus | "vacant" | "inactive";

const config: Record<StatusVariant, { label: string; className: string }> = {
  paid: { label: "Paid", className: "border-status-paid text-status-paid" },
  part_paid: { label: "Part paid", className: "border-status-part text-status-part-ink" },
  late: { label: "Late", className: "border-status-late text-status-late" },
  not_due: { label: "Not due", className: "border-status-neutral text-status-neutral" },
  vacant: { label: "Vacant", className: "border-line text-ink" },
  inactive: { label: "Inactive", className: "border-line text-ink" },
};

/** Payment status or occupancy label. The word is always shown; colour is never the only signal. */
export function StatusTag({
  status,
  variant,
}: {
  status?: PaymentStatus;
  variant?: StatusVariant;
}) {
  const key = variant ?? status ?? "not_due";
  const { label, className } = config[key];
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
